import { Server } from 'socket.io'
import type { Server as HttpServer } from 'http'
import { verifyToken, type JwtPayload } from './jwt.js'

interface SocketData {
    user: JwtPayload
}

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5174'

let io: Server<Record<string, never>, Record<string, never>, Record<string, never>, SocketData>

export function initSocket(httpServer: HttpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: CLIENT_URL,
            methods: ['GET', 'POST']
        },
        connectionStateRecovery: {}
    })

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
        console.log(`Host connected: ${socket.id} (${socket.data.user.email})`)

        socket.on('disconnect', () => {
            console.log(`Host disconnected: ${socket.id}`)
        })
    })

    return io
}

export function getIO() {
    if (!io) {
        throw new Error('Socket.io chưa được khởi tạo — gọi initSocket() trước')
    }
    return io
}
