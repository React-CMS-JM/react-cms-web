import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import type { ContentTypeSlug } from '../../types/content';
import { userFullName } from '../../types/user';

const ADMIN_PATH_BY_TYPE: Record<ContentTypeSlug, string> = {
  post: 'posts',
  page: 'pages',
  course: 'courses',
  service: 'services',
  product: 'products',
};

const ALL_TYPE_SLUGS: ContentTypeSlug[] = ['post', 'page', 'course', 'service', 'product'];

export function Dashboard() {
  const {
    comments,
    ensureCommentsLoaded,
    users,
    getUser,
    contentTypes,
    getLocalizedPostsByType,
  } = useContent();
  const { currentUser, can, role } = useAuth();

  useEffect(() => {
    void ensureCommentsLoaded();
  }, [ensureCommentsLoaded]);

  const canEditAll = can('content:edit_all');

  const allLocalizedPosts = ALL_TYPE_SLUGS.flatMap((slug) => getLocalizedPostsByType(slug));
  const visiblePosts = canEditAll
    ? allLocalizedPosts
    : allLocalizedPosts.filter((p) => currentUser && p.authorId === currentUser.id);

  const byType = (slug: ContentTypeSlug) => {
    const type = contentTypes.find((t) => t.slug === slug);
    if (!type) return [];
    return visiblePosts.filter((p) => p.contentTypeId === type.id);
  };

  const publishedCount = visiblePosts.filter((p) => p.status === 'published').length;
  const draftCount = visiblePosts.filter((p) => p.status === 'draft').length;
  const pendingComments = comments.filter((c) => c.status === 'pending').length;
  const bannedUsers = users.filter((u) => u.isBanned).length;

  const recentItems = [...visiblePosts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

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
          <p className="stat-value">{byType('post').length}</p>
          <p className="stat-meta">
            {publishedCount} published overall · {draftCount} drafts
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Services</p>
          <p className="stat-value">{byType('service').length}</p>
          <p className="stat-meta">
            {getLocalizedPostsByType('service').filter((p) => p.status === 'published').length} published
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Products</p>
          <p className="stat-value">{byType('product').length}</p>
          <p className="stat-meta">
            {getLocalizedPostsByType('product').filter((p) => p.status === 'published').length} published
          </p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pages</p>
          <p className="stat-value">{byType('page').length}</p>
          <p className="stat-meta">Static site pages</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Courses</p>
          <p className="stat-value">{byType('course').length}</p>
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
        {recentItems.length === 0 ? (
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
