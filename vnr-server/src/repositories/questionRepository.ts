import { prisma } from "../lib/prisma.js";

export async function getAllQuestions() {
    return prisma.question.findMany({
        orderBy: { id: 'asc' },
        include: { options: true },
    })
}

export async function getQuestionById(id: number) {
    return prisma.question.findUnique({
        where: { id },
        include: { options: true },
    })
}
