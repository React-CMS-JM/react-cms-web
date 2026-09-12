import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { AccessBadge } from '../../components/ui/Badge';
import { useContent } from '../../context/ContentContext';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function BlogList() {
  const { getLocalizedPostsByType, getLocalizedCategories, getLocalizedTags } = useContent();
  const t = useUiString();

  const posts = getLocalizedPostsByType('post')
    .filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime());

  const localizedCategories = getLocalizedCategories();
  const localizedTags = getLocalizedTags();

  return (
    <PublicLayout>
      <section className="posts-section">
        <div className="section-heading">
          <h1>{t(UI_STRING_KEYS.listing_blog_title)}</h1>
          <p className="page-subtitle">{t(UI_STRING_KEYS.listing_blog_subtitle)}</p>
        </div>

        {posts.length === 0 ? (
          <p className="empty-state">{t(UI_STRING_KEYS.listing_empty)}</p>
        ) : (
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
                      const category = localizedCategories.find((c) => c.id === cid);
                      return category ? (
                        <span key={cid} className="tag tag-category">
                          {category.name}
                        </span>
                      ) : null;
                    })}
                    {post.tagIds.map((tid) => {
                      const tag = localizedTags.find((t) => t.id === tid);
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
        )}
      </section>
    </PublicLayout>
  );
}
