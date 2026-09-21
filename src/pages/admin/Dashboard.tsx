import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { ContentTypeSlug, PostStatus } from '../../types/content';
import {
  authApi,
  type UserStatsDto,
} from '../../services/authApi';
import {
  contentApi,
  type AdminDashboardDto,
  type AdminRecentActivityDto,
} from '../../services/contentApi';
import { coursesApi } from '../../services/coursesApi';

const ADMIN_PATH_BY_TYPE: Record<string, string> = {
  post: 'posts',
  page: 'pages',
  course: 'courses',
  service: 'services',
  product: 'products',
};

const EMPTY_DASHBOARD: AdminDashboardDto = {
  counts: {},
  pendingComments: 0,
  recent: [],
};

const EMPTY_USER_STATS: UserStatsDto = { total: 0, banned: 0 };

export function Dashboard() {
  const { language } = useLocale();
  const { currentUser, can, role } = useAuth();
  const [dashboard, setDashboard] = useState<AdminDashboardDto>(EMPTY_DASHBOARD);
  const [courseTotal, setCourseTotal] = useState(0);
  const [userStats, setUserStats] = useState<UserStatsDto>(EMPTY_USER_STATS);
  const [loading, setLoading] = useState(true);

  const canModerateComments = can('comment:moderate');
  const canBanUsers = can('user:ban');
  const canEditAll = can('content:edit_all');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const [adminDash, courseStats, users] = await Promise.all([
          contentApi.getAdminDashboard({ lang: language, recentLimit: 6 }),
          coursesApi.getStats(),
          canBanUsers ? authApi.getUserStats() : Promise.resolve(EMPTY_USER_STATS),
        ]);
        if (cancelled) return;
        setDashboard(adminDash);
        setCourseTotal(courseStats.total);
        setUserStats(users);
      } catch {
        if (cancelled) return;
        setDashboard(EMPTY_DASHBOARD);
        setCourseTotal(0);
        setUserStats(EMPTY_USER_STATS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [language, canBanUsers]);

  const countOf = (slug: ContentTypeSlug) => dashboard.counts[slug] ?? 0;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back{currentUser ? `, ${currentUser.firstName}` : ''}
            {role ? ` — signed in as ${role.name.replace('_', ' ')}` : ''}
          </p>
        </div>
        <div className="page-actions">
          {can('content:create') && (
            <>
              {canEditAll && (
                <Link to="/admin/posts/new">
                  <Button>New Post</Button>
                </Link>
              )}
              <Link to="/admin/courses/new">
                <Button variant="accent">New Course</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Posts</p>
          <p className="stat-value">{loading ? '—' : countOf('post')}</p>
          <p className="stat-meta">All statuses</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Services</p>
          <p className="stat-value">{loading ? '—' : countOf('service')}</p>
          <p className="stat-meta">All statuses</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Products</p>
          <p className="stat-value">{loading ? '—' : countOf('product')}</p>
          <p className="stat-meta">All statuses</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pages</p>
          <p className="stat-value">{loading ? '—' : countOf('page')}</p>
          <p className="stat-meta">Static site pages</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Courses</p>
          <p className="stat-value">{loading ? '—' : courseTotal}</p>
          <p className="stat-meta">Structured lesson content</p>
        </div>
        {canModerateComments && (
          <div className="stat-card">
            <p className="stat-label">Pending Comments</p>
            <p className="stat-value">{loading ? '—' : dashboard.pendingComments}</p>
            <Link to="/admin/comments" className="stat-meta">
              Review queue →
            </Link>
          </div>
        )}
        {canBanUsers && (
          <div className="stat-card">
            <p className="stat-label">Users</p>
            <p className="stat-value">{loading ? '—' : userStats.total}</p>
            <p className="stat-meta">{userStats.banned} banned</p>
          </div>
        )}
      </div>

      <section className="card">
        <h2 className="card-title">Recent Activity</h2>
        {loading ? (
          <p className="empty-state">Loading recent activity…</p>
        ) : dashboard.recent.length === 0 ? (
          <p className="empty-state">No content yet. Create your first item.</p>
        ) : (
          <RecentActivityTable items={dashboard.recent} />
        )}
      </section>
    </div>
  );
}

function RecentActivityTable({ items }: { items: AdminRecentActivityDto[] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Status</th>
          <th>Updated</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const adminPath = ADMIN_PATH_BY_TYPE[item.contentTypeSlug] ?? 'posts';
          return (
            <tr key={item.id}>
              <td>
                <Link to={`/admin/${adminPath}/${item.id}`} className="table-link">
                  {item.title || 'Untitled'}
                </Link>
              </td>
              <td className="text-muted">{item.authorName || '—'}</td>
              <td>
                <StatusBadge status={item.status as PostStatus} />
              </td>
              <td className="text-muted">{new Date(item.updatedAt).toLocaleDateString()}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
