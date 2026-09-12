import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';
import { IconLock } from '../ui/Icons';

export function PremiumGate({ children, teaser }: { children: ReactNode; teaser?: ReactNode }) {
  const { can, isGuest } = useAuth();
  const t = useUiString();

  if (can('content:read_premium')) {
    return <>{children}</>;
  }

  return (
    <div className="premium-gate">
      {teaser && <div className="premium-gate-teaser">{teaser}</div>}
      <div className="premium-gate-lock">
        <IconLock width={28} height={28} />
        <h3>{t(UI_STRING_KEYS.premium_title)}</h3>
        <p>{isGuest ? t(UI_STRING_KEYS.premium_body_guest) : t(UI_STRING_KEYS.premium_body_member)}</p>
        <Link to="/login" className="btn btn-accent btn-md">
          {isGuest ? t(UI_STRING_KEYS.premium_cta_sign_in) : t(UI_STRING_KEYS.premium_cta_upgrade)}
        </Link>
      </div>
    </div>
  );
}
