import React, { useEffect, useState } from 'react'
import tagsService from '../services/tagsService'
import auth from '../services/authService'

export default function Tags() {
    const [items, setItems] = useState([])
    useEffect(() => { load() }, [])
    async function load() { try { const data = await tagsService.getAll(); setItems(data || []) } catch (e) { console.error(e) } }

    return (
        <div className="container">
            <h2>Tags</h2>
            <div className="grid">
                {items.map(p => (
                    <div key={p.id} className="card">
                        <div>{p.name}</div>
                        <div style={{ marginTop: 8 }}>
                            <a className="button" href={`#/tags/${p.id}`}>Open</a>
                            {auth.isAdmin() && <button className="button" style={{ marginLeft: 8 }}>Edit</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
