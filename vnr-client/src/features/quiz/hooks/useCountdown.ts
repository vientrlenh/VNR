import { useEffect, useState } from 'react'

/** Đồng hồ đếm ngược chỉ mang tính hiển thị (UX) — điểm số thật do server tính, không dựa vào giá trị này. */
export function useCountdown(durationMs: number, resetKey: unknown) {
  const [prevResetKey, setPrevResetKey] = useState(resetKey)
  const [remainingMs, setRemainingMs] = useState(durationMs)

  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey)
    setRemainingMs(durationMs)
  }

  useEffect(() => {
    const startedAt = Date.now()
    const interval = setInterval(() => {
      setRemainingMs(Math.max(0, durationMs - (Date.now() - startedAt)))
    }, 100)

    return () => clearInterval(interval)
  }, [resetKey, durationMs])

  return remainingMs
}
