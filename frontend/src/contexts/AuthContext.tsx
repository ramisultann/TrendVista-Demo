'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authService, User, LoginCredentials, SignupData } from '@/lib/auth'
import { isDemoMode } from '@/lib/demoMode'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
  demoLogin?: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const setDemoAuthed = (authed: boolean) => {
    if (typeof window === 'undefined') return
    if (authed) localStorage.setItem('trendvista_demo_authed', 'true')
    else localStorage.removeItem('trendvista_demo_authed')
  }

  const isDemoAuthed = () => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('trendvista_demo_authed') === 'true'
  }

  const demoUser = {
    email: 'demo@trendvista.dev',
    full_name: 'Demo User',
  } as User

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isDemoMode) {
        setUser(isDemoAuthed() ? demoUser : null)
        setLoading(false)
        return
      }

      const token = authService.getToken()
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        authService.logout()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      if (isDemoMode) {
        setDemoAuthed(true)
        setUser(demoUser)
        router.push('/dashboard')
        return
      }

      await authService.login(credentials)
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      router.push('/dashboard')
      // Note: Password is cleared by the calling component after successful login
    } catch (error) {
      // Don't log password in error - just rethrow
      throw error
    }
  }

  const signup = async (data: SignupData) => {
    try {
      if (isDemoMode) {
        setDemoAuthed(true)
        setUser(demoUser)
        router.push('/dashboard')
        return
      }

      await authService.signup(data)
      // After signup, automatically login
      // Note: Password is cleared by the calling component after successful signup
      await login({ username: data.email, password: data.password })
    } catch (error) {
      // Don't log password in error - just rethrow
      throw error
    }
  }

  const logout = () => {
    if (isDemoMode) {
      setDemoAuthed(false)
      setUser(null)
      router.push('/login')
      return
    }
    authService.logout()
    setUser(null)
    router.push('/login')
  }

  const refreshUser = async () => {
    try {
      if (isDemoMode) return
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  const demoLogin = () => {
    if (!isDemoMode) return
    setDemoAuthed(true)
    setUser(demoUser)
    router.push('/dashboard')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        refreshUser,
        demoLogin: isDemoMode ? demoLogin : undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


