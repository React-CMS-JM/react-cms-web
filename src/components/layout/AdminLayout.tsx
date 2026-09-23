import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { RequirePermission } from '../auth/RequirePermission';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const STAFF_PERMISSIONS = [
  'content:create',
  'content:edit_own',
  'content:edit_all',
  'content:publish',
  'comment:moderate',
  'user:ban',
] as const;

const SIDEBAR_SKELETON_LINKS = 10;

function AdminShellSkeleton() {
  return (
    <div className="admin-layout" aria-busy="true" aria-label="Loading admin">
      <aside className="sidebar sidebar-skeleton" aria-hidden="true">
        <div className="sidebar-brand">
          <div className="skeleton skeleton-sidebar-logo" />
          <div className="sidebar-skeleton-brand-text">
            <div className="skeleton skeleton-sidebar-title" />
            <div className="skeleton skeleton-sidebar-subtitle" />
          </div>
        </div>
        <nav className="sidebar-nav">
          {Array.from({ length: SIDEBAR_SKELETON_LINKS }, (_, i) => (
            <div key={i} className="skeleton skeleton-sidebar-link" />
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="skeleton skeleton-sidebar-link" />
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div />
          <div className="topbar-actions">
            <div className="skeleton skeleton-action" />
            <div className="skeleton skeleton-user" />
          </div>
        </header>
        <div className="admin-content">
          <div className="page admin-content-skeleton">
            <div className="skeleton skeleton-admin-heading" />
            <div className="skeleton skeleton-line short" />
            <div className="stats-grid admin-content-skeleton-stats">
              <div className="skeleton skeleton-card" />
              <div className="skeleton skeleton-card" />
              <div className="skeleton skeleton-card" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const { bootstrapping } = useAuth();
  const { loading, hasLoaded, language, adminUiLanguage, loadAdminUiStrings, refreshData } =
    useContent();

  useEffect(() => {
    if (bootstrapping) return;
    void refreshData();
  }, [bootstrapping, refreshData]);

  useEffect(() => {
    if (bootstrapping || loading || !hasLoaded) return;
    void loadAdminUiStrings();
  }, [bootstrapping, loading, hasLoaded, loadAdminUiStrings]);

  if (bootstrapping || !hasLoaded || loading || adminUiLanguage !== language) {
    return <AdminShellSkeleton />;
  }

  return (
    <RequirePermission anyOf={[...STAFF_PERMISSIONS]}>
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <Topbar />
          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}
