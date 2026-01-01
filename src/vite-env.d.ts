/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STONE_NOTES_API_URL: string;

  readonly VITE_OIDC_AUTHORITY: string;
  readonly VITE_OIDC_CLIENT_ID: string;
  readonly VITE_OIDC_REDIRECT_URI: string;
  readonly VITE_OIDC_RESPONSE_TYPE: string;
  readonly VITE_OIDC_SCOPE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
