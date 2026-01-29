import api from './api'

function getAll() { return api.request('/api/Games') }
function getById(id) { return api.request(`/api/Games/${id}`) }
function create(body) { return api.request('/api/Games', { method: 'POST', body }) }
function update(id, body) { return api.request(`/api/Games/${id}`, { method: 'PUT', body }) }
function remove(id) { return api.request(`/api/Games/${id}`, { method: 'DELETE' }) }

export default { getAll, getById, create, update, remove }
