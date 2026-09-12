import { TaxonomyManager } from '../../components/admin/TaxonomyManager';
import { useContent } from '../../context/ContentContext';

export function CategoriesPage() {
  const { getLocalizedCategories, posts, createCategory, updateCategory, deleteCategory, language } = useContent();

  const categories = getLocalizedCategories();

  return (
    <TaxonomyManager
      title="Categories"
      description="Broad groupings used to organize posts and courses."
      items={categories}
      usageCount={(id) => posts.filter((p) => p.categoryIds.includes(id)).length}
      onCreate={(input) => createCategory({ languageCode: language, ...input })}
      onUpdate={(id, input) => updateCategory(id, { languageCode: language, ...input })}
      onDelete={deleteCategory}
    />
  );
}
