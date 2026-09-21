import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { PermissionName } from '../../types/rbac';

interface RequirePermissionProps {
  anyOf: PermissionName[];
  children: ReactNode;
}

/** Route guard: redirects guests to /login and members lacking access to /forbidden. */
export function RequirePermission({ anyOf, children }: RequirePermissionProps) {
  const { canAny, isGuest, bootstrapping } = useAuth();
  const location = useLocation();

  // Avoid redirecting to /login while session restore is still in flight.
  if (bootstrapping) {
    return null;
  }

  if (!canAny(anyOf)) {
    if (isGuest) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
}
