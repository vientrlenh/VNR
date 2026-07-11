import { prisma } from "../lib/prisma.js";

export async function getAllPlayers() {
    const players = await prisma.player.findMany()
    return players
}