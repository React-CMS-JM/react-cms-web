import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { StatusBadge, AccessBadge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { ContentTypeSlug, LocalizedPost } from '../../types/content';

interface ContentListProps {
  typeSlug: ContentTypeSlug;
  title: string;
  subtitle: string;
  basePath: string;
  newLabel: string;
  publicBasePath: string;
  extraColumnHeader?: string;
  extraColumn?: (post: LocalizedPost) => ReactNode;
}

export function ContentList({
  typeSlug,
  title,
  subtitle,
  basePath,
  newLabel,
  publicBasePath,
  extraColumnHeader,
  extraColumn,
}: ContentListProps) {
  const { getLocalizedPostsByType, getUser, ensureTypeCatalog } = useContent();
  const { can, currentUser } = useAuth();

  useEffect(() => {
    void ensureTypeCatalog(typeSlug);
  }, [ensureTypeCatalog, typeSlug]);

  const canEditAll = can('content:edit_all');
  const canEditOwn = can('content:edit_own');

  let items = getLocalizedPostsByType(typeSlug);
  if (!canEditAll) {
    items = canEditOwn && currentUser ? items.filter((p) => p.authorId === currentUser.id) : [];
  }
  items = [...items].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
        <Link to={`${basePath}/new`}>
          <Button>{newLabel}</Button>
        </Link>
      </header>

      <section className="card">
        {items.length === 0 ? (
          <p className="empty-state">Nothing here yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Access</th>
                <th>Status</th>
                {extraColumnHeader && <th>{extraColumnHeader}</th>}
                <th>Updated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const author = getUser(item.authorId);
                return (
                  <tr key={item.id}>
                    <td>
                      <Link to={`${basePath}/${item.id}`} className="table-link">
                        {item.title}
                      </Link>
                      <div className="table-link-muted">/{item.slug}</div>
                    </td>
                    <td className="text-muted">{author ? `${author.firstName} ${author.lastName}` : '—'}</td>
                    <td>
                      <AccessBadge level={item.accessLevel} />
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    {extraColumn && <td className="text-muted">{extraColumn(item)}</td>}
                    <td className="text-muted">{new Date(item.updatedAt).toLocaleDateString()}</td>
                    <td>
                      {item.status === 'published' && (
                        <Link to={`${publicBasePath}/${item.slug}`} className="table-link-muted">
                          View
                        </Link>
                      )}
                    </td>
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
