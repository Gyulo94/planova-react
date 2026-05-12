/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: string;
  readonly SERVER_URL: string;
  readonly APP_NAME: string;
  readonly SOCKET_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
