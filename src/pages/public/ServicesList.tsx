import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { ListingPagination } from '../../components/public/ListingPagination';
import { usePagedListing } from '../../hooks/usePagedListing';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function ServicesList() {
  const { items: services, page, setPage, totalPages, loading } = usePagedListing('service');
  const t = useUiString();

  return (
    <PublicLayout>
      <section className="posts-section">
        <div className="section-heading">
          <h1>{t(UI_STRING_KEYS.listing_services_title)}</h1>
          <p className="page-subtitle">{t(UI_STRING_KEYS.listing_services_subtitle)}</p>
        </div>

        {loading ? (
          <p className="empty-state">Loading…</p>
        ) : services.length === 0 ? (
          <p className="empty-state">{t(UI_STRING_KEYS.listing_empty)}</p>
        ) : (
          <>
            <div className="posts-grid">
              {services.map((service) => (
                <article key={service.id} className="post-card">
                  <div className="post-card-top">
                    <h3>
                      <Link to={`/services/${service.slug}`}>{service.title}</Link>
                    </h3>
                  </div>
                  <p className="post-excerpt">{service.excerpt}</p>
                  <Link to={`/services/${service.slug}`} className="section-link">
                    {t(UI_STRING_KEYS.listing_learn_more)}
                  </Link>
                </article>
              ))}
            </div>
            <ListingPagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </section>
    </PublicLayout>
  );
}
