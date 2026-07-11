import { io } from 'socket.io-client'
import { getAuthToken } from './client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3000'

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: (cb) => cb({ token: getAuthToken() }),
})
