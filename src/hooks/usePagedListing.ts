import { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext';
import type { ContentTypeSlug, LocalizedPost } from '../types/content';

export const LISTING_PAGE_SIZE = 12;

type ListingType = Exclude<ContentTypeSlug, 'page'>;

export function usePagedListing(type: ListingType) {
  const { fetchPostsPage, fetchCoursesPage, language } = useContent();
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<LocalizedPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const result =
          type === 'course'
            ? await fetchCoursesPage(page, LISTING_PAGE_SIZE, 'published')
            : await fetchPostsPage(type, page, LISTING_PAGE_SIZE, 'published');
        if (cancelled) return;
        setItems(result.items);
        setTotal(result.total);
      } catch {
        if (cancelled) return;
        setItems([]);
        setTotal(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [type, page, language, fetchPostsPage, fetchCoursesPage]);

  const totalPages = Math.max(1, Math.ceil(total / LISTING_PAGE_SIZE));

  return {
    items,
    page,
    setPage,
    total,
    totalPages,
    loading,
    size: LISTING_PAGE_SIZE,
  };
}
