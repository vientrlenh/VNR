import { api } from './client'
import type { CurrentGameResponse } from '../types'

export function getCurrentGame() {
  return api.get<CurrentGameResponse>('/games/current')
}
