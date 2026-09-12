import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { useContent } from '../../context/ContentContext';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function ProductsList() {
  const { getLocalizedPostsByType, getMetadataForPost } = useContent();
  const t = useUiString();

  const products = getLocalizedPostsByType('product')
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <PublicLayout>
      <section className="posts-section">
        <div className="section-heading">
          <h1>{t(UI_STRING_KEYS.listing_products_title)}</h1>
          <p className="page-subtitle">{t(UI_STRING_KEYS.listing_products_subtitle)}</p>
        </div>

        {products.length === 0 ? (
          <p className="empty-state">{t(UI_STRING_KEYS.listing_empty)}</p>
        ) : (
          <div className="posts-grid">
            {products.map((product) => {
              const meta = getMetadataForPost(product.id);
              const websiteUrl = meta.find((m) => m.metaKey === 'website-url')?.metaValue;
              const liveDemoUrl = meta.find((m) => m.metaKey === 'live-demo-url')?.metaValue;

              return (
                <article key={product.id} className="post-card">
                  <div className="post-card-top">
                    <h3>
                      <Link to={`/products/${product.slug}`}>{product.title}</Link>
                    </h3>
                  </div>
                  <p className="post-excerpt">{product.excerpt}</p>
                  <div className="post-meta">
                    {websiteUrl && (
                      <a href={websiteUrl} target="_blank" rel="noreferrer">
                        {t(UI_STRING_KEYS.listing_website)}
                      </a>
                    )}
                    {liveDemoUrl && (
                      <a href={liveDemoUrl} target="_blank" rel="noreferrer">
                        {t(UI_STRING_KEYS.listing_live_demo)}
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
