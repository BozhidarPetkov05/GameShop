import api from './api'

function parseJwt(token) {
    try {
        const payload = token.split('.')[1]
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        return JSON.parse(decodeURIComponent(escape(decoded)))
    } catch (e) { return {} }
}

async function login(username, password) {
    const body = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    const res = await fetch(`${api.BASE_URL}/api/Auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    })
    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Login failed')
    }
    const data = await res.json()
    if (data?.token) {
        localStorage.setItem('token', data.token)
    }
    return data
}

function logout() { localStorage.removeItem('token') }

function getToken() { return localStorage.getItem('token') }

function getClaims() {
    const token = getToken()
    if (!token) return {}
    return parseJwt(token)
}

function isAdmin() {
    const claims = getClaims()
    // common claim name used by many systems
    return !!(claims.isAdmin || claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin' || claims.role === 'Admin')
}

function loggedUserId() {
    const claims = getClaims()
    return claims.loggedUserId || claims.sub || claims.id || null
}

export default { login, logout, getToken, getClaims, isAdmin, loggedUserId }
