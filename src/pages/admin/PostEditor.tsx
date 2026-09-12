import { PostForm } from '../../components/admin/PostForm';

export function PostEditor() {
  return <PostForm typeSlug="post" basePath="/admin/posts" publicBasePath="/blog" noun="Post" />;
}
