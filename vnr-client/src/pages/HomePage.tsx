import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { joinGame, savePlayerSession } from '../api/player'
import './HomePage.css'

export function HomePage() {
    const navigate = useNavigate()
    const [nickname, setNickname] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault()
        const trimmed = nickname.trim()
        if (!trimmed) return

        setError('')
        setLoading(true)
        try {
            const { data } = await joinGame(trimmed)
            savePlayerSession(data)
            navigate('/game')
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 409) {
                setError('Tên đã được sử dụng, hãy chọn tên khác.')
            } else if (axios.isAxiosError(err) && err.response?.status === 400) {
                setError('Chưa có game nào được mở.')
            } else {
                setError('Không thể tham gia lúc này. Vui lòng thử lại.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="home-page">
            <section className="home-card">
                <p className="home-eyebrow">Minigame lịch sử Đảng</p>
                <h1>Công cuộc Đổi mới &amp; CNH-HĐH</h1>
                <p className="home-desc">
                    Đại hội VIII &amp; IX (1996 – nay): trả lời các câu hỏi trắc
                    nghiệm càng nhanh, điểm càng cao. Điểm của bạn sẽ hiển thị trực
                    tiếp trên bảng xếp hạng.
                </p>

                <form className="home-form" onSubmit={handleSubmit}>
                    <label className="home-field">
                        <span>Tên hiển thị</span>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Nhập tên của bạn"
                            maxLength={20}
                            required
                            autoFocus
                        />
                    </label>

                    {error && <p className="home-error">{error}</p>}

                    <button type="submit" className="home-submit" disabled={loading}>
                        {loading ? 'Đang tham gia...' : 'Bắt đầu'}
                    </button>
                </form>
            </section>
        </main>
    )
}
