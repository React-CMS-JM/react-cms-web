import { useEffect, useMemo, useState } from 'react';
import { authApi, type UserSummaryDto } from '../services/authApi';
import { useAuth } from '../context/AuthContext';

/** On-demand author lookup by ids (no full users directory). */
export function useUsersByIds(ids: string[]) {
  const { token } = useAuth();
  const [byId, setById] = useState<Record<string, UserSummaryDto>>({});
  const key = useMemo(() => {
    const unique = [...new Set(ids.filter(Boolean))].sort();
    return unique.join(',');
  }, [ids]);

  useEffect(() => {
    if (!token || !key) {
      setById({});
      return;
    }
    let cancelled = false;
    const unique = key.split(',').filter(Boolean);
    void authApi.getUsersByIds(unique).then((rows) => {
      if (cancelled) return;
      const next: Record<string, UserSummaryDto> = {};
      for (const row of rows) {
        next[row.id] = row;
      }
      setById(next);
    }).catch(() => {
      if (!cancelled) setById({});
    });
    return () => {
      cancelled = true;
    };
  }, [token, key]);

  return byId;
}

export function userSummaryDisplayName(user: UserSummaryDto | undefined): string {
  if (!user) return '';
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
}
