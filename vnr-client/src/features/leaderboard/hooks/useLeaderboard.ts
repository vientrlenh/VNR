import { useEffect, useState } from 'react'
import type { Player } from '../../../types'
import { socket } from '../../../api/socket'

const PAGE_SIZE = 10
const ROTATE_INTERVAL_MS = 6000

export function useLeaderboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [connected, setConnected] = useState(false)
  const [page, setPage] = useState(0)

  useEffect(() => {
    function handleUpdate(data: Player[]) {
      setPlayers([...data].sort((a, b) => b.score - a.score))
    }
    function handleConnect() {
      setConnected(true)
    }
    function handleDisconnect() {
      setConnected(false)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    // TODO: xác nhận đúng tên event khi backend sẵn sàng
    socket.on('leaderboard:update', handleUpdate)
    socket.connect()

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
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
    loading: !connected,
    page: safePage,
    totalPages,
  }
}
