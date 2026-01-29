import React, { useEffect, useState } from 'react'
import ordersService from '../services/ordersService'
import auth from '../services/authService'

export default function Orders() {
    const [orders, setOrders] = useState([])
    useEffect(() => { load() }, [])
    async function load() {
        try {
            const data = await ordersService.getAll()
            setOrders(data || [])
        } catch (e) { console.error(e) }
    }

    return (
        <div className="container">
            <h2>Orders</h2>
            <div className="grid">
                {orders.map(o => (
                    <div key={o.id} className="card">
                        <div>Order #{o.id}</div>
                        <div style={{ fontSize: 12, color: '#9fb7d8' }}>Status: {o.statusName}</div>
                        <a className="button" href={`#/orders/${o.id}`}>Open</a>
                    </div>
                ))}
            </div>
        </div>
    )
}
