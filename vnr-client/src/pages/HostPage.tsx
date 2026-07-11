import { useNavigate } from 'react-router-dom'
import { useLeaderboard } from '../features/leaderboard/hooks/useLeaderboard'
import { clearAuthToken } from '../api/client'
import './HostPage.css'

export function HostPage() {
    const navigate = useNavigate()
    const { players, loading, error, page, totalPages } = useLeaderboard()

    function handleLogout() {
        clearAuthToken()
        navigate('/login')
    }

    return (
        <main className="host-page">
            <header className="host-header">
                <h1>Bảng xếp hạng</h1>
                <button type="button" className="host-logout" onClick={handleLogout}>
                    Đăng xuất
                </button>
            </header>

            {error ? (
                <p className="host-status host-status-error">{error}</p>
            ) : loading ? (
                <p className="host-status">Đang kết nối...</p>
            ) : players.length === 0 ? (
                <p className="host-status">Chưa có người chơi nào.</p>
            ) : (
                <>
                    <ol className="host-leaderboard" start={page * 10 + 1}>
                        {players.map((player, index) => {
                            const rank = page * 10 + index + 1
                            return (
                                <li
                                    key={player.id}
                                    className={`host-row${rank === 1 ? ' host-row-top' : ''}`}
                                >
                                    <span className="host-rank">{rank}</span>
                                    <span className="host-nickname">{player.nickname}</span>
                                    <span className="host-score">{player.score}</span>
                                </li>
                            )
                        })}
                    </ol>

                    {totalPages > 1 && (
                        <div className="host-dots">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <span
                                    key={i}
                                    className={`host-dot${i === page ? ' active' : ''}`}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </main>
    )
}
