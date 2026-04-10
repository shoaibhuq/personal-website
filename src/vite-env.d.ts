/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_RECAPTCHA_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Injected by Vite's `define` in vite.config.ts from the plain (non-VITE_-
// prefixed) GOOGLE_MAPS_API_KEY in .env.
declare const __GOOGLE_MAPS_API_KEY__: string;
