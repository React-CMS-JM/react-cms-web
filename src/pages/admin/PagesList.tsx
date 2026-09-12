import { ContentList } from '../../components/admin/ContentList';

export function PagesList() {
  return (
    <ContentList
      typeSlug="page"
      title="Pages"
      subtitle="Manage static pages for your site"
      basePath="/admin/pages"
      publicBasePath="/page"
      newLabel="New Page"
    />
  );
}
