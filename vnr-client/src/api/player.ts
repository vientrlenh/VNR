import { api } from './client'
import type { JoinGameResponse } from '../types'

export function joinGame(nickname: string) {
  return api.post<JoinGameResponse>('/players/join', { nickname })
}

const NICKNAME_KEY = 'vnr_player_nickname'
const PLAYER_ID_KEY = 'vnr_player_id'
const GAME_ID_KEY = 'vnr_player_game_id'

export function savePlayerSession(session: JoinGameResponse) {
  sessionStorage.setItem(NICKNAME_KEY, session.nickname)
  sessionStorage.setItem(PLAYER_ID_KEY, String(session.playerId))
  sessionStorage.setItem(GAME_ID_KEY, String(session.gameId))
}

export function getPlayerSession() {
  const nickname = sessionStorage.getItem(NICKNAME_KEY)
  const playerId = sessionStorage.getItem(PLAYER_ID_KEY)
  const gameId = sessionStorage.getItem(GAME_ID_KEY)
  if (!nickname || !playerId || !gameId) return null
  return { nickname, playerId: Number(playerId), gameId: Number(gameId) }
}
