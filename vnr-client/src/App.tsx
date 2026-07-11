import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import type { ReactElement } from 'react'
import LoginPage from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { HostPage } from './pages/HostPage'
import { GamePage } from './pages/GamePage'
import { getAuthToken } from './api/client'

function RequireAuth({ children }: { children: ReactElement }) {
  return getAuthToken() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<HomePage/>}/>
        <Route path="login" element={<LoginPage/>}/>
        <Route path="game" element={<GamePage/>}/>
        <Route
          path="host"
          element={
            <RequireAuth>
              <HostPage />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>

  )
}

