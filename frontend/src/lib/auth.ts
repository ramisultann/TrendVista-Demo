import { apiClient } from './api'

export interface User {
  id: number
  email: string
  full_name: string | null
  is_active: boolean
  created_at: string
}

export interface LoginCredentials {
  username: string // OAuth2PasswordRequestForm uses 'username' field
  password: string
}

export interface SignupData {
  email: string
  password: string
  full_name?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

// Token storage
const TOKEN_KEY = 'trendvista_token'

export const authService = {
  // Get stored token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  },

  // Save token
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_KEY, token)
  },

  // Remove token
  removeToken: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
  },

  // Login
  // SECURITY: Passwords are sent securely via FormData (not in URL or headers)
  // Passwords are never logged or stored client-side
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new FormData()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
      method: 'POST',
      body: formData,
      // Note: Credentials are sent in request body, not in headers or URL
    })

    if (!response.ok) {
      const error = await response.json()
      // SECURITY: Never expose password in error messages
      throw new Error(error.detail || 'Login failed')
    }

    const data = await response.json()
    authService.setToken(data.access_token)
    return data
  },

  // Signup
  // SECURITY: Passwords are sent securely via HTTPS (in production)
  // Passwords are never logged or stored client-side
  signup: async (data: SignupData): Promise<User> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      // Note: Credentials are sent in request body, not in headers or URL
    })

    if (!response.ok) {
      const error = await response.json()
      // SECURITY: Never expose password in error messages
      throw new Error(error.detail || 'Signup failed')
    }

    return response.json()
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const token = authService.getToken()
    if (!token) {
      throw new Error('No token found')
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      authService.removeToken()
      throw new Error('Failed to get current user')
    }

    return response.json()
  },

  // Logout
  logout: (): void => {
    authService.removeToken()
  },
}


