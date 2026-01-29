import React from 'react'
import { Navigate } from 'react-router-dom'
import auth from '../services/authService'

export default function ProtectedRoute({ children, adminOnly }) {
    const token = auth.getToken()
    if (!token) return <Navigate to="/login" replace />
    if (adminOnly && !auth.isAdmin()) return <div className="container card">Unauthorized</div>
    return children
}
