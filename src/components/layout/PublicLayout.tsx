import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePublicShell } from '../../hooks/usePublicContent';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';
import {
  DEFAULT_MAIN_MENU,
  DEFAULT_SETTINGS,
  type MainMenuItemId,
  type VisibilityOrderItem,
} from '../../types/settings';
import { UserSwitcher } from '../auth/UserSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SiteBrandMark } from './SiteBrandMark';

function resolveMainMenu(
  configured: VisibilityOrderItem<MainMenuItemId>[] | undefined,
): VisibilityOrderItem<MainMenuItemId>[] {
  if (!configured?.length) return DEFAULT_MAIN_MENU;
  const known = new Set(DEFAULT_MAIN_MENU.map((s) => s.id));
  return configured.filter((item) => known.has(item.id));
}

export function PublicLayout({ children }: { children: ReactNode }) {
  const { settings, pages, isLoading } = usePublicShell();
  const { canAny } = useAuth();
  const t = useUiString();
  const siteSettings = settings.data ?? DEFAULT_SETTINGS;
  const navPages = (pages.data?.items ?? []).filter((page) => page.status === 'published');
  const pagesById = Object.fromEntries(navPages.map((page) => [page.id, page]));

  const canOpenAdmin = canAny([
    'content:create',
    'content:edit_own',
    'content:edit_all',
    'content:publish',
    'comment:moderate',
    'user:ban',
  ]);

  const fixedNav: Record<
    Exclude<MainMenuItemId, 'page-about' | 'page-contact'>,
    { to: string; label: string; end?: boolean }
  > = {
    home: { to: '/', label: t(UI_STRING_KEYS.nav_home), end: true },
    services: { to: '/services', label: t(UI_STRING_KEYS.nav_services) },
    products: { to: '/products', label: t(UI_STRING_KEYS.nav_products) },
    blog: { to: '/blog', label: t(UI_STRING_KEYS.nav_blog) },
    courses: { to: '/courses', label: t(UI_STRING_KEYS.nav_courses) },
  };

  const menuItems: { key: string; to: string; label: string; end?: boolean }[] = [];

  for (const item of resolveMainMenu(siteSettings.mainMenu)) {
    if (!item.visible) continue;

    if (item.id === 'page-about' || item.id === 'page-contact') {
      const page = pagesById[item.id];
      if (!page) continue;
      menuItems.push({ key: item.id, to: `/page/${page.slug}`, label: page.title });
      continue;
    }

    const fixed = fixedNav[item.id];
    menuItems.push({
      key: item.id,
      to: fixed.to,
      label: fixed.label,
      end: fixed.end,
    });
  }

  return (
    <div className="public-site">
      <header className="public-header">
        <div className="public-header-inner">
          {isLoading ? (
            <>
              <div className="skeleton skeleton-brand" aria-hidden="true" />
              <nav className="public-nav" aria-hidden="true">
                <div className="skeleton skeleton-nav" />
                <div className="skeleton skeleton-nav" />
                <div className="skeleton skeleton-nav" />
              </nav>
            </>
          ) : (
            <>
              <Link to="/" className="public-brand">
                <SiteBrandMark
                  iconUrl={siteSettings.siteIconUrl}
                  className="public-brand-logo"
                  alt={siteSettings.siteName}
                />
                {siteSettings.siteName}
              </Link>
              <nav className="public-nav">
                {menuItems.map((item) => (
                  <NavLink key={item.key} to={item.to} end={item.end}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </>
          )}
          <div className="public-header-actions">
            {isLoading ? (
              <>
                <div className="skeleton skeleton-action" aria-hidden="true" />
                <div className="skeleton skeleton-user" aria-hidden="true" />
              </>
            ) : (
              <>
                {canOpenAdmin && (
                  <Link to="/admin" className="public-admin-link">
                    {t(UI_STRING_KEYS.nav_admin)}
                  </Link>
                )}
                <LanguageSwitcher />
                <UserSwitcher />
              </>
            )}
          </div>
        </div>
      </header>

      <main className="public-main">
        {isLoading ? (
          <div className="public-skeleton" aria-busy="true" aria-label="Loading content">
            <div className="skeleton skeleton-hero" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
            <div className="posts-grid">
              <div className="skeleton skeleton-card" />
              <div className="skeleton skeleton-card" />
              <div className="skeleton skeleton-card" />
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      <footer className="public-footer">
        {isLoading ? (
          <div className="skeleton skeleton-footer" aria-hidden="true" />
        ) : (
          <p>
            © {new Date().getFullYear()} {siteSettings.siteName} — {siteSettings.siteDescription}
          </p>
        )}
      </footer>
    </div>
  );
}
