/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHEETS_WEBAPP_URL?: string;
  readonly VITE_AUTH_SALT?: string;
  readonly VITE_AUTH_PASSCODE_HASH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
