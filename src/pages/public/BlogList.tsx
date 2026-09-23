import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { ListingPagination } from '../../components/public/ListingPagination';
import { AccessBadge } from '../../components/ui/Badge';
import { usePagedListing } from '../../hooks/usePagedListing';
import { useTaxonomyLabels } from '../../hooks/useTaxonomy';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function BlogList() {
  const { items: posts, page, setPage, totalPages, loading, language } = usePagedListing('post');
  const t = useUiString();

  const categoryIds = useMemo(
    () => posts.flatMap((post) => post.categoryIds),
    [posts],
  );
  const tagIds = useMemo(() => posts.flatMap((post) => post.tagIds), [posts]);
  const categoriesById = useTaxonomyLabels('categories', categoryIds, language);
  const tagsById = useTaxonomyLabels('tags', tagIds, language);

  return (
    <PublicLayout>
      <section className="posts-section">
        <div className="section-heading">
          <h1>{t(UI_STRING_KEYS.listing_blog_title)}</h1>
          <p className="page-subtitle">{t(UI_STRING_KEYS.listing_blog_subtitle)}</p>
        </div>

        {loading ? (
          <p className="empty-state">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="empty-state">{t(UI_STRING_KEYS.listing_empty)}</p>
        ) : (
          <>
            <div className="posts-grid">
              {posts.map((post) => (
                <article key={post.id} className="post-card">
                  <div className="post-card-top">
                    <h3>
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <AccessBadge level={post.accessLevel} />
                  </div>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-meta">
                    <time dateTime={post.publishedAt ?? undefined}>
                      {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
                    </time>
                    <div className="tag-list">
                      {post.categoryIds.map((cid) => {
                        const category = categoriesById.get(cid);
                        return category ? (
                          <span key={cid} className="tag tag-category">
                            {category.name}
                          </span>
                        ) : null;
                      })}
                      {post.tagIds.map((tid) => {
                        const tag = tagsById.get(tid);
                        return tag ? (
                          <span key={tid} className="tag">
                            {tag.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
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
