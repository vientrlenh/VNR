import { useNavigate } from 'react-router-dom'
import { useLeaderboard } from '../features/leaderboard/hooks/useLeaderboard'
import { clearAuthToken } from '../api/client'
import './HostPage.css'

export function HostPage() {
    const navigate = useNavigate()
    const { players, loading, error, page, totalPages, goToPage } = useLeaderboard()

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
                            const podiumClass =
                                rank === 1
                                    ? ' host-row-gold'
                                    : rank === 2
                                      ? ' host-row-silver'
                                      : rank === 3
                                        ? ' host-row-bronze'
                                        : ''
                            return (
                                <li key={player.id} className={`host-row${podiumClass}`}>
                                    <span className="host-rank">{rank}</span>
                                    <span className="host-nickname">{player.nickname}</span>
                                    <span className="host-score">{player.score}</span>
                                </li>
                            )
                        })}
                    </ol>

                    {totalPages > 1 && (
                        <div className="host-nav">
                            <button
                                type="button"
                                className="host-nav-arrow"
                                onClick={() => goToPage((page - 1 + totalPages) % totalPages)}
                                aria-label="Trang trước"
                            >
                                ‹
                            </button>
                            <div className="host-dots">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className={`host-dot${i === page ? ' active' : ''}`}
                                        onClick={() => goToPage(i)}
                                        aria-label={`Trang ${i + 1}`}
                                    />
                                ))}
                            </div>
                            <button
                                type="button"
                                className="host-nav-arrow"
                                onClick={() => goToPage((page + 1) % totalPages)}
                                aria-label="Trang sau"
                            >
                                ›
                            </button>
                        </div>
                    )}
                </>
            )}
        </main>
    )
}
