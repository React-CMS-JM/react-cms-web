import { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext';
import type { ContentTypeSlug, LocalizedPost } from '../types/content';
import { resolvePostsPerPage } from '../types/settings';

type ListingType = Exclude<ContentTypeSlug, 'page'>;

export function usePagedListing(type: ListingType) {
  const { fetchPostsPage, fetchCoursesPage, language, settings } = useContent();
  const pageSize = resolvePostsPerPage(settings.postsPerPage);
  const [page, setPage] = useState(0);
  const [prevPageSize, setPrevPageSize] = useState(pageSize);
  const [items, setItems] = useState<LocalizedPost[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  if (prevPageSize !== pageSize) {
    setPrevPageSize(pageSize);
    setPage(0);
  }

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const result =
          type === 'course'
            ? await fetchCoursesPage(page, pageSize, 'published')
            : await fetchPostsPage(type, page, pageSize, 'published');
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
  }, [type, page, pageSize, language, fetchPostsPage, fetchCoursesPage]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items,
    page,
    setPage,
    total,
    totalPages,
    loading,
    size: pageSize,
  };
}
