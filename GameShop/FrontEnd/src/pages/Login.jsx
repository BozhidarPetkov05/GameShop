import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import auth from '../services/authService'

export default function Login() {
    const [username, setUsername] = useState('admin')
    const [password, setPassword] = useState('admin')
    const [err, setErr] = useState(null)
    const navigate = useNavigate()

    async function submit(e) {
        e.preventDefault(); setErr(null)
        try {
            await auth.login(username, password)
            navigate('/')
        } catch (e) { setErr(e.message || 'Login failed') }
    }

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
                <h2>Login</h2>
                <form onSubmit={submit}>
                    <div>
                        <label>Username</label>
                        <input value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    {err && <div style={{ color: 'salmon' }}>{err}</div>}
                    <div style={{ marginTop: 8 }}>
                        <button className="button">Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
