/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIFF_APP_ID: string
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_BUSINESS_NAME: string
  readonly VITE_BUSINESS_PHONE: string
  readonly VITE_FRONTEND_URL: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_MOCK_API: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_OMISE_PUBLIC_KEY: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
