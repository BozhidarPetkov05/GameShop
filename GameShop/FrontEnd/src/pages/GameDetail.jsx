import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import gamesService from '../services/gamesService'

export default function GameDetail() {
    const { id } = useParams()
    const [game, setGame] = useState(null)
    useEffect(() => { if (id) load() }, [id])
    async function load() { try { const g = await gamesService.getById(id); setGame(g) } catch (e) { console.error(e) } }

    if (!game) return <div className="container">Loading...</div>
    return (
        <div className="container">
            <div className="card">
                <h2>{game.title || game.name}</h2>
                <div style={{ color: '#9fb7d8' }}>{game.companyName}</div>
                <p>{game.description}</p>
            </div>
        </div>
    )
}
