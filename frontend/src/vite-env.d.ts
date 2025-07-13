/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_ENABLE_BLOCKCHAIN: string; // Will be 'true' or 'false'
  readonly VITE_ANALYTICS_ID: string;
  readonly VITE_MAX_FILE_SIZE: string; // This is a number, but read as a string
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  // Add other VITE_ variables you use in your project here, for example:
  // readonly VITE_ANOTHER_ENV_VAR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
