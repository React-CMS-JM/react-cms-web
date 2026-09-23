import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { AccessBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { CommentsSection } from '../../components/content/CommentsSection';
import { PremiumGate } from '../../components/content/PremiumGate';
import { useLocale } from '../../context/LocaleContext';
import { usePublishedBySlug, useRecordPublicView } from '../../hooks/usePublicContent';
import { useUsersByIds, userSummaryDisplayName } from '../../hooks/useUsersByIds';
import { useTaxonomyLabels } from '../../hooks/useTaxonomy';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';
import type { User } from '../../types/user';
import type { UserSummaryDto } from '../../services/authApi';

function summaryAsUser(summary: UserSummaryDto): User {
  return {
    id: summary.id,
    email: '',
    firstName: summary.firstName,
    lastName: summary.lastName,
    avatarColor: summary.avatarColor,
    isBanned: false,
    banReason: null,
    roleIds: [],
    createdAt: '',
    updatedAt: '',
  };
}

export function BlogPostView() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLocale();
  const t = useUiString();
  const query = usePublishedBySlug('post', slug);
  const post = query.data?.post;
  const resolving = Boolean(slug) && query.isPending;
  useRecordPublicView('post', slug, post?.id, post?.status === 'published');

  const authorIds = useMemo(() => (post ? [post.authorId] : []), [post]);
  const authorsById = useUsersByIds(authorIds);
  const categoriesById = useTaxonomyLabels('categories', post?.categoryIds ?? [], language);
  const tagsById = useTaxonomyLabels('tags', post?.tagIds ?? [], language);

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

  const authorSummary = authorsById[post.authorId];
  const author = authorSummary ? summaryAsUser(authorSummary) : undefined;

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
                {userSummaryDisplayName(authorSummary)}
              </span>
            )}
            <time dateTime={post.publishedAt ?? undefined}>
              {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
            </time>
            <span>{post.viewCount.toLocaleString()} views</span>
          </div>
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
