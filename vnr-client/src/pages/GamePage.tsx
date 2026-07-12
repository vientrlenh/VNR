import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../features/quiz/hooks/useQuiz'
import { useCountdown } from '../features/quiz/hooks/useCountdown'
import './GamePage.css'

const CHOICE_LABELS = ['A', 'B', 'C', 'D']

export function GamePage() {
    const navigate = useNavigate()
    const { session, status, question, result, submitAnswer, ranked, myScore, myRank, totalPlayers } = useQuiz()
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
    const [lastQuestionId, setLastQuestionId] = useState(question?.id)

    useEffect(() => {
        if (!session) navigate('/', { replace: true })
    }, [session, navigate])

    if (question?.id !== lastQuestionId) {
        setLastQuestionId(question?.id)
        setSelectedOptionId(null)
    }

    const durationMs = (question?.timeLimitSec ?? 0) * 1000
    const remainingMs = useCountdown(durationMs, question?.id)
    const progress = durationMs > 0 ? Math.max(0, remainingMs / durationMs) * 100 : 0

    function handleChoose(optionId: number) {
        if (selectedOptionId !== null) return
        setSelectedOptionId(optionId)
        submitAnswer(optionId)
    }

    if (!session) return null

    return (
        <main className="game-page">
            <div className="game-scorecard">
                <span className="game-scorecard-name">{session.nickname}</span>
                <span className="game-scorecard-score-wrap">
                    <span className="game-scorecard-score">{myScore} điểm</span>
                    {result?.correct && (
                        <span className="game-bonus-popup" key={question?.id ?? 'finished'}>
                            +{result.bonusScore}
                        </span>
                    )}
                </span>
                <span className="game-scorecard-rank">
                    {myRank ? `Hạng ${myRank}${totalPlayers ? `/${totalPlayers}` : ''}` : '—'}
                </span>
            </div>

            {status === 'finished' ? (
                <section className="game-card">
                    <p className="game-eyebrow">Hoàn thành</p>
                    <h1>Cảm ơn {session.nickname} đã tham gia!</h1>

                    {myRank && (
                        <span className="game-final-rank">
                            🏅 Hạng {myRank}{totalPlayers ? `/${totalPlayers}` : ''}
                        </span>
                    )}
                    <p className="game-final-score">
                        <span className="game-final-score-value">{myScore}</span>
                        <span className="game-final-score-label">điểm</span>
                    </p>

                    {ranked.length > 0 && (
                        <ol className="game-result-list">
                            {ranked.map((player, index) => {
                                const rank = index + 1
                                const isMe = player.id === session.playerId
                                const podiumClass =
                                    rank === 1
                                        ? ' game-result-row-gold'
                                        : rank === 2
                                          ? ' game-result-row-silver'
                                          : rank === 3
                                            ? ' game-result-row-bronze'
                                            : ''
                                return (
                                    <li
                                        key={player.id}
                                        className={`game-result-row${podiumClass}${isMe ? ' game-result-row-me' : ''}`}
                                    >
                                        <span className="game-result-rank">{rank}</span>
                                        <span className="game-result-nickname">
                                            <span className="game-result-nickname-text">{player.nickname}</span>
                                            {isMe && <span className="game-result-tag">Bạn</span>}
                                        </span>
                                        <span className="game-result-score">{player.score}</span>
                                    </li>
                                )
                            })}
                        </ol>
                    )}

                    <button type="button" className="game-submit" onClick={() => navigate('/')}>
                        Về trang chủ
                    </button>
                </section>
            ) : status === 'connecting' || status === 'waiting' || !question ? (
                <p className="game-status">
                    {status === 'connecting' ? 'Đang kết nối...' : 'Đang chờ câu hỏi tiếp theo...'}
                </p>
            ) : (
                <section className="game-card" key={question.id}>
                    <div className="game-progress">
                        <div className="game-progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                    <h1>{question.title}</h1>

                    <div className="game-choices">
                        {question.options.map((option, index) => {
                            const isSelected = selectedOptionId === option.id
                            const isCorrect = !!result && option.id === result.correctOptionId
                            const isWrong = !!result && option.id !== result.correctOptionId
                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    className={`game-choice${isSelected && !result ? ' selected' : ''}${isCorrect ? ' correct' : ''}${isWrong ? ' wrong' : ''}${isSelected && isWrong ? ' picked' : ''}`}
                                    onClick={() => handleChoose(option.id)}
                                    disabled={selectedOptionId !== null || !!result}
                                >
                                    <span className="game-choice-label">
                                        {isCorrect ? '✓' : isWrong ? '✕' : CHOICE_LABELS[index]}
                                    </span>
                                    {option.content}
                                </button>
                            )
                        })}
                    </div>

                    {result && (
                        <p className={`game-feedback${result.correct ? ' correct' : ' wrong'}`}>
                            {result.correct ? `Chính xác! +${result.bonusScore} điểm` : 'Chưa đúng rồi.'}
                        </p>
                    )}
                </section>
            )}
        </main>
    )
}
