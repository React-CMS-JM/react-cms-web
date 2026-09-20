import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { useContent } from '../../context/ContentContext';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function ProductView() {
  const { slug } = useParams<{ slug: string }>();
  const { getLocalizedPostBySlug, ensurePostBySlug, incrementViewCount, getMetadataForPost } =
    useContent();
  const t = useUiString();
  const product = slug ? getLocalizedPostBySlug(slug, 'product') : undefined;
  const counted = useRef(false);
  const [resolving, setResolving] = useState(!!slug && !product);

  useEffect(() => {
    if (!slug || product) {
      setResolving(false);
      return;
    }
    let cancelled = false;
    setResolving(true);
    void ensurePostBySlug(slug, 'product').finally(() => {
      if (!cancelled) setResolving(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, product, ensurePostBySlug]);

  useEffect(() => {
    if (product && product.status === 'published' && !counted.current) {
      counted.current = true;
      incrementViewCount(product.id);
    }
  }, [product, incrementViewCount]);

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

  const meta = getMetadataForPost(product.id);
  const websiteUrl = meta.find((m) => m.metaKey === 'website-url')?.metaValue;
  const liveDemoUrl = meta.find((m) => m.metaKey === 'live-demo-url')?.metaValue;

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
