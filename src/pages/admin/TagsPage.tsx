import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TaxonomyManager } from '../../components/admin/TaxonomyManager';
import { useContent } from '../../context/ContentContext';
import { isTaxonomySearchEligible, taxonomyKeys } from '../../lib/queryClient';
import { contentApi, mapTag } from '../../services/contentApi';

const PAGE_SIZE = 10;

export function TagsPage() {
  const { language } = useContent();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [draftSearch, setDraftSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const adminQuery = useQuery({
    queryKey: taxonomyKeys.adminTags(language, page, appliedSearch),
    queryFn: async () => {
      const res = await contentApi.listTagsAdmin({
        lang: language,
        page,
        size: PAGE_SIZE,
        q: appliedSearch || undefined,
      });
      return {
        ...res,
        items: res.items.map(mapTag),
      };
    },
  });

  const totalPages = useMemo(() => {
    const total = adminQuery.data?.total ?? 0;
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [adminQuery.data?.total]);

  const invalidateTaxonomy = () => {
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
      items={adminQuery.data?.items ?? []}
      loading={adminQuery.isLoading}
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
