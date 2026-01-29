import React, { useEffect, useState } from 'react'
import usersService from '../services/usersService'
import auth from '../services/authService'

export default function Users() {
    const [users, setUsers] = useState([])
    useEffect(() => { if (auth.isAdmin()) load() }, [])
    async function load() { try { const data = await usersService.getAll(); setUsers(data || []) } catch (e) { console.error(e) } }

    if (!auth.isAdmin()) return <div className="container card">Only admins can view users</div>

    return (
        <div className="container">
            <h2>Users</h2>
            <div className="grid">
                {users.map(u => (
                    <div key={u.id} className="card">
                        <div>{u.username}</div>
                        <div style={{ fontSize: 12, color: '#9fb7d8' }}>{u.email}</div>
                        <div style={{ marginTop: 8 }}>
                            <a className="button" href={`#/users/${u.id}`}>Open</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
