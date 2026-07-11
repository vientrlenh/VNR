export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface Player {
  id: number
  nickname: string
  score: number
}

export interface JoinGameResponse {
  playerId: number
  gameId: number
  nickname: string
}

export interface CurrentGameResponse {
  gameId: number
  name: string
}

export interface QuestionOption {
  id: number
  content: string
}

export interface Question {
  id: number
  title: string
  type: string
  timeLimitSec: number
  options: QuestionOption[]
}

export interface AnswerResult {
  correct: boolean
  correctOptionId?: number
  bonusScore: number
  totalScore: number
}
