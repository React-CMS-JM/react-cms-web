import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TaxonomyManager } from '../../components/admin/TaxonomyManager';
import { useContent } from '../../context/ContentContext';
import {
  clearEmptyTaxonomySearches,
  isKnownEmptyTaxonomySearch,
  isTaxonomySearchEligible,
  rememberEmptyTaxonomySearch,
  taxonomyKeys,
} from '../../lib/queryClient';
import { contentApi, mapTag } from '../../services/contentApi';

const PAGE_SIZE = 10;
const KIND = 'tags' as const;

export function TagsPage() {
  const { language } = useContent();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [draftSearch, setDraftSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const knownEmpty = Boolean(
    appliedSearch && isKnownEmptyTaxonomySearch(KIND, language, appliedSearch),
  );

  const adminQuery = useQuery({
    queryKey: taxonomyKeys.adminTags(language, page, appliedSearch),
    enabled: !knownEmpty,
    queryFn: async () => {
      const res = await contentApi.listTagsAdmin({
        lang: language,
        page,
        size: PAGE_SIZE,
        q: appliedSearch || undefined,
      });
      if (appliedSearch && res.total === 0) {
        rememberEmptyTaxonomySearch(KIND, language, appliedSearch);
      }
      return {
        ...res,
        items: res.items.map(mapTag),
      };
    },
  });

  const items = knownEmpty ? [] : (adminQuery.data?.items ?? []);
  const total = knownEmpty ? 0 : (adminQuery.data?.total ?? 0);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [total]);

  const invalidateTaxonomy = () => {
    clearEmptyTaxonomySearches(KIND, language);
    void queryClient.invalidateQueries({ queryKey: ['taxonomy', 'tags'] });
  };

  const createMutation = useMutation({
    mutationFn: (input: { name: string; slug: string }) =>
      contentApi.createTag({ languageCode: language, ...input, dbDescription: input.name }),
    onSuccess: invalidateTaxonomy,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name, slug }: { id: number; name: string; slug: string }) =>
      contentApi.updateTag(id, { languageCode: language, name, slug, dbDescription: name }),
    onSuccess: invalidateTaxonomy,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contentApi.deleteTag(id),
    onSuccess: invalidateTaxonomy,
  });

  return (
    <TaxonomyManager
      title="Tags"
      description="Fine-grained labels for filtering and discovery."
      items={items}
      loading={!knownEmpty && adminQuery.isLoading}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      searchValue={draftSearch}
      onSearchValueChange={setDraftSearch}
      onSearchSubmit={() => {
        const next = draftSearch.trim();
        if (next && !isTaxonomySearchEligible(next)) return;
        setAppliedSearch(next);
        setPage(0);
      }}
      onCreate={(input) => createMutation.mutateAsync(input)}
      onUpdate={(id, input) => updateMutation.mutateAsync({ id, ...input })}
      onDelete={(id) => deleteMutation.mutateAsync(id)}
    />
  );
}
