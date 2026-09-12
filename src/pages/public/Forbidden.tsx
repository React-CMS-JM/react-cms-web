import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { IconLock } from '../../components/ui/Icons';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function Forbidden() {
  const t = useUiString();

  return (
    <PublicLayout>
      <div className="not-found">
        <IconLock width={40} height={40} />
        <h1>{t(UI_STRING_KEYS.forbidden_title)}</h1>
        <p>{t(UI_STRING_KEYS.forbidden_body)}</p>
        <div className="not-found-actions">
          <Link to="/login" className="btn btn-primary btn-md">
            {t(UI_STRING_KEYS.forbidden_switch_account)}
          </Link>
          <Link to="/" className="btn btn-secondary btn-md">
            {t(UI_STRING_KEYS.forbidden_back_home)}
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
