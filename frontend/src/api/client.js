import axios from 'axios'

// In dev, Vite proxies /api/* to the Spring Boot backend (see vite.config.js),
// so the browser never makes a cross-origin request. Set VITE_API_BASE_URL
// to point somewhere else (e.g. a deployed backend) if you're not using the proxy.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

export const client = axios.create({ baseURL })

const TOKEN_KEY = 'bazaar.accessToken'
const REFRESH_KEY = 'bazaar.refreshToken'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setTokens({ accessToken, refreshToken }) {
  localStorage.setItem(TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken)
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

client.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// A tiny pub/sub so the auth context can react to a session becoming invalid
// without axios needing to know about React.
export const authEvents = new EventTarget()

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const url = err.config?.url || ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register')
    if (status === 401 && !isAuthEndpoint) {
      authEvents.dispatchEvent(new Event('unauthorized'))
    }
    return Promise.reject(err)
  }
)

// The backend returns { error: "message" } or { error, fields: {...} }.
export function getErrorMessage(err, fallback = 'Something went wrong. Please try again.') {
  const data = err?.response?.data
  if (!data) return err?.message || fallback
  if (data.fields) {
    const first = Object.values(data.fields)[0]
    return first || data.error || fallback
  }
  return data.error || fallback
}
