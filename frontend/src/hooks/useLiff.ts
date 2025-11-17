import { useState, useEffect, createContext, useContext, ReactNode, createElement } from 'react'

// LIFF SDK types (simplified)
declare global {
  interface Window {
    liff: any
  }
}

interface LiffContextType {
  isLiff: boolean
  isLiffReady: boolean
  liffId: string | null
  lineUserId: string | null
  displayName: string | null
  pictureUrl: string | null
  isLoggedIn: boolean
  login: () => Promise<void>
  logout: () => void
  closeWindow: () => void
  getProfile: () => Promise<any>
}

const LiffContext = createContext<LiffContextType | undefined>(undefined)

const LIFF_APP_ID = import.meta.env.VITE_LIFF_APP_ID || ''

export function LiffProvider({ children }: { children: ReactNode }) {
  const [isLiff, setIsLiff] = useState(false)
  const [isLiffReady, setIsLiffReady] = useState(false)
  const [liffId, setLiffId] = useState<string | null>(null)
  const [lineUserId, setLineUserId] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [pictureUrl, setPictureUrl] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    initializeLiff()
  }, [])

  const initializeLiff = async () => {
    try {
      // Check if we're in LIFF environment
      const isInLiff = window.location.pathname.startsWith('/liff')
      setIsLiff(isInLiff)

      if (!isInLiff || !LIFF_APP_ID) {
        setIsLiffReady(true)
        return
      }

      // Wait for LIFF SDK to load
      if (typeof window.liff === 'undefined') {
        console.error('LIFF SDK not loaded')
        setIsLiffReady(true)
        return
      }

      // Initialize LIFF
      await window.liff.init({ liffId: LIFF_APP_ID })
      setLiffId(LIFF_APP_ID)

      // Check login status
      if (window.liff.isLoggedIn()) {
        setIsLoggedIn(true)
        await updateProfile()
      } else {
        // Auto login if not logged in
        await login()
      }
    } catch (error) {
      console.error('LIFF initialization failed:', error)
    } finally {
      setIsLiffReady(true)
    }
  }

  const updateProfile = async () => {
    try {
      if (!window.liff?.isLoggedIn()) return

      const profile = await window.liff.getProfile()
      const idToken = window.liff.getIDToken()
      
      setLineUserId(profile.userId)
      setDisplayName(profile.displayName)
      setPictureUrl(profile.pictureUrl)

      // Store LINE user info for API calls
      localStorage.setItem('line_user_id', profile.userId)
      localStorage.setItem('line_id_token', idToken)
    } catch (error) {
      console.error('Failed to get profile:', error)
    }
  }

  const login = async (): Promise<void> => {
    try {
      if (!isLiff || !window.liff) {
        throw new Error('LIFF not available')
      }

      if (!window.liff.isLoggedIn()) {
        window.liff.login()
        return
      }

      setIsLoggedIn(true)
      await updateProfile()
    } catch (error) {
      console.error('LIFF login failed:', error)
      throw error
    }
  }

  const logout = () => {
    try {
      if (window.liff?.isLoggedIn()) {
        window.liff.logout()
      }
      
      setIsLoggedIn(false)
      setLineUserId(null)
      setDisplayName(null)
      setPictureUrl(null)
      
      localStorage.removeItem('line_user_id')
      localStorage.removeItem('line_id_token')
    } catch (error) {
      console.error('LIFF logout failed:', error)
    }
  }

  const closeWindow = () => {
    try {
      if (window.liff) {
        window.liff.closeWindow()
      }
    } catch (error) {
      console.error('Failed to close LIFF window:', error)
    }
  }

  const getProfile = async () => {
    try {
      if (!window.liff?.isLoggedIn()) {
        throw new Error('Not logged in')
      }
      return await window.liff.getProfile()
    } catch (error) {
      console.error('Failed to get profile:', error)
      throw error
    }
  }

  const contextValue: LiffContextType = {
    isLiff,
    isLiffReady,
    liffId,
    lineUserId,
    displayName,
    pictureUrl,
    isLoggedIn,
    login,
    logout,
    closeWindow,
    getProfile,
  }

  return createElement(LiffContext.Provider, { value: contextValue }, children)
}

export function useLiff() {
  const context = useContext(LiffContext)
  if (context === undefined) {
    throw new Error('useLiff must be used within a LiffProvider')
  }
  return context
}

// Helper hook for LINE user authentication headers
export function useLiffHeaders() {
  const { lineUserId } = useLiff()
  const idToken = localStorage.getItem('line_id_token')
  
  return {
    'Content-Type': 'application/json',
    'X-Line-User-ID': lineUserId || '',
    'Authorization': idToken ? `Bearer ${idToken}` : '',
  }
}