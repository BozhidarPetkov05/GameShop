import api from './api'
function getAll() { return api.request('/api/Tags') }
function getById(id) { return api.request(`/api/Tags/${id}`) }
function create(body) { return api.request('/api/Tags', { method: 'POST', body }) }
function update(id, body) { return api.request(`/api/Tags/${id}`, { method: 'PUT', body }) }
function remove(id) { return api.request(`/api/Tags/${id}`, { method: 'DELETE' }) }
export default { getAll, getById, create, update, remove }
