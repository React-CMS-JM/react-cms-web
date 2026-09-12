const AUTH_TOKEN_KEY = 'react-cms-auth-token';
const AUTH_USER_KEY = 'react-cms-auth-user';

export function loadAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveAuthToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadAuthUserJson(): string | null {
  try {
    return localStorage.getItem(AUTH_USER_KEY);
  } catch {
    return null;
  }
}

export function saveAuthUserJson(json: string | null): void {
  try {
    if (json) localStorage.setItem(AUTH_USER_KEY, json);
    else localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    /* ignore */
  }
}

export function clearAuthStorage(): void {
  saveAuthToken(null);
  saveAuthUserJson(null);
}
