import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';
import { Avatar } from '../ui/Avatar';
import { RoleBadge } from '../ui/Badge';
import { IconChevronDown, IconLogin, IconLogout } from '../ui/Icons';
import { userFullName } from '../../types/user';

/** Account menu for the signed-in user (or guest). */
export function UserSwitcher() {
  const { currentUser, role, logout } = useAuth();
  const t = useUiString();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="user-switcher" ref={ref}>
      <button type="button" className="user-switcher-trigger" onClick={() => setOpen((o) => !o)}>
        {currentUser ? (
          <>
            <Avatar user={currentUser} size={28} />
            <span className="user-switcher-name">{userFullName(currentUser)}</span>
          </>
        ) : (
          <span className="user-switcher-name">{t(UI_STRING_KEYS.auth_guest)}</span>
        )}
        {role && <RoleBadge role={role.name} />}
        <IconChevronDown className="user-switcher-caret" />
      </button>

      {open && (
        <div className="user-switcher-menu">
          {currentUser ? (
            <>
              <p className="user-switcher-heading">{currentUser.email}</p>
              <button
                type="button"
                className="user-switcher-item"
                onClick={() => {
                  void logout();
                  setOpen(false);
                }}
              >
                <IconLogout />
                <span>{t(UI_STRING_KEYS.auth_sign_out)}</span>
              </button>
            </>
          ) : (
            <>
              <p className="user-switcher-heading">{t(UI_STRING_KEYS.auth_guest)}</p>
              <Link
                to="/login"
                className="user-switcher-item user-switcher-more"
                onClick={() => setOpen(false)}
              >
                <IconLogin />
                <span>{t(UI_STRING_KEYS.auth_go_sign_in)}</span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
