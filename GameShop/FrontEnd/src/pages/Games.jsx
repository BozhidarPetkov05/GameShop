import React, { useEffect, useState } from 'react'
import gamesService from '../services/gamesService'
import CartModal from '../components/CartModal'

export default function Games() {
    const [games, setGames] = useState([])
    const [cart, setCart] = useState([])
    const [showCart, setShowCart] = useState(false)

    useEffect(() => { load() }, [])
    async function load() {
        try { const data = await gamesService.getAll(); setGames(data || []) } catch (e) { console.error(e) }
    }

    function addToCart(game) { setCart(s => [...s, game]); setShowCart(true) }
    function clear() { setCart([]); setShowCart(false) }
    async function makeOrder() {
        // Build a minimal order payload; API may require specific shape
        const order = { games: cart.map(g => g.id), shippingAddress: 'N/A' }
        try {
            await fetch('https://localhost:5000/api/Orders', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify(order) })
            alert('Order created')
            clear()
        } catch (e) { alert('Order failed') }
    }

    return (
        <div className="container">
            <h2>Games</h2>
            <div className="grid">
                {games.map(g => (
                    <div key={g.id} className="card">
                        <h4>{g.title || g.name}</h4>
                        <div style={{ fontSize: 12, color: '#9fb7d8' }}>{g.companyName}</div>
                        <p style={{ minHeight: 40 }}>{g.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button className="button" onClick={() => addToCart(g)}>Add to Cart</button>
                            <a className="button" href={`#/games/${g.id}`}>Open</a>
                        </div>
                    </div>
                ))}
            </div>
            {showCart && <CartModal items={cart} onClose={() => setShowCart(false)} onClear={clear} onMakeOrder={makeOrder} />}
        </div>
    )
}
