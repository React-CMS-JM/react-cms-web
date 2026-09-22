import { TaxonomyManager } from '../../components/admin/TaxonomyManager';
import { useContent } from '../../context/ContentContext';

export function CategoriesPage() {
  const { getLocalizedCategories, createCategory, updateCategory, deleteCategory, language } = useContent();

  const categories = getLocalizedCategories();

  return (
    <TaxonomyManager
      title="Categories"
      description="Broad groupings used to organize posts and courses."
      items={categories}
      onCreate={(input) => createCategory({ languageCode: language, ...input })}
      onUpdate={(id, input) => updateCategory(id, { languageCode: language, ...input })}
      onDelete={deleteCategory}
    />
  );
}
