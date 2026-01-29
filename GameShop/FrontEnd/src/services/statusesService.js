import api from './api'
function getAll() { return api.request('/api/Statuses') }
function getById(id) { return api.request(`/api/Statuses/${id}`) }
function create(body) { return api.request('/api/Statuses', { method: 'POST', body }) }
function update(id, body) { return api.request(`/api/Statuses/${id}`, { method: 'PUT', body }) }
function remove(id) { return api.request(`/api/Statuses/${id}`, { method: 'DELETE' }) }
export default { getAll, getById, create, update, remove }
