import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { useUsersByIds, userSummaryDisplayName } from '../../hooks/useUsersByIds';
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
  const { getLocalizedPostsByType, ensureTypeCatalog } = useContent();
  const { can, currentUser } = useAuth();
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setCatalogLoading(true);
    void ensureTypeCatalog(typeSlug).finally(() => {
      if (!cancelled) setCatalogLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [ensureTypeCatalog, typeSlug]);

  const canEditAll = can('content:edit_all');
  const canEditOwn = can('content:edit_own');

  const items = useMemo(() => {
    let list = getLocalizedPostsByType(typeSlug);
    if (!canEditAll) {
      list = canEditOwn && currentUser ? list.filter((p) => p.authorId === currentUser.id) : [];
    }
    return [...list].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [getLocalizedPostsByType, typeSlug, canEditAll, canEditOwn, currentUser]);

  const authorIds = useMemo(() => items.map((item) => item.authorId), [items]);
  const authorsById = useUsersByIds(authorIds);

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
        {catalogLoading ? (
          <p className="empty-state">Loading…</p>
        ) : items.length === 0 ? (
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
                const authorName = userSummaryDisplayName(authorsById[item.authorId]);
                return (
                  <tr key={item.id}>
                    <td>
                      <Link to={`${basePath}/${item.id}`} className="table-link">
                        {item.title}
                      </Link>
                      <div className="table-link-muted">/{item.slug}</div>
                    </td>
                    <td className="text-muted">{authorName || '—'}</td>
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
