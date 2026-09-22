import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

export const taxonomyKeys = {
  popularCategories: (lang: string) => ['taxonomy', 'categories', 'popular', lang] as const,
  popularTags: (lang: string) => ['taxonomy', 'tags', 'popular', lang] as const,
  adminCategories: (lang: string, page: number, q: string) =>
    ['taxonomy', 'categories', 'admin', lang, page, q] as const,
  adminTags: (lang: string, page: number, q: string) =>
    ['taxonomy', 'tags', 'admin', lang, page, q] as const,
  byIdsCategories: (lang: string, idsKey: string) =>
    ['taxonomy', 'categories', 'by-ids', lang, idsKey] as const,
  byIdsTags: (lang: string, idsKey: string) =>
    ['taxonomy', 'tags', 'by-ids', lang, idsKey] as const,
};

/** At least 2 non-space characters required before searching. */
export function isTaxonomySearchEligible(q: string): boolean {
  return q.trim().replace(/\s+/g, '').length >= 2;
}

export function normalizeTaxonomySearchKey(q: string): string {
  return q.trim().toLowerCase();
}
