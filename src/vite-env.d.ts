/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_INVITE_YES_PATH: string
  readonly VITE_STUDIO_CODE?: string
  readonly VITE_USE_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
