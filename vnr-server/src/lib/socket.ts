import { Server, type Socket } from 'socket.io'
import type { Server as HttpServer } from 'http'
import { verifyToken, type JwtPayload } from './jwt.js'
import { getGameById } from '../repositories/gameRepository.js'
import { getPlayerById, getPlayersByGame } from '../repositories/playerRepository.js'
import { getNextQuestionForPlayer, submitAnswer } from '../services/quizService.js'

interface SocketData {
    user?: JwtPayload
    gameId?: number
    playerId?: number
    nickname?: string
    currentQuestionId?: number | undefined
    currentTimeLimitSec?: number
    questionSentAt?: number
}

interface JoinAck {
    ok: boolean
    error?: string
}

interface QuestionOptionPayload {
    id: number
    content: string
}

interface QuestionPayload {
    id: number
    title: string
    type: string
    timeLimitSec: number
    options: QuestionOptionPayload[]
}

interface AnswerResultPayload {
    correct: boolean
    correctOptionId?: number | undefined
    bonusScore: number
    totalScore: number
}

interface LeaderboardEntry {
    id: number
    nickname: string
    score: number
}

interface HostClientToServerEvents {
    'game:join': (payload: { gameId: number }, ack: (res: JoinAck) => void) => void
}

interface PlayerClientToServerEvents {
    'answer:submit': (payload: { questionId: number; optionId: number }) => void
}

type ClientToServerEvents = HostClientToServerEvents & PlayerClientToServerEvents

interface ServerToClientEvents {
    'question:next': (payload: QuestionPayload) => void
    'answer:result': (payload: AnswerResultPayload) => void
    'game:finished': () => void
    'leaderboard:update': (payload: LeaderboardEntry[]) => void
}

type AppServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>
type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5174'

export function gameRoom(gameId: number) {
    return `game:${gameId}`
}

let io: AppServer

export function initSocket(httpServer: HttpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: CLIENT_URL,
            methods: ['GET', 'POST']
        },
        connectionStateRecovery: {}
    })

    initHostNamespace(io)
    initPlayerNamespace(io)

    return io
}

// Namespace mặc định "/" — dành cho host, xác thực bằng JWT (đã đăng nhập)
function initHostNamespace(io: AppServer) {
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token
        if (!token) {
            return next(new Error('Unauthorized: missing token'))
        }
        try {
            socket.data.user = verifyToken(token)
            next()
        } catch {
            next(new Error('Unauthorized: invalid token'))
        }
    })

    io.on('connection', (socket) => {
        const user = socket.data.user!
        console.log(`Host connected: ${socket.id} (${user.email})`)

        socket.on('game:join', async (payload, ack) => {
            const gameId = payload?.gameId
            if (typeof gameId !== 'number') {
                return ack({ ok: false, error: 'gameId không hợp lệ' })
            }

            const game = await getGameById(gameId)
            if (!game) {
                return ack({ ok: false, error: 'Không tìm thấy game' })
            }
            if (game.hostId !== user.userId) {
                return ack({ ok: false, error: 'Bạn không phải host của game này' })
            }

            if (socket.data.gameId !== undefined) {
                socket.leave(gameRoom(socket.data.gameId))
            }
            socket.data.gameId = gameId
            socket.join(gameRoom(gameId))
            ack({ ok: true })
        })

        socket.on('disconnect', () => {
            console.log(`Host disconnected: ${socket.id}`)
        })
    })
}

// Namespace "/player" — dành cho người chơi chỉ nhập nickname (không có JWT),
// xác thực bằng playerId + gameId đã có sẵn từ lúc join game qua REST
function initPlayerNamespace(io: AppServer) {
    const playerNsp = io.of('/player')

    playerNsp.use(async (socket, next) => {
        const { playerId, gameId } = socket.handshake.auth ?? {}
        if (typeof playerId !== 'number' || typeof gameId !== 'number') {
            return next(new Error('Unauthorized: missing playerId/gameId'))
        }

        const player = await getPlayerById(playerId)
        if (!player || player.gameId !== gameId) {
            return next(new Error('Unauthorized: invalid player'))
        }

        socket.data.playerId = player.id
        socket.data.gameId = player.gameId
        socket.data.nickname = player.nickname
        next()
    })

    playerNsp.on('connection', (socket) => {
        const gameId = socket.data.gameId!
        const playerId = socket.data.playerId!
        socket.join(gameRoom(gameId))
        console.log(`Player connected: ${socket.data.nickname} (game ${gameId})`)

        void sendNextQuestion(socket, playerId)

        socket.on('answer:submit', async (payload) => {
            const questionId = payload?.questionId
            const optionId = payload?.optionId
            if (typeof questionId !== 'number' || typeof optionId !== 'number') {
                return
            }
            if (socket.data.currentQuestionId !== questionId) {
                return
            }

            const timeLimitSec = socket.data.currentTimeLimitSec!
            const questionSentAt = socket.data.questionSentAt!
            // Chặn nộp trùng cho cùng một câu trong lúc đang xử lý bất đồng bộ ở dưới
            socket.data.currentQuestionId = undefined

            const result = await submitAnswer({ playerId, questionId, optionId, timeLimitSec, questionSentAt })
            if (!result) {
                return
            }

            socket.emit('answer:result', result)
            await broadcastLeaderboard(gameId)
            await sendNextQuestion(socket, playerId)
        })

        socket.on('disconnect', () => {
            console.log(`Player disconnected: ${socket.data.nickname}`)
        })
    })
}

async function sendNextQuestion(socket: AppSocket, playerId: number) {
    const question = await getNextQuestionForPlayer(playerId)
    if (!question) {
        socket.data.currentQuestionId = undefined
        socket.emit('game:finished')
        return
    }

    socket.data.currentQuestionId = question.id
    socket.data.currentTimeLimitSec = question.timeLimitSec
    socket.data.questionSentAt = Date.now()

    socket.emit('question:next', {
        id: question.id,
        title: question.title,
        type: question.type,
        timeLimitSec: question.timeLimitSec,
        options: question.options.map((o) => ({ id: o.id, content: o.content })),
    })
}

async function broadcastLeaderboard(gameId: number) {
    const players = await getPlayersByGame(gameId)
    const payload: LeaderboardEntry[] = players.map((p) => ({ id: p.id, nickname: p.nickname, score: p.score }))
    io.of('/').to(gameRoom(gameId)).emit('leaderboard:update', payload)
    io.of('/player').to(gameRoom(gameId)).emit('leaderboard:update', payload)
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.io chưa được khởi tạo — gọi initSocket() trước')
    }
    return io
}
