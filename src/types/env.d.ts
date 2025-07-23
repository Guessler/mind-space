// src/types/env.d.ts
interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    // Добавьте другие переменные, если нужно
    // readonly VITE_SOME_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}