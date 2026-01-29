import api from './api'
function getAll() { return api.request('/api/Companies') }
function getById(id) { return api.request(`/api/Companies/${id}`) }
function create(body) { return api.request('/api/Companies', { method: 'POST', body }) }
function update(id, body) { return api.request(`/api/Companies/${id}`, { method: 'PUT', body }) }
function remove(id) { return api.request(`/api/Companies/${id}`, { method: 'DELETE' }) }
export default { getAll, getById, create, update, remove }
