import type { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { useUiString } from '../../hooks/useUiString';
import type { UiStringKey } from '../../types/paramUi';
import { UI_STRING_KEYS } from '../../types/paramUi';
import {
  IconCategory,
  IconComment,
  IconCourse,
  IconDashboard,
  IconPage,
  IconPost,
  IconProduct,
  IconService,
  IconSettings,
  IconShield,
  IconTag,
  IconUsers,
} from '../ui/Icons';
import type { PermissionName } from '../../types/rbac';
import { SiteBrandMark } from './SiteBrandMark';

interface NavItem {
  to: string;
  labelKey: UiStringKey;
  end?: boolean;
  icon: (props: { className?: string }) => ReactElement;
  anyOf?: PermissionName[];
}

const STAFF_ONLY: PermissionName[] = ['content:edit_all', 'content:publish'];

const NAV_ITEMS: NavItem[] = [
  { to: '/admin', labelKey: UI_STRING_KEYS.admin_nav_dashboard, end: true, icon: IconDashboard },
  { to: '/admin/posts', labelKey: UI_STRING_KEYS.admin_nav_posts, icon: IconPost, anyOf: STAFF_ONLY },
  { to: '/admin/pages', labelKey: UI_STRING_KEYS.admin_nav_pages, icon: IconPage, anyOf: STAFF_ONLY },
  { to: '/admin/services', labelKey: UI_STRING_KEYS.admin_nav_services, icon: IconService, anyOf: STAFF_ONLY },
  { to: '/admin/products', labelKey: UI_STRING_KEYS.admin_nav_products, icon: IconProduct, anyOf: STAFF_ONLY },
  {
    to: '/admin/courses',
    labelKey: UI_STRING_KEYS.admin_nav_courses,
    icon: IconCourse,
    anyOf: ['content:create', 'content:edit_all'],
  },
  {
    to: '/admin/categories',
    labelKey: UI_STRING_KEYS.admin_nav_categories,
    icon: IconCategory,
    anyOf: ['content:edit_all'],
  },
  { to: '/admin/tags', labelKey: UI_STRING_KEYS.admin_nav_tags, icon: IconTag, anyOf: ['content:edit_all'] },
  {
    to: '/admin/comments',
    labelKey: UI_STRING_KEYS.admin_nav_comments,
    icon: IconComment,
    anyOf: ['comment:moderate'],
  },
  { to: '/admin/users', labelKey: UI_STRING_KEYS.admin_nav_users, icon: IconUsers, anyOf: ['user:ban'] },
  { to: '/admin/roles', labelKey: UI_STRING_KEYS.admin_nav_roles, icon: IconShield, anyOf: ['user:ban'] },
  { to: '/admin/settings', labelKey: UI_STRING_KEYS.admin_nav_settings, icon: IconSettings, anyOf: ['user:ban'] },
];

export function Sidebar() {
  const { settings } = useContent();
  const { canAny } = useAuth();
  const t = useUiString();

  const items = NAV_ITEMS.filter((item) => !item.anyOf || canAny(item.anyOf));

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <SiteBrandMark
          iconUrl={settings.siteIconUrl}
          className="sidebar-logo"
          alt={settings.siteName}
        />
        <div>
          <p className="sidebar-title">{settings.siteName}</p>
          <p className="sidebar-subtitle">{t(UI_STRING_KEYS.admin_panel_subtitle)}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="sidebar-link-icon" />
              {t(item.labelKey)}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/" className="sidebar-link sidebar-link-muted">
          {t(UI_STRING_KEYS.admin_back_to_site)}
        </NavLink>
      </div>
    </aside>
  );
}
