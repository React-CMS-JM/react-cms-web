import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { contentApi, mapCategory, mapTag } from '../services/contentApi';
import type { LocalizedCategory, LocalizedTag } from '../types/taxonomy';
import {
  isTaxonomySearchEligible,
  normalizeTaxonomySearchKey,
  taxonomyKeys,
} from '../lib/queryClient';

type Kind = 'categories' | 'tags';

function usePopularTaxonomy(kind: Kind, lang: string) {
  return useQuery({
    queryKey:
      kind === 'categories' ? taxonomyKeys.popularCategories(lang) : taxonomyKeys.popularTags(lang),
    queryFn: async () => {
      if (kind === 'categories') {
        return (await contentApi.listCategories(lang)).map(mapCategory);
      }
      return (await contentApi.listTags(lang)).map(mapTag);
    },
  });
}

/**
 * Hybrid autocomplete data:
 * - React Query cache of top-100 popular items
 * - After 300ms with no local matches, call search API (once per query)
 * - Search hits are merged into the in-memory option list
 */
export function useTaxonomyPickerOptions(kind: Kind, lang: string) {
  const queryClient = useQueryClient();
  const popular = usePopularTaxonomy(kind, lang);
  const [searchInput, setSearchInput] = useState('');
  const [extra, setExtra] = useState<Array<LocalizedCategory | LocalizedTag>>([]);
  const searchedRef = useRef(new Set<string>());

  const cachedItems = useMemo(() => {
    const base = popular.data ?? [];
    const byId = new Map<number, LocalizedCategory | LocalizedTag>();
    for (const item of base) byId.set(item.id, item);
    for (const item of extra) byId.set(item.id, item);
    return [...byId.values()];
  }, [popular.data, extra]);

  useEffect(() => {
    const q = searchInput.trim();
    if (!isTaxonomySearchEligible(q)) return;

    const needle = q.toLowerCase();
    const hasLocal = cachedItems.some(
      (item) =>
        item.name.toLowerCase().includes(needle) || item.slug.toLowerCase().includes(needle),
    );
    if (hasLocal) return;

    const key = normalizeTaxonomySearchKey(q);
    if (searchedRef.current.has(key)) return;

    const timer = window.setTimeout(() => {
      if (searchedRef.current.has(key)) return;
      searchedRef.current.add(key);
      void (async () => {
        const rows =
          kind === 'categories'
            ? await contentApi.searchCategories(q, lang, 20)
            : await contentApi.searchTags(q, lang, 20);
        const mapped =
          kind === 'categories' ? rows.map(mapCategory) : rows.map(mapTag);
        setExtra((prev) => {
          const byId = new Map(prev.map((item) => [item.id, item]));
          for (const item of mapped) byId.set(item.id, item);
          return [...byId.values()];
        });
        // Seed popular cache with new hits so later mounts see them.
        const popularKey =
          kind === 'categories'
            ? taxonomyKeys.popularCategories(lang)
            : taxonomyKeys.popularTags(lang);
        queryClient.setQueryData<Array<LocalizedCategory | LocalizedTag>>(popularKey, (prev) => {
          const current = prev ?? [];
          const byId = new Map(current.map((item) => [item.id, item]));
          for (const item of mapped) {
            if (!byId.has(item.id)) byId.set(item.id, item);
          }
          return [...byId.values()];
        });
      })().catch(() => {
        searchedRef.current.delete(key);
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput, cachedItems, kind, lang, queryClient]);

  const onSearchChange = useCallback((query: string) => {
    setSearchInput(query);
  }, []);

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: kind === 'categories' ? ['taxonomy', 'categories'] : ['taxonomy', 'tags'],
    });
  }, [kind, queryClient]);

  return {
    items: cachedItems,
    loading: popular.isLoading,
    onSearchChange,
    invalidate,
    searchInput,
  };
}

export function usePopularCategories(lang: string) {
  return usePopularTaxonomy('categories', lang);
}

export function usePopularTags(lang: string) {
  return usePopularTaxonomy('tags', lang);
}

/** Resolve labels for ids (popular cache + by-ids for misses). */
export function useTaxonomyLabels(kind: Kind, ids: number[], lang: string) {
  const popular = usePopularTaxonomy(kind, lang);
  const missingKey = useMemo(() => {
    const known = new Set((popular.data ?? []).map((item) => item.id));
    return [...new Set(ids.filter((id) => Number.isFinite(id) && !known.has(id)))]
      .sort((a, b) => a - b)
      .join(',');
  }, [ids, popular.data]);

  const missingIds = useMemo(
    () => (missingKey ? missingKey.split(',').map(Number) : []),
    [missingKey],
  );

  const byIdsQuery = useQuery({
    queryKey:
      kind === 'categories'
        ? taxonomyKeys.byIdsCategories(lang, missingKey)
        : taxonomyKeys.byIdsTags(lang, missingKey),
    queryFn: async () => {
      if (kind === 'categories') {
        return (await contentApi.listCategoriesByIds(missingIds, lang)).map(mapCategory);
      }
      return (await contentApi.listTagsByIds(missingIds, lang)).map(mapTag);
    },
    enabled: missingIds.length > 0,
  });

  return useMemo(() => {
    const map = new Map<number, LocalizedCategory | LocalizedTag>();
    for (const item of popular.data ?? []) map.set(item.id, item);
    for (const item of byIdsQuery.data ?? []) map.set(item.id, item);
    return map;
  }, [popular.data, byIdsQuery.data]);
}
