import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { usePublishedBySlug } from '../../hooks/usePublicContent';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function StaticPageView() {
  const { slug } = useParams<{ slug: string }>();
  const t = useUiString();
  const query = usePublishedBySlug('page', slug);
  const page = query.data?.post;
  const resolving = Boolean(slug) && query.isPending;

  if (resolving) {
    return (
      <PublicLayout>
        <p className="empty-state">Loading…</p>
      </PublicLayout>
    );
  }

  if (!page || page.status !== 'published') {
    return (
      <PublicLayout>
        <div className="not-found">
          <h1>{t(UI_STRING_KEYS.common_not_found_title)}</h1>
          <p>{t(UI_STRING_KEYS.common_not_found_body)}</p>
          <Link to="/">{t(UI_STRING_KEYS.common_back_home)}</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="public-article">
        <h1>{page.title}</h1>
        <div className="prose" dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    </PublicLayout>
  );
}
