import { PostForm } from '../../components/admin/PostForm';

export function ServiceEditor() {
  return (
    <PostForm typeSlug="service" basePath="/admin/services" publicBasePath="/services" noun="Service" />
  );
}
