import { useEffect, useState } from 'react'
import type { Player } from '../../../types'
import { socket } from '../../../api/socket'
import { getCurrentGame } from '../../../api/game'

const PAGE_SIZE = 10
const ROTATE_INTERVAL_MS = 6000

type Status = 'loading' | 'ready' | 'error'

interface JoinAck {
  ok: boolean
  error?: string
}

export function useLeaderboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [page, setPage] = useState(0)

  useEffect(() => {
    let cancelled = false

    function handleUpdate(data: Player[]) {
      setPlayers([...data].sort((a, b) => b.score - a.score))
    }
    socket.on('leaderboard:update', handleUpdate)

    async function connectAndJoin() {
      let gameId: number
      try {
        const { data } = await getCurrentGame()
        gameId = data.gameId
      } catch {
        if (!cancelled) {
          setStatus('error')
          setErrorMessage('Không thể lấy thông tin game. Vui lòng thử lại.')
        }
        return
      }

      function joinGame() {
        socket.emit('game:join', { gameId }, (ack: JoinAck) => {
          if (cancelled) return
          if (ack.ok) {
            setStatus('ready')
          } else {
            setStatus('error')
            setErrorMessage(ack.error ?? 'Không thể tham gia game')
          }
        })
      }

      if (socket.connected) {
        joinGame()
      } else {
        socket.once('connect', joinGame)
        socket.connect()
      }
    }

    connectAndJoin()

    return () => {
      cancelled = true
      socket.off('leaderboard:update', handleUpdate)
      socket.disconnect()
    }
  }, [])

  const totalPages = Math.max(1, Math.ceil(players.length / PAGE_SIZE))
  // Nếu danh sách rút ngắn khiến trang đang lưu vượt quá tổng số trang mới, kẹp lại khi render thay vì qua effect
  const safePage = page % totalPages

  useEffect(() => {
    if (totalPages <= 1) return
    const interval = setInterval(() => {
      setPage((p) => (p + 1) % totalPages)
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [totalPages])

  const pagedPlayers = players.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

  return {
    players: pagedPlayers,
    loading: status === 'loading',
    error: status === 'error' ? errorMessage : null,
    page: safePage,
    totalPages,
  }
}
