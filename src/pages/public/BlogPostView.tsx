import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { AccessBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { CommentsSection } from '../../components/content/CommentsSection';
import { PremiumGate } from '../../components/content/PremiumGate';
import { useContent } from '../../context/ContentContext';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';
import { userFullName } from '../../types/user';

export function BlogPostView() {
  const { slug } = useParams<{ slug: string }>();
  const {
    getLocalizedPostBySlug,
    ensurePostBySlug,
    incrementViewCount,
    getUser,
    getLocalizedCategories,
    getLocalizedTags,
  } = useContent();
  const t = useUiString();
  const post = slug ? getLocalizedPostBySlug(slug, 'post') : undefined;
  const localizedCategories = getLocalizedCategories();
  const localizedTags = getLocalizedTags();
  const counted = useRef(false);
  const [resolving, setResolving] = useState(!!slug && !post);

  useEffect(() => {
    if (!slug || post) {
      setResolving(false);
      return;
    }
    let cancelled = false;
    setResolving(true);
    void ensurePostBySlug(slug, 'post').finally(() => {
      if (!cancelled) setResolving(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug, post, ensurePostBySlug]);

  useEffect(() => {
    if (post && post.status === 'published' && !counted.current) {
      counted.current = true;
      incrementViewCount(post.id);
    }
  }, [post, incrementViewCount]);

  if (resolving) {
    return (
      <PublicLayout>
        <p className="empty-state">Loading…</p>
      </PublicLayout>
    );
  }

  if (!post || post.status !== 'published') {
    return (
      <PublicLayout>
        <div className="not-found">
          <h1>{t(UI_STRING_KEYS.common_not_found_title)}</h1>
          <p>{t(UI_STRING_KEYS.common_not_found_body)}</p>
          <Link to="/blog">{t(UI_STRING_KEYS.common_back_blog)}</Link>
        </div>
      </PublicLayout>
    );
  }

  const author = getUser(post.authorId);

  return (
    <PublicLayout>
      <article className="public-article">
        <header className="article-header">
          <div className="article-header-top">
            <h1>{post.title}</h1>
            <AccessBadge level={post.accessLevel} />
          </div>
          <div className="post-meta">
            {author && (
              <span className="post-author">
                <Avatar user={author} size={24} />
                {userFullName(author)}
              </span>
            )}
            <time dateTime={post.publishedAt ?? undefined}>
              {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
            </time>
            <span>{post.viewCount.toLocaleString()} views</span>
          </div>
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
        </header>

        {post.accessLevel === 'premium' ? (
          <PremiumGate teaser={<p className="post-excerpt">{post.excerpt}</p>}>
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
          </PremiumGate>
        ) : (
          <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
      </article>

      <CommentsSection postId={post.id} />

      <p className="back-link">
        <Link to="/blog">{t(UI_STRING_KEYS.common_back_blog)}</Link>
      </p>
    </PublicLayout>
  );
}
