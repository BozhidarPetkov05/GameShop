const BASE_URL = 'https://localhost:5000'

function authHeader() {
    const token = localStorage.getItem('token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
}

async function request(path, { method = 'GET', headers = {}, body } = {}) {
    const opts = {
        method,
        headers: { ...headers, ...authHeader() }
    }
    if (body && !(body instanceof FormData)) {
        opts.headers['Content-Type'] = 'application/json'
        opts.body = JSON.stringify(body)
    } else if (body instanceof FormData) {
        opts.body = body
    }

    const res = await fetch(`${BASE_URL}${path}`, opts)
    const text = await res.text()
    let data = null
    try { data = text && JSON.parse(text) } catch (e) { data = text }
    if (!res.ok) {
        const err = new Error(data?.message || res.statusText)
        err.status = res.status
        err.data = data
        throw err
    }
    return data
}

export default { BASE_URL, request }
