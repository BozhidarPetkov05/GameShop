import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import auth from '../services/authService'

export default function NavBar() {
    const navigate = useNavigate()
    const isAdmin = auth.isAdmin()

    function logout() { auth.logout(); navigate('/login') }

    return (
        <div className="nav">
            <Link to="/">Games</Link>
            <Link to="/platforms">Platforms</Link>
            <Link to="/genres">Genres</Link>
            <Link to="/companies">Companies</Link>
            <Link to="/tags">Tags</Link>
            {isAdmin && <Link to="/statuses">Statuses</Link>}
            {isAdmin && <Link to="/users">Users</Link>}
            <Link to="/orders">Orders</Link>
            <Link to="/profile">Profile</Link>
            <div style={{ marginLeft: 'auto' }}>
                <button className="button" onClick={logout}>Logout</button>
            </div>
        </div>
    )
}
