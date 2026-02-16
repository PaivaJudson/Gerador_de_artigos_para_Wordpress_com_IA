const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('token')
}

function getHeaders(includeAuth = true) {
  const headers = {
    'Content-Type': 'application/json',
  }
  if (includeAuth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.detail || data.message || `Erro ${res.status}`)
  }
  return data
}

export const api = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    })
    return handleResponse(res)
  },

  async register({ email, password, full_name }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password, full_name: full_name || null }),
    })
    return handleResponse(res)
  },

  async me() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    })
    return handleResponse(res)
  },

  async generateArticle({ topic, model_used = 'gpt-4o-mini', save = true }) {
    const res = await fetch(`${API_BASE}/articles/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic, model_used, save }),
    })
    return handleResponse(res)
  },

  async listArticles(skip = 0, limit = 20) {
    const res = await fetch(`${API_BASE}/articles?skip=${skip}&limit=${limit}`, {
      headers: getHeaders(),
    })
    return handleResponse(res)
  },

  async getArticle(id) {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
      headers: getHeaders(),
    })
    return handleResponse(res)
  },

  async deleteArticle(id) {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    if (res.status === 204) return
    return handleResponse(res)
  },
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function isAuthenticated() {
  return !!getToken()
}
