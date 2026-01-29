import React from 'react'

export default function GenericList({ title, items, openPath, canEdit }) {
    return (
        <div className="container">
            <h2>{title}</h2>
            <div className="grid">
                {items.map(i => (
                    <div key={i.id} className="card">
                        <div>{i.name || i.title}</div>
                        <div style={{ marginTop: 8 }}>
                            <a className="button" href={`#/${openPath}/${i.id}`}>Open</a>
                            {canEdit && <button className="button" style={{ marginLeft: 8 }}>Edit</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
