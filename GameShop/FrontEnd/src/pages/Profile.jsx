import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import auth from '../services/authService'
import usersService from '../services/usersService'

export default function Profile() {
    const navigate = useNavigate()
    const userId = auth.loggedUserId()
    const [user, setUser] = useState(null)
    const [form, setForm] = useState({})

    useEffect(() => { if (userId) load() }, [userId])
    async function load() { try { const u = await usersService.getById(userId); setUser(u); setForm({ username: u.username, email: u.email, firstName: u.firstName, lastName: u.lastName }) } catch (e) { console.error(e) } }

    async function save() { try { await usersService.update(userId, form); alert('Saved'); load() } catch (e) { alert('Save failed') } }
    async function remove() { if (confirm('Delete profile?')) { try { await usersService.remove(userId); auth.logout(); navigate('/login') } catch (e) { alert('Delete failed') } } }

    if (!user) return <div className="container">Loading...</div>
    return (
        <div className="container">
            <div className="card" style={{ maxWidth: 640 }}>
                <h2>Profile</h2>
                <div>
                    <label>Username</label>
                    <input value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} />
                </div>
                <div>
                    <label>Password (leave blank to keep)</label>
                    <input type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
                <div>
                    <label>Email</label>
                    <input value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                    <label>First name</label>
                    <input value={form.firstName || ''} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div>
                    <label>Last name</label>
                    <input value={form.lastName || ''} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                </div>
                <div style={{ marginTop: 8 }}>
                    <button className="button" onClick={save}>Save</button>
                    <button className="button danger" onClick={remove} style={{ marginLeft: 8 }}>Delete</button>
                </div>
            </div>
        </div>
    )
}
