import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { usePublishedBySlug, useRecordPublicView } from '../../hooks/usePublicContent';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function ProductView() {
  const { slug } = useParams<{ slug: string }>();
  const t = useUiString();
  const query = usePublishedBySlug('product', slug);
  const product = query.data?.post;
  const resolving = Boolean(slug) && query.isPending;
  useRecordPublicView('product', slug, product?.id, product?.status === 'published');

  if (resolving) {
    return (
      <PublicLayout>
        <p className="empty-state">Loading…</p>
      </PublicLayout>
    );
  }

  if (!product || product.status !== 'published') {
    return (
      <PublicLayout>
        <div className="not-found">
          <h1>{t(UI_STRING_KEYS.common_not_found_title)}</h1>
          <p>{t(UI_STRING_KEYS.common_not_found_body)}</p>
          <Link to="/products">{t(UI_STRING_KEYS.common_back_products)}</Link>
        </div>
      </PublicLayout>
    );
  }

  const meta = query.data?.metadata ?? [];
  const websiteUrl = meta.find((row) => row.metaKey === 'website-url')?.metaValue;
  const liveDemoUrl = meta.find((row) => row.metaKey === 'live-demo-url')?.metaValue;

  return (
    <PublicLayout>
      <article className="public-article">
        <header className="article-header">
          <h1>{product.title}</h1>
          {(websiteUrl || liveDemoUrl) && (
            <div className="post-meta">
              {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  {t(UI_STRING_KEYS.listing_website)}
                </a>
              )}
              {liveDemoUrl && (
                <a href={liveDemoUrl} target="_blank" rel="noreferrer" className="btn btn-accent btn-sm">
                  {t(UI_STRING_KEYS.listing_live_demo)}
                </a>
              )}
            </div>
          )}
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: product.content }} />
      </article>
      <p className="back-link">
        <Link to="/products">{t(UI_STRING_KEYS.common_back_products)}</Link>
      </p>
    </PublicLayout>
  );
}
