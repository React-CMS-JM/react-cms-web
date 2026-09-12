import { LanguageSwitcher } from './LanguageSwitcher';
import { UserSwitcher } from '../auth/UserSwitcher';

export function Topbar() {
  return (
    <header className="admin-topbar">
      <div />
      <div className="topbar-actions">
        <LanguageSwitcher />
        <UserSwitcher />
      </div>
    </header>
  );
}
