import { PostForm } from '../../components/admin/PostForm';

export function ProductEditor() {
  return (
    <PostForm typeSlug="product" basePath="/admin/products" publicBasePath="/products" noun="Product" />
  );
}
