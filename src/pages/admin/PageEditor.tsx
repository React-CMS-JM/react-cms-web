import { PostForm } from '../../components/admin/PostForm';

export function PageEditor() {
  return <PostForm typeSlug="page" basePath="/admin/pages" publicBasePath="/page" noun="Page" />;
}
