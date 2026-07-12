import { prisma } from "../lib/prisma.js";

export async function getAnsweredQuestionIds(playerId: number) {
    const answers = await prisma.playerAnswer.findMany({
        where: { playerId },
        select: { questionId: true },
    })
    return answers.map((a) => a.questionId)
}

interface CreatePlayerAnswerParams {
    playerId: number
    questionId: number
    optionId?: number
    bonusScore: number
    remainingTime: number
}

export async function createPlayerAnswer(data: CreatePlayerAnswerParams) {
    return prisma.playerAnswer.create({
        data: {
            playerId: data.playerId,
            questionId: data.questionId,
            optionId: data.optionId ?? null,
            bonusScore: data.bonusScore,
            remainingTime: data.remainingTime,
            answerAt: new Date(),
        },
    })
}
