import { ContentList } from '../../components/admin/ContentList';

export function PostsList() {
  return (
    <ContentList
      typeSlug="post"
      title="Posts"
      subtitle="Manage blog posts and articles"
      basePath="/admin/posts"
      publicBasePath="/blog"
      newLabel="New Post"
    />
  );
}
