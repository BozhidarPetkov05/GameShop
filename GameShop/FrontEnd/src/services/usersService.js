import api from './api'

function getAll() { return api.request('/api/Users') }
function getById(id) { return api.request(`/api/Users/${id}`) }
function update(id, body) { return api.request(`/api/Users/${id}`, { method: 'PUT', body }) }
function remove(id) { return api.request(`/api/Users/${id}`, { method: 'DELETE' }) }

export default { getAll, getById, update, remove }
