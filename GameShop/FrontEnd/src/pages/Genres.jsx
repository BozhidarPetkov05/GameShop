import React, { useEffect, useState } from 'react'
import genresService from '../services/genresService'
import auth from '../services/authService'

export default function Genres() {
    const [items, setItems] = useState([])
    useEffect(() => { load() }, [])
    async function load() { try { const data = await genresService.getAll(); setItems(data || []) } catch (e) { console.error(e) } }

    return (
        <div className="container">
            <h2>Genres</h2>
            <div className="grid">
                {items.map(p => (
                    <div key={p.id} className="card">
                        <div>{p.name}</div>
                        <div style={{ marginTop: 8 }}>
                            <a className="button" href={`#/genres/${p.id}`}>Open</a>
                            {auth.isAdmin() && <button className="button" style={{ marginLeft: 8 }}>Edit</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
