// Decodes a JWT payload for display purposes only (e.g. showing the
// signed-in email and role). The backend never exposes a "/me" endpoint,
// so this is the only way the UI knows who's logged in between page loads.
// This never verifies the signature — that's the backend's job on every request.
export function decodeJwt(token) {
  try {
    const [, payload] = token.split('.')
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    return null
  }
}

export function isExpired(claims) {
  if (!claims?.exp) return true
  return Date.now() >= claims.exp * 1000
}
