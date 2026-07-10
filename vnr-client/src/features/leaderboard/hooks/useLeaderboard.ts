import { useEffect, useState } from 'react'
import type { Player } from '../../../types'
import { getLeaderboard } from '../../../api/leaderboard'

const POLL_INTERVAL_MS = 3000

export function useLeaderboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchLeaderboard() {
      try {
        const data = await getLeaderboard()
        if (!cancelled) setPlayers(data)
      } catch {
        // TODO: hiển thị trạng thái mất kết nối thay vì im lặng bỏ qua lỗi
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchLeaderboard()
    // TODO: thay polling bằng WebSocket/SSE khi backend hỗ trợ để cập nhật tức thời hơn
    const interval = setInterval(fetchLeaderboard, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const ranked = [...players].sort((a, b) => b.score - a.score)

  return { players: ranked, loading }
}
