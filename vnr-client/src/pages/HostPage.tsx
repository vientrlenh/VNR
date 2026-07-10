import { useNavigate } from 'react-router-dom'
import { useLeaderboard } from '../features/leaderboard/hooks/useLeaderboard'
import { clearAuthToken } from '../api/client'
import './HostPage.css'

export function HostPage() {
    const navigate = useNavigate()
    const { players, loading } = useLeaderboard()

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

            {loading ? (
                <p className="host-status">Đang tải...</p>
            ) : players.length === 0 ? (
                <p className="host-status">Chưa có người chơi nào.</p>
            ) : (
                <ol className="host-leaderboard">
                    {players.map((player, index) => (
                        <li key={player.id} className="host-row">
                            <span className="host-rank">{index + 1}</span>
                            <span className="host-nickname">{player.nickname}</span>
                            <span className="host-score">{player.score}</span>
                        </li>
                    ))}
                </ol>
            )}
        </main>
    )
}
