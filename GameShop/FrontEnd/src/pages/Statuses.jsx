import React, { useEffect, useState } from 'react'
import statusesService from '../services/statusesService'
import auth from '../services/authService'

export default function Statuses() {
    const [items, setItems] = useState([])
    useEffect(() => { if (auth.isAdmin()) load() }, [])
    async function load() { try { const data = await statusesService.getAll(); setItems(data || []) } catch (e) { console.error(e) } }

    if (!auth.isAdmin()) return <div className="container card">Only admins can view statuses</div>

    return (
        <div className="container">
            <h2>Statuses</h2>
            <div className="grid">
                {items.map(s => (
                    <div key={s.id} className="card">
                        <div>{s.name}</div>
                        <div style={{ marginTop: 8 }}>
                            <a className="button" href={`#/statuses/${s.id}`}>Open</a>
                        </div>
                        <div style={{ marginTop: 8 }} className={s.name === 'Pending' ? 'status-pending' : s.name === 'Completed' ? 'status-completed' : s.name === 'Cancelled' ? 'status-cancelled' : ''}>
                            {s.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
