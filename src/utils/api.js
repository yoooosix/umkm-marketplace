const BASE_URL = 'http://localhost:5000/api'
function getToken() { return localStorage.getItem('umkm_token') }
async function request(endpoint, options = {}) {
  const token = getToken()
  const headers = {
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }
  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Terjadi kesalahan.')
  return data
}
export const api = {
  get:      (endpoint)       => request(endpoint, { method: 'GET' }),
  post:     (endpoint, body) => request(endpoint, { method: 'POST',   body: JSON.stringify(body) }),
  patch:    (endpoint, body) => request(endpoint, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete:   (endpoint)       => request(endpoint, { method: 'DELETE' }),
  postForm: (endpoint, fd)   => request(endpoint, { method: 'POST',   body: fd }),
  putForm:  (endpoint, fd)   => request(endpoint, { method: 'PUT',    body: fd }),
}
