import { io } from 'socket.io-client'
import { getPlayerSession } from './player'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3000'

export const playerSocket = io(`${SOCKET_URL}/player`, {
  autoConnect: false,
  auth: (cb) => {
    const session = getPlayerSession()
    cb({ playerId: session?.playerId, gameId: session?.gameId })
  },
})
