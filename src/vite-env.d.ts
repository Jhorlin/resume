/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SKILLFABER_WIDGET_SRC?: string;
  readonly VITE_SKILLFABER_WIDGET_TOKEN?: string;
  readonly VITE_RUM_APP_MONITOR_ID?: string;
  readonly VITE_RUM_REGION?: string;
  readonly VITE_RUM_IDENTITY_POOL_ID?: string;
  readonly VITE_RUM_GUEST_ROLE_ARN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
