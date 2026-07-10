import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { login } from '../api/auth'
import { setAuthToken } from '../api/client'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await login({ email, password })
      setAuthToken(data.token)
      navigate('/host')
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Sai email hoặc mật khẩu.')
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Đăng nhập Host</h1>
        <p className="login-subtitle">Khu vực quản trị trò chơi</p>

        <label className="login-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
          />
        </label>

        <label className="login-field">
          <span>Mật khẩu</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </main>
  )
}
