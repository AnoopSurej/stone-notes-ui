/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STONE_NOTES_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
