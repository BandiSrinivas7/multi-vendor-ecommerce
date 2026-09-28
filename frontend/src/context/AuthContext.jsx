import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth'
import { authEvents, clearTokens, getToken, setTokens } from '../api/client'
import { decodeJwt, isExpired } from '../utils/jwt'

const AuthContext = createContext(null)

function userFromToken() {
  const token = getToken()
  if (!token) return null
  const claims = decodeJwt(token)
  if (!claims || isExpired(claims)) {
    clearTokens()
    return null
  }
  return { email: claims.sub, role: claims.role }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(userFromToken)

  useEffect(() => {
    const onUnauthorized = () => {
      clearTokens()
      setUser(null)
    }
    authEvents.addEventListener('unauthorized', onUnauthorized)
    return () => authEvents.removeEventListener('unauthorized', onUnauthorized)
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const data = await authApi.login({ email, password })
    setTokens(data)
    setUser(userFromToken())
    return userFromToken()
  }, [])

  const register = useCallback(async ({ name, email, password, role }) => {
    await authApi.register({ name, email, password, role })
    // The register endpoint doesn't sign the user in, so we chain a login
    // with the same credentials for a one-step sign-up experience.
    return login({ email, password })
  }, [login])

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, login, register, logout, isAuthenticated: !!user }),
    [user, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
