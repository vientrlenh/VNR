export type QuestionType = 'SINGLE' | 'MULTIPLE'

export interface Question {
    id: number
    title: string 
    correctAns: number
    type: QuestionType
    timeLimitSec: number
}