import api from './api'
function getAll() { return api.request('/api/Genres') }
function getById(id) { return api.request(`/api/Genres/${id}`) }
function create(body) { return api.request('/api/Genres', { method: 'POST', body }) }
function update(id, body) { return api.request(`/api/Genres/${id}`, { method: 'PUT', body }) }
function remove(id) { return api.request(`/api/Genres/${id}`, { method: 'DELETE' }) }
export default { getAll, getById, create, update, remove }
