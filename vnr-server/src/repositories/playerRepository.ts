import { prisma } from "../lib/prisma.js";

export async function getAllPlayers() {
    const players = await prisma.player.findMany()
    return players
}

export async function getPlayerById(id: number) {
    const player = await prisma.player.findUnique({
        where: { id }
    })
    return player
}

export async function getPlayersByGame(gameId: number) {
    return prisma.player.findMany({
        where: { gameId }
    })
}

export async function incrementPlayerScore(playerId: number, points: number, correct: boolean) {
    return prisma.player.update({
        where: { id: playerId },
        data: {
            score: { increment: points },
            correctAnswer: { increment: correct ? 1 : 0 },
            incorrectAnswer: { increment: correct ? 0 : 1 }
        }
    })
}

export async function getPlayerByNickname(gameId: number, nickname: string) {
    const player = await prisma.player.findFirst({
        where: { gameId, nickname }
    })
    return player
}

export async function createPlayer(gameId: number, nickname: string) {
    const player = await prisma.player.create({
        data: {
            gameId,
            nickname,
            score: 0
        }
    })
    return player
}