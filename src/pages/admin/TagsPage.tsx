import { TaxonomyManager } from '../../components/admin/TaxonomyManager';
import { useContent } from '../../context/ContentContext';

export function TagsPage() {
  const { getLocalizedTags, createTag, updateTag, deleteTag, language } = useContent();

  const tags = getLocalizedTags();

  return (
    <TaxonomyManager
      title="Tags"
      description="Fine-grained labels for filtering and discovery."
      items={tags}
      onCreate={(input) => createTag({ languageCode: language, ...input })}
      onUpdate={(id, input) => updateTag(id, { languageCode: language, ...input })}
      onDelete={deleteTag}
    />
  );
}
