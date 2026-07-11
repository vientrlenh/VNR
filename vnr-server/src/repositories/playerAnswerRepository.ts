import { prisma } from "../lib/prisma.js";

export async function getAnsweredQuestionIds(playerId: number) {
    const answers = await prisma.playerAnswer.findMany({
        where: { playerId },
        include: { option: true },
    })
    return answers.map((a) => a.option.questionId)
}

interface CreatePlayerAnswerParams {
    playerId: number
    optionId: number
    bonusScore: number
    remainingTime: number
}

export async function createPlayerAnswer(data: CreatePlayerAnswerParams) {
    return prisma.playerAnswer.create({
        data: {
            playerId: data.playerId,
            optionId: data.optionId,
            bonusScore: data.bonusScore,
            remainingTime: data.remainingTime,
            answerAt: new Date(),
        },
    })
}
