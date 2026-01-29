import api from './api'
function getAll() { return api.request('/api/Platforms') }
function getById(id) { return api.request(`/api/Platforms/${id}`) }
function create(body) { return api.request('/api/Platforms', { method: 'POST', body }) }
function update(id, body) { return api.request(`/api/Platforms/${id}`, { method: 'PUT', body }) }
function remove(id) { return api.request(`/api/Platforms/${id}`, { method: 'DELETE' }) }
export default { getAll, getById, create, update, remove }
