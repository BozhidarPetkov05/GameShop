import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Games from './pages/Games'
import GameDetail from './pages/GameDetail'
import Users from './pages/Users'
import Profile from './pages/Profile'
import Platforms from './pages/Platforms'
import Genres from './pages/Genres'
import Companies from './pages/Companies'
import Tags from './pages/Tags'
import Statuses from './pages/Statuses'
import Orders from './pages/Orders'

export default function App() {
    return (
        <div>
            <NavBar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Games /></ProtectedRoute>} />
                <Route path="/games/:id" element={<ProtectedRoute><GameDetail /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute adminOnly={true}><Users /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/platforms" element={<ProtectedRoute><Platforms /></ProtectedRoute>} />
                <Route path="/genres" element={<ProtectedRoute><Genres /></ProtectedRoute>} />
                <Route path="/companies" element={<ProtectedRoute><Companies /></ProtectedRoute>} />
                <Route path="/tags" element={<ProtectedRoute><Tags /></ProtectedRoute>} />
                <Route path="/statuses" element={<ProtectedRoute adminOnly={true}><Statuses /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    )
}
