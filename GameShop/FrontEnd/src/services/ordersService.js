import api from './api'

function getAll() { return api.request('/api/Orders') }
function getById(id) { return api.request(`/api/Orders/${id}`) }
function create(body) { return api.request('/api/Orders', { method: 'POST', body }) }
function update(id, body) { return api.request(`/api/Orders/${id}`, { method: 'PUT', body }) }
function remove(id) { return api.request(`/api/Orders/${id}`, { method: 'DELETE' }) }

export default { getAll, getById, create, update, remove }
