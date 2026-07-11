import { prisma } from "../lib/prisma.js";

export async function getGameById(id: number) {
    const game = await prisma.game.findUnique({
        where: { id }
    })
    return game
}

export async function getCurrentGame() {
    const game = await prisma.game.findFirst({
        orderBy: { id: 'desc' }
    })
    return game
}

export async function getCurrentGameForHost(hostId: number) {
    const game = await prisma.game.findFirst({
        where: { hostId },
        orderBy: { id: 'desc' }
    })
    return game
}
