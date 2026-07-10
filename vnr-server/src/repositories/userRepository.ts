import { prisma } from "../lib/prisma.js";

export async function getUserByEmail(email: string) {
    const user = await prisma.user.findFirst({
        where: { email: email }
    })
    return user
}