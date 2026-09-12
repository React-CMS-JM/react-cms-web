import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  authApi,
  mapAuthUser,
  mapRoleDto,
  type LoginResponseDto,
} from '../services/authApi';
import {
  clearAuthStorage,
  loadAuthToken,
  loadAuthUserJson,
  saveAuthToken,
  saveAuthUserJson,
} from '../lib/storage';
import type { PermissionName, Role } from '../types/rbac';
import type { User } from '../types/user';

interface AuthSession {
  user: User;
  roles: string[];
  permissions: PermissionName[];
}

interface AuthContextValue {
  currentUser: User | null;
  isGuest: boolean;
  bootstrapping: boolean;
  roles: Role[];
  role: Role | undefined;
  permissions: Set<PermissionName>;
  can: (permission: PermissionName) => boolean;
  canAny: (permissions: PermissionName[]) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function sessionFromLogin(res: LoginResponseDto): AuthSession {
  return {
    user: mapAuthUser(res.user),
    roles: res.roles ?? [],
    permissions: (res.permissions ?? []) as PermissionName[],
  };
}

function loadCachedSession(): AuthSession | null {
  const raw = loadAuthUserJson();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => loadAuthToken());
  const [session, setSession] = useState<AuthSession | null>(() => loadCachedSession());
  const [catalogRoles, setCatalogRoles] = useState<Role[]>([]);
  const [bootstrapping, setBootstrapping] = useState(true);

  const persistSession = useCallback((nextToken: string | null, nextSession: AuthSession | null) => {
    saveAuthToken(nextToken);
    saveAuthUserJson(nextSession ? JSON.stringify(nextSession) : null);
    setToken(nextToken);
    setSession(nextSession);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const existingToken = loadAuthToken();
      if (!existingToken) {
        if (!cancelled) {
          setBootstrapping(false);
        }
        return;
      }

      try {
        const me = await authApi.me(existingToken);
        if (cancelled) return;
        persistSession(existingToken, {
          user: mapAuthUser(me.user),
          roles: me.roles ?? [],
          permissions: (me.permissions ?? []) as PermissionName[],
        });
      } catch {
        if (!cancelled) {
          clearAuthStorage();
          setToken(null);
          setSession(null);
        }
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [persistSession]);

  useEffect(() => {
    if (!token) {
      setCatalogRoles([]);
      return;
    }
    let cancelled = false;
    void authApi
      .listRoles()
      .then((roles) => {
        if (!cancelled) setCatalogRoles(roles.map(mapRoleDto));
      })
      .catch(() => {
        if (!cancelled) setCatalogRoles([]);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email.trim(), password);
      persistSession(res.token, sessionFromLogin(res));
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    try {
      if (token) await authApi.logout();
    } catch {
      /* token may already be invalid */
    } finally {
      clearAuthStorage();
      persistSession(null, null);
    }
  }, [persistSession, token]);

  const currentUser = session && !session.user.isBanned ? session.user : null;

  const permissions = useMemo(() => {
    if (session?.permissions?.length) return new Set(session.permissions);
    return new Set<PermissionName>();
  }, [session]);

  const roles = useMemo(() => {
    if (!session) {
      const guest = catalogRoles.find((r) => r.name === 'Guest');
      return guest ? [guest] : [];
    }
    const fromCatalog = catalogRoles.filter((r) => session.roles.includes(r.name));
    if (fromCatalog.length) return fromCatalog;
    return session.roles.map((name, index) => ({
      id: -(index + 1),
      name: name as Role['name'],
      description: name,
      permissions: session.permissions,
    }));
  }, [catalogRoles, session]);

  const role = useMemo(() => {
    const priority: Role['name'][] = [
      'Administrator',
      'Content_Editor',
      'Course_Contributor',
      'Premium_Member',
      'Free_Member',
      'Guest',
    ];
    return [...roles].sort((a, b) => priority.indexOf(a.name) - priority.indexOf(b.name))[0];
  }, [roles]);

  const can = useCallback((permission: PermissionName) => permissions.has(permission), [permissions]);
  const canAny = useCallback(
    (perms: PermissionName[]) => perms.some((p) => permissions.has(p)),
    [permissions],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      isGuest: !currentUser,
      bootstrapping,
      roles,
      role,
      permissions,
      can,
      canAny,
      login,
      logout,
      token,
    }),
    [
      currentUser,
      bootstrapping,
      roles,
      role,
      permissions,
      can,
      canAny,
      login,
      logout,
      token,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
