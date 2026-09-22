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

type TaxonomyKind = 'categories' | 'tags';

/** Empty LIKE %q% results: any later query containing q is also empty. */
const emptyNeedlesByScope = new Map<string, Set<string>>();

function emptyScopeKey(kind: TaxonomyKind, lang: string): string {
  return `${kind}:${lang}`;
}

function emptyNeedlesFor(kind: TaxonomyKind, lang: string): Set<string> {
  const key = emptyScopeKey(kind, lang);
  let set = emptyNeedlesByScope.get(key);
  if (!set) {
    set = new Set();
    emptyNeedlesByScope.set(key, set);
  }
  return set;
}

/**
 * True when a prior search for a contiguous substring of `q` already returned 0 rows
 * (substring LIKE semantics: if %ab% is empty, %abc% and %xab% are empty too).
 */
export function isKnownEmptyTaxonomySearch(
  kind: TaxonomyKind,
  lang: string,
  q: string,
): boolean {
  const key = normalizeTaxonomySearchKey(q);
  if (!key) return false;
  for (const empty of emptyNeedlesFor(kind, lang)) {
    if (key.includes(empty)) return true;
  }
  return false;
}

/** Record that `q` returned no matches; supersets can skip the API. */
export function rememberEmptyTaxonomySearch(
  kind: TaxonomyKind,
  lang: string,
  q: string,
): void {
  const key = normalizeTaxonomySearchKey(q);
  if (!key) return;
  const set = emptyNeedlesFor(kind, lang);
  for (const empty of set) {
    if (key.includes(empty)) return; // already covered by a shorter/equal empty needle
  }
  for (const empty of [...set]) {
    if (empty !== key && empty.includes(key)) set.delete(empty);
  }
  set.add(key);
}

/** Clear after create/update/delete so new items can match previously empty needles. */
export function clearEmptyTaxonomySearches(kind: TaxonomyKind, lang?: string): void {
  if (lang) {
    emptyNeedlesByScope.delete(emptyScopeKey(kind, lang));
    return;
  }
  for (const key of [...emptyNeedlesByScope.keys()]) {
    if (key.startsWith(`${kind}:`)) emptyNeedlesByScope.delete(key);
  }
}
