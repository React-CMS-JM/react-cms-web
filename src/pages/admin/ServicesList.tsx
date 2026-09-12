import { ContentList } from '../../components/admin/ContentList';

export function ServicesAdminList() {
  return (
    <ContentList
      typeSlug="service"
      title="Services"
      subtitle="Manage professional services offered on the site"
      basePath="/admin/services"
      publicBasePath="/services"
      newLabel="New Service"
    />
  );
}
