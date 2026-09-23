import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { usePublishedBySlug, useRecordPublicView } from '../../hooks/usePublicContent';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function ServiceView() {
  const { slug } = useParams<{ slug: string }>();
  const t = useUiString();
  const query = usePublishedBySlug('service', slug);
  const service = query.data?.post;
  const resolving = Boolean(slug) && query.isPending;
  useRecordPublicView('service', slug, service?.id, service?.status === 'published');

  if (resolving) {
    return (
      <PublicLayout>
        <p className="empty-state">Loading…</p>
      </PublicLayout>
    );
  }

  if (!service || service.status !== 'published') {
    return (
      <PublicLayout>
        <div className="not-found">
          <h1>{t(UI_STRING_KEYS.common_not_found_title)}</h1>
          <p>{t(UI_STRING_KEYS.common_not_found_body)}</p>
          <Link to="/services">{t(UI_STRING_KEYS.common_back_services)}</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="public-article">
        <header className="article-header">
          <h1>{service.title}</h1>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: service.content }} />
      </article>
      <p className="back-link">
        <Link to="/services">{t(UI_STRING_KEYS.common_back_services)}</Link>
      </p>
    </PublicLayout>
  );
}
