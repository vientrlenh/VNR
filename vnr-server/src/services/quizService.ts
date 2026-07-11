import { getAllQuestions, getQuestionById } from "../repositories/questionRepository.js";
import { getAnsweredQuestionIds, createPlayerAnswer } from "../repositories/playerAnswerRepository.js";
import { incrementPlayerScore } from "../repositories/playerRepository.js";

const BASE_SCORE = 50
const SPEED_BONUS = 50

export async function getNextQuestionForPlayer(playerId: number) {
    const [allQuestions, answeredIds] = await Promise.all([
        getAllQuestions(),
        getAnsweredQuestionIds(playerId),
    ])
    const answeredSet = new Set(answeredIds)
    return allQuestions.find((q) => !answeredSet.has(q.id)) ?? null
}

interface SubmitAnswerParams {
    playerId: number
    questionId: number
    optionId: number
    timeLimitSec: number
    questionSentAt: number
}

export async function submitAnswer({ playerId, questionId, optionId, timeLimitSec, questionSentAt }: SubmitAnswerParams) {
    const question = await getQuestionById(questionId)
    const option = question?.options.find((o) => o.id === optionId)
    if (!question || !option) {
        return null
    }

    const elapsedSec = (Date.now() - questionSentAt) / 1000
    const remainingTime = Math.max(0, Math.round(timeLimitSec - elapsedSec))
    const correct = option.isCorrect
    // Điểm nền cho câu đúng + thưởng theo tỉ lệ thời gian còn lại (trả lời càng nhanh, điểm càng cao)
    const bonusScore = correct
        ? Math.round(BASE_SCORE + SPEED_BONUS * (remainingTime / timeLimitSec))
        : 0

    await createPlayerAnswer({ playerId, optionId, bonusScore, remainingTime })
    const player = await incrementPlayerScore(playerId, bonusScore, correct)

    const correctOption = question.options.find((o) => o.isCorrect)

    return {
        correct,
        correctOptionId: correctOption?.id,
        bonusScore,
        totalScore: player.score,
    }
}
