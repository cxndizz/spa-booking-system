import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

interface LiffProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

interface LiffContextType {
  isLiff: boolean
  isLiffReady: boolean
  isLiffLoggedIn: boolean
  liffProfile: LiffProfile | null
  liffError: string | null
  liffInit: () => Promise<void>
  liffLogin: () => void
  liffLogout: () => void
  liffGetAccessToken: () => string | null
  liffCloseWindow: () => void
  liffOpenWindow: (url: string, external?: boolean) => void
  liffSendMessages: (messages: unknown[]) => Promise<void>
}

const LiffContext = createContext<LiffContextType | undefined>(undefined)

// LIFF App ID - ควรเก็บใน environment variable
const LIFF_ID = import.meta.env.VITE_LIFF_APP_ID || ''

export function LiffProvider({ children }: { children: ReactNode }) {
  const [isLiff, setIsLiff] = useState(false)
  const [isLiffReady, setIsLiffReady] = useState(false)
  const [isLiffLoggedIn, setIsLiffLoggedIn] = useState(false)
  const [liffProfile, setLiffProfile] = useState<LiffProfile | null>(null)
  const [liffError, setLiffError] = useState<string | null>(null)

  useEffect(() => {
    // ตรวจสอบว่าอยู่ใน LIFF environment หรือไม่
    const checkLiffEnvironment = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const hasLiffId = urlParams.has('liff.state') || window.location.pathname.includes('/liff')
      const isInLineApp = /Line/i.test(navigator.userAgent)

      if (hasLiffId || isInLineApp || LIFF_ID) {
        setIsLiff(true)
        initializeLiff()
      } else {
        setIsLiff(false)
        setIsLiffReady(true)
      }
    }

    checkLiffEnvironment()
  }, [])

  const initializeLiff = async () => {
    try {
      // Dynamic import LIFF SDK
      const liff = await import('@line/liff').then(m => m.default).catch(() => null)

      if (!liff) {
        console.warn('LIFF SDK not available, running in non-LIFF mode')
        setIsLiff(false)
        setIsLiffReady(true)
        return
      }

      if (!LIFF_ID) {
        console.warn('LIFF_ID not configured')
        setIsLiff(false)
        setIsLiffReady(true)
        return
      }

      await liff.init({ liffId: LIFF_ID })

      if (liff.isLoggedIn()) {
        setIsLiffLoggedIn(true)

        // Get user profile
        const profile = await liff.getProfile()
        setLiffProfile({
          userId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
          statusMessage: profile.statusMessage,
        })
      }

      setIsLiffReady(true)
    } catch (error) {
      console.error('LIFF initialization error:', error)
      setLiffError(error instanceof Error ? error.message : 'LIFF initialization failed')
      setIsLiff(false)
      setIsLiffReady(true)
    }
  }

  const liffInit = async () => {
    await initializeLiff()
  }

  const liffLogin = () => {
    import('@line/liff').then(m => {
      const liff = m.default
      if (!liff.isLoggedIn()) {
        liff.login()
      }
    }).catch(err => console.error('LIFF login error:', err))
  }

  const liffLogout = () => {
    import('@line/liff').then(m => {
      const liff = m.default
      if (liff.isLoggedIn()) {
        liff.logout()
        setIsLiffLoggedIn(false)
        setLiffProfile(null)
      }
    }).catch(err => console.error('LIFF logout error:', err))
  }

  const liffGetAccessToken = (): string | null => {
    try {
      // This will be set after LIFF init
      const liff = (window as unknown as { liff?: { getAccessToken: () => string } }).liff
      return liff?.getAccessToken() || null
    } catch {
      return null
    }
  }

  const liffCloseWindow = () => {
    import('@line/liff').then(m => {
      const liff = m.default
      liff.closeWindow()
    }).catch(err => console.error('LIFF close window error:', err))
  }

  const liffOpenWindow = (url: string, external = false) => {
    import('@line/liff').then(m => {
      const liff = m.default
      liff.openWindow({ url, external })
    }).catch(err => console.error('LIFF open window error:', err))
  }

  const liffSendMessages = async (messages: unknown[]) => {
    try {
      const liff = await import('@line/liff').then(m => m.default)
      await liff.sendMessages(messages as Parameters<typeof liff.sendMessages>[0])
    } catch (error) {
      console.error('LIFF send messages error:', error)
      throw error
    }
  }

  return (
    <LiffContext.Provider
      value={{
        isLiff,
        isLiffReady,
        isLiffLoggedIn,
        liffProfile,
        liffError,
        liffInit,
        liffLogin,
        liffLogout,
        liffGetAccessToken,
        liffCloseWindow,
        liffOpenWindow,
        liffSendMessages,
      }}
    >
      {children}
    </LiffContext.Provider>
  )
}

export function useLiff() {
  const context = useContext(LiffContext)
  if (context === undefined) {
    throw new Error('useLiff must be used within a LiffProvider')
  }
  return context
}

// Hook for getting LIFF headers for API calls
export function useLiffHeaders() {
  const { liffGetAccessToken, liffProfile } = useLiff()
  const token = liffGetAccessToken()

  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
    'X-Line-User-Id': liffProfile?.userId || '',
  }
}
