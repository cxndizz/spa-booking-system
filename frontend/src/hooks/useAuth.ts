import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string) => void
  logout: () => void
  user: AdminUser | null
}

interface AdminUser {
  id: string
  username: string
  email: string
  fullName: string
  role: 'ADMIN' | 'MANAGER' | 'STAFF'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      // Verify token with backend
      const response = await fetch('/api/v1/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.data)
        setIsAuthenticated(true)
      } else {
        // Token invalid, remove it
        localStorage.removeItem('admin_token')
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('admin_token')
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (token: string) => {
    localStorage.setItem('admin_token', token)
    setIsAuthenticated(true)
    // Re-check to get user data
    checkAuthStatus()
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isLoading, 
        login, 
        logout, 
        user 
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

// Hook for getting auth headers for API calls
export function useAuthHeaders() {
  const token = localStorage.getItem('admin_token')
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  }
}
