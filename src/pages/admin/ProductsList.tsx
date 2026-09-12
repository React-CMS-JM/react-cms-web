import { ContentList } from '../../components/admin/ContentList';

export function ProductsAdminList() {
  return (
    <ContentList
      typeSlug="product"
      title="Products"
      subtitle="Manage software products and their metadata"
      basePath="/admin/products"
      publicBasePath="/products"
      newLabel="New Product"
    />
  );
}
