import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

const NICKNAME_KEY = 'vnr_player_nickname'

export function HomePage() {
    const navigate = useNavigate()
    const [nickname, setNickname] = useState('')

    function handleSubmit(e: SubmitEvent) {
        e.preventDefault()
        const trimmed = nickname.trim()
        if (!trimmed) return

        // TODO: gọi API kiểm tra/đăng ký nickname với server trước khi vào game
        sessionStorage.setItem(NICKNAME_KEY, trimmed)
        navigate('/game')
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

                    <button type="submit" className="home-submit">
                        Bắt đầu
                    </button>
                </form>
            </section>
        </main>
    )
}
