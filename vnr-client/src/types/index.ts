export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface Player {
  id: string
  nickname: string
  score: number
}
