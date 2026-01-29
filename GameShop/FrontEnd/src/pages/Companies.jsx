import React, { useEffect, useState } from 'react'
import companiesService from '../services/companiesService'
import auth from '../services/authService'

export default function Companies() {
    const [items, setItems] = useState([])
    useEffect(() => { load() }, [])
    async function load() { try { const data = await companiesService.getAll(); setItems(data || []) } catch (e) { console.error(e) } }

    return (
        <div className="container">
            <h2>Companies</h2>
            <div className="grid">
                {items.map(p => (
                    <div key={p.id} className="card">
                        <div>{p.name}</div>
                        <div style={{ marginTop: 8 }}>
                            <a className="button" href={`#/companies/${p.id}`}>Open</a>
                            {auth.isAdmin() && <button className="button" style={{ marginLeft: 8 }}>Edit</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
