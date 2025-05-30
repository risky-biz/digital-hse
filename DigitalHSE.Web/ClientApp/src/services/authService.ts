interface LoginCredentials {
  username: string
  password: string
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: {
    id: number
    username: string
    email: string
    fullName: string
    department: string
    position: string
    roles: string[]
    permissions: string[]
  }
}

interface UserInfo {
  id: number
  username: string
  email: string
  fullName: string
  department: string
  position: string
  roles: string[]
  permissions: string[]
}

class AuthService {
  private readonly TOKEN_KEY = 'accessToken'
  private readonly REFRESH_TOKEN_KEY = 'refreshToken'
  private readonly USER_KEY = 'user'

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Login failed')
    }

    const data: AuthResponse = await response.json()
    
    // Store authentication data
    this.setTokens(data.accessToken, data.refreshToken)
    this.setUser(data.user)
    
    return data
  }

  async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken()
    
    if (refreshToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    this.clearAuth()
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    
    if (!refreshToken) {
      this.clearAuth()
      return null
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      })

      if (!response.ok) {
        this.clearAuth()
        return null
      }

      const data: AuthResponse = await response.json()
      this.setTokens(data.accessToken, data.refreshToken)
      this.setUser(data.user)
      
      return data.accessToken
    } catch (error) {
      console.error('Token refresh error:', error)
      this.clearAuth()
      return null
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  getUser(): UserInfo | null {
    const userStr = localStorage.getItem(this.USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    const user = this.getUser()
    return !!(token && user)
  }

  hasPermission(permission: string): boolean {
    const user = this.getUser()
    return user?.permissions.includes(permission) || false
  }

  hasRole(role: string): boolean {
    const user = this.getUser()
    return user?.roles.includes(role) || false
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser()
    if (!user) return false
    return roles.some(role => user.roles.includes(role))
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
  }

  private setUser(user: UserInfo): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }

  // Configure axios or fetch interceptors for automatic token handling
  configureHttpClient(): void {
    // Add request interceptor to include auth token
    const originalFetch = window.fetch
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const token = this.getAccessToken()
      
      if (token) {
        const headers = new Headers(init?.headers)
        headers.set('Authorization', `Bearer ${token}`)
        init = { ...init, headers }
      }

      const response = await originalFetch(input, init)

      // Handle 401 responses by attempting token refresh
      if (response.status === 401 && token) {
        const newToken = await this.refreshToken()
        
        if (newToken) {
          // Retry the original request with new token
          const retryHeaders = new Headers(init?.headers)
          retryHeaders.set('Authorization', `Bearer ${newToken}`)
          return originalFetch(input, { ...init, headers: retryHeaders })
        } else {
          // Redirect to login if refresh fails
          window.location.href = '/login'
        }
      }

      return response
    }
  }
}

export const authService = new AuthService()
export type { LoginCredentials, AuthResponse, UserInfo }