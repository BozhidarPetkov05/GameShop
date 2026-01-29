import React from 'react'

export default function CartModal({ items, onClose, onClear, onMakeOrder }) {
    const total = items.reduce((s, i) => s + (i.price || 0), 0)
    return (
        <div className="card" style={{ position: 'fixed', right: 20, top: 80, width: 360, zIndex: 60 }}>
            <h3>Cart</h3>
            {items.length === 0 && <div>No items</div>}
            {items.map((it, idx) => (
                <div key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '8px 0' }}>
                    <div>{it.title || it.name}</div>
                    <div style={{ fontSize: 12, color: '#9fb7d8' }}>{it.companyName || ''}</div>
                </div>
            ))}
            <div style={{ marginTop: 8 }}>Total: {total}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="button danger" onClick={onClear}>Clear</button>
                <button className="button" onClick={onMakeOrder}>Make Order</button>
                <button className="button" onClick={onClose}>Close</button>
            </div>
        </div>
    )
}
