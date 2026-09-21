import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { ContentTypeSlug, LocalizedPost } from '../../types/content';
import { userFullName } from '../../types/user';

const ADMIN_PATH_BY_TYPE: Record<ContentTypeSlug, string> = {
  post: 'posts',
  page: 'pages',
  course: 'courses',
  service: 'services',
  product: 'products',
};

const ALL_TYPE_SLUGS: ContentTypeSlug[] = ['post', 'page', 'course', 'service', 'product'];
const DASHBOARD_PREVIEW_SIZE = 6;

type TypeTotals = Record<ContentTypeSlug, number>;

const EMPTY_TOTALS: TypeTotals = {
  post: 0,
  page: 0,
  course: 0,
  service: 0,
  product: 0,
};

export function Dashboard() {
  const {
    comments,
    ensureCommentsLoaded,
    ensureAuthDirectoryLoaded,
    users,
    getUser,
    contentTypes,
    fetchPostsPage,
    fetchCoursesPage,
    language,
  } = useContent();
  const { currentUser, can, role } = useAuth();
  const [typeTotals, setTypeTotals] = useState<TypeTotals>(EMPTY_TOTALS);
  const [recentItems, setRecentItems] = useState<LocalizedPost[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    void ensureCommentsLoaded();
  }, [ensureCommentsLoaded]);

  useEffect(() => {
    void ensureAuthDirectoryLoaded();
  }, [ensureAuthDirectoryLoaded]);

  useEffect(() => {
    let cancelled = false;
    setStatsLoading(true);

    void (async () => {
      try {
        const results = await Promise.all(
          ALL_TYPE_SLUGS.map(async (slug) => {
            if (slug === 'course') {
              const page = await fetchCoursesPage(0, DASHBOARD_PREVIEW_SIZE);
              return { slug, total: page.total, items: page.items };
            }
            const page = await fetchPostsPage(slug, 0, DASHBOARD_PREVIEW_SIZE);
            return { slug, total: page.total, items: page.items };
          }),
        );
        if (cancelled) return;

        const nextTotals = { ...EMPTY_TOTALS };
        const preview: LocalizedPost[] = [];
        for (const result of results) {
          nextTotals[result.slug] = result.total;
          preview.push(...result.items);
        }
        setTypeTotals(nextTotals);
        setRecentItems(
          [...preview]
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, DASHBOARD_PREVIEW_SIZE),
        );
      } catch {
        if (cancelled) return;
        setTypeTotals(EMPTY_TOTALS);
        setRecentItems([]);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [language, fetchPostsPage, fetchCoursesPage]);

  const canEditAll = can('content:edit_all');
  const pendingComments = comments.filter((c) => c.status === 'pending').length;
  const bannedUsers = users.filter((u) => u.isBanned).length;

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
          <p className="stat-value">{statsLoading ? '—' : typeTotals.post}</p>
          <p className="stat-meta">All statuses</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Services</p>
          <p className="stat-value">{statsLoading ? '—' : typeTotals.service}</p>
          <p className="stat-meta">All statuses</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Products</p>
          <p className="stat-value">{statsLoading ? '—' : typeTotals.product}</p>
          <p className="stat-meta">All statuses</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pages</p>
          <p className="stat-value">{statsLoading ? '—' : typeTotals.page}</p>
          <p className="stat-meta">Static site pages</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Courses</p>
          <p className="stat-value">{statsLoading ? '—' : typeTotals.course}</p>
          <p className="stat-meta">Structured lesson content</p>
        </div>
        {can('comment:moderate') && (
          <div className="stat-card">
            <p className="stat-label">Pending Comments</p>
            <p className="stat-value">{pendingComments}</p>
            <Link to="/admin/comments" className="stat-meta">
              Review queue →
            </Link>
          </div>
        )}
        {can('user:ban') && (
          <div className="stat-card">
            <p className="stat-label">Users</p>
            <p className="stat-value">{users.length}</p>
            <p className="stat-meta">{bannedUsers} banned</p>
          </div>
        )}
      </div>

      <section className="card">
        <h2 className="card-title">Recent Activity</h2>
        {statsLoading ? (
          <p className="empty-state">Loading recent activity…</p>
        ) : recentItems.length === 0 ? (
          <p className="empty-state">No content yet. Create your first item.</p>
        ) : (
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
              {recentItems.map((item) => {
                const author = getUser(item.authorId);
                const type = contentTypes.find((t) => t.id === item.contentTypeId);
                const adminPath = type ? ADMIN_PATH_BY_TYPE[type.slug] : 'posts';
                return (
                  <tr key={item.id}>
                    <td>
                      <Link to={`/admin/${adminPath}/${item.id}`} className="table-link">
                        {item.title}
                      </Link>
                    </td>
                    <td className="text-muted">{author ? userFullName(author) : '—'}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="text-muted">{new Date(item.updatedAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
