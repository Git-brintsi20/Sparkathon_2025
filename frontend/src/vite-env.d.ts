/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Add other VITE_ variables you use in your project here, for example:
  // readonly VITE_ANOTHER_ENV_VAR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
