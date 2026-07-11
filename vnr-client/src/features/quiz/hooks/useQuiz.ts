import { useEffect, useState } from 'react'
import type { AnswerResult, Player, Question } from '../../../types'
import { playerSocket } from '../../../api/playerSocket'
import { getPlayerSession } from '../../../api/player'

type Status = 'connecting' | 'waiting' | 'question' | 'answered' | 'finished'

export function useQuiz() {
  const [session] = useState(() => getPlayerSession())
  const [status, setStatus] = useState<Status>('connecting')
  const [question, setQuestion] = useState<Question | null>(null)
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    if (!session) return

    function handleConnect() {
      setStatus((prev) => (prev === 'connecting' ? 'waiting' : prev))
    }
    function handleQuestion(q: Question) {
      setQuestion(q)
      setResult(null)
      setStatus('question')
    }
    function handleResult(r: AnswerResult) {
      setResult(r)
      setStatus('answered')
    }
    function handleFinished() {
      setStatus('finished')
      setQuestion(null)
    }
    function handleLeaderboard(data: Player[]) {
      setPlayers(data)
    }

    playerSocket.on('connect', handleConnect)
    playerSocket.on('question:next', handleQuestion)
    playerSocket.on('answer:result', handleResult)
    playerSocket.on('game:finished', handleFinished)
    playerSocket.on('leaderboard:update', handleLeaderboard)
    playerSocket.connect()

    return () => {
      playerSocket.off('connect', handleConnect)
      playerSocket.off('question:next', handleQuestion)
      playerSocket.off('answer:result', handleResult)
      playerSocket.off('game:finished', handleFinished)
      playerSocket.off('leaderboard:update', handleLeaderboard)
      playerSocket.disconnect()
    }
  }, [session])

  function submitAnswer(optionId: number) {
    if (!question) return
    // Không gửi thời gian trả lời — server tự tính dựa trên mốc lúc gửi câu hỏi và lúc nhận câu trả lời
    playerSocket.emit('answer:submit', { questionId: question.id, optionId })
  }

  const ranked = [...players].sort((a, b) => b.score - a.score)
  const myIndex = session ? ranked.findIndex((p) => p.id === session.playerId) : -1
  const me = myIndex >= 0 ? ranked[myIndex] : null

  return {
    session,
    status,
    question,
    result,
    submitAnswer,
    myScore: me?.score ?? result?.totalScore ?? 0,
    myRank: myIndex >= 0 ? myIndex + 1 : null,
    totalPlayers: ranked.length,
  }
}
