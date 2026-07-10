import { api } from './client'
import type { Player } from '../types'

export async function getLeaderboard() {
  // TODO: xác nhận đúng endpoint khi backend sẵn sàng
  const { data } = await api.get<Player[]>('/leaderboard')
  return data
}
