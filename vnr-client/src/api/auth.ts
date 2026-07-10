import { api } from './client'
import type { LoginRequest, LoginResponse } from '../types'

export function login(payload: LoginRequest) {
  return api.post<LoginResponse>('/auth/login', payload)
}
