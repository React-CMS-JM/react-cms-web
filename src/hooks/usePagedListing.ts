import { useState } from 'react';
import { useLocale } from '../context/LocaleContext';
import { usePublishedList, useSiteSettings } from './usePublicContent';
import type { ContentTypeSlug } from '../types/content';
import { DEFAULT_SETTINGS, resolvePostsPerPage } from '../types/settings';

type ListingType = Exclude<ContentTypeSlug, 'page'>;

export function usePagedListing(type: ListingType) {
  const { language } = useLocale();
  const settingsQuery = useSiteSettings();
  const settings = settingsQuery.data ?? DEFAULT_SETTINGS;
  const pageSize = resolvePostsPerPage(settings.postsPerPage);
  const [page, setPage] = useState(0);
  const [prevPageSize, setPrevPageSize] = useState(pageSize);

  if (prevPageSize !== pageSize) {
    setPrevPageSize(pageSize);
    setPage(0);
  }

  const list = usePublishedList(type, page, pageSize, settingsQuery.isSuccess);

  const total = list.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);

  return {
    items: list.data?.items ?? [],
    metadata: list.data?.metadata ?? [],
    page,
    setPage,
    total,
    totalPages,
    loading: !settingsQuery.isSuccess || list.isPending,
    size: pageSize,
    language,
  };
}
