const API_BASE = import.meta.env.VITE_API_URL || '/api'

const ERRO_SERVIDOR =
  'Não foi possível conectar ao servidor. Inicie o backend na porta 8000: cd backend && uvicorn app.main:app --reload --port 8000'

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

function parseDetail(data) {
  const d = data?.detail
  if (typeof d === 'string') return d
  if (Array.isArray(d) && d[0]?.msg) return d.map((x) => x.msg).join('. ')
  if (d?.msg) return d.msg
  return data?.message || null
}

async function handleResponse(res) {
  if (res.status === 204) return
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 502 || res.status === 503) {
      throw new Error(ERRO_SERVIDOR)
    }
    const msg = parseDetail(data) || `Erro ${res.status}`
    throw new Error(msg)
  }
  return data
}

async function request(url, options) {
  try {
    const res = await fetch(url, options)
    return handleResponse(res)
  } catch (err) {
    if (err.name === 'TypeError' && (err.message === 'Failed to fetch' || err.message?.includes('fetch'))) {
      throw new Error(ERRO_SERVIDOR)
    }
    if (err.message?.includes('ETIMEDOUT') || err.message?.includes('NetworkError')) {
      throw new Error(ERRO_SERVIDOR)
    }
    throw err
  }
}

export const api = {
  async login(email, password) {
    return request(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    })
  },

  async register({ email, password, full_name }) {
    return request(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password, full_name: full_name || null }),
    })
  },

  async me() {
    return request(`${API_BASE}/auth/me`, { headers: getHeaders() })
  },

  async generateArticle({ topic, model_used = 'gpt-4o-mini', save = true }) {
    return request(`${API_BASE}/articles/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic, model_used, save }),
    })
  },

  async listArticles(skip = 0, limit = 20) {
    return request(`${API_BASE}/articles?skip=${skip}&limit=${limit}`, {
      headers: getHeaders(),
    })
  },

  async getArticle(id) {
    return request(`${API_BASE}/articles/${id}`, { headers: getHeaders() })
  },

  async deleteArticle(id) {
    return request(`${API_BASE}/articles/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
  },
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token)
  else localStorage.removeItem('token')
}

export function isAuthenticated() {
  return !!getToken()
}
