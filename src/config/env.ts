/**
 * Environment-backed API base URLs.
 *
 * - `npm run dev` / `npm run dev:gateway` → development mode → `.env.development` (Caddy :8080)
 * - `npm run dev:direct`                  → direct mode → `.env.direct` (8081 / 8082 / 8083)
 */

function requiredEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value.replace(/\/$/, '');
}

export const apiEnv = {
  authBaseUrl: requiredEnv('VITE_AUTH_API_URL'),
  contentBaseUrl: requiredEnv('VITE_CONTENT_API_URL'),
  coursesBaseUrl: requiredEnv('VITE_COURSES_API_URL'),
  mode: import.meta.env.MODE,
} as const;
