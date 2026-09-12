import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/ui/Avatar';
import { RoleBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';
import { userFullName } from '../../types/user';
import { ApiError } from '../../services/httpClient';

export function LoginPage() {
  const { currentUser, login, logout, role } = useAuth();
  const t = useUiString();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign in failed. Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <section className="login-page">
        <div className="login-intro">
          <h1>{t(UI_STRING_KEYS.auth_sign_in_title)}</h1>
          <p>Sign in with your account email and password to access the admin area.</p>
        </div>

        {currentUser && (
          <div className="card login-current">
            <div className="login-current-user">
              <Avatar user={currentUser} size={44} />
              <div>
                <p>
                  {t(UI_STRING_KEYS.auth_signed_in_as)} <strong>{userFullName(currentUser)}</strong>
                </p>
                <p className="login-card-email">{currentUser.email}</p>
              </div>
              {role && <RoleBadge role={role.name} />}
            </div>
            <div className="login-current-actions">
              <Button type="button" onClick={() => navigate(from, { replace: true })}>
                Continue
              </Button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => void logout()}>
                {t(UI_STRING_KEYS.auth_sign_out)}
              </button>
            </div>
          </div>
        )}

        {!currentUser && (
          <form className="card login-form" onSubmit={(e) => void handleSubmit(e)}>
            <Input
              label="Email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="form-error">{error}</p>}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : t(UI_STRING_KEYS.auth_sign_in_title)}
            </Button>
          </form>
        )}
      </section>
    </PublicLayout>
  );
}
