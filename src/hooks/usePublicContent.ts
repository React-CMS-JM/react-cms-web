import { useQuery, useQueryClient, useQueries } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { useLocale } from '../context/LocaleContext';
import { contentApi } from '../services/contentApi';
import {
  STALE,
  NAV_PAGE_SIZE,
  fetchContentTypes,
  fetchCourseLessons,
  fetchPublishedBySlug,
  fetchPublishedCourses,
  fetchPublishedPosts,
  fetchPublicUiStrings,
  fetchSettings,
  findCachedPublished,
  publicKeys,
  type PublicDetailKind,
  type PublicPostType,
  type PublishedList,
} from '../lib/publicQueries';
import type { HomeSectionId, VisibilityOrderItem } from '../types/settings';
import { resolveHomeSectionLimit } from '../types/settings';

const SECTION_TYPE: Record<Exclude<HomeSectionId, 'courses'>, PublicPostType> = {
  blog: 'post',
  products: 'product',
  services: 'service',
};

export function useSiteSettings() {
  const { language } = useLocale();
  return useQuery({
    queryKey: publicKeys.settings(language),
    queryFn: () => fetchSettings(language),
    staleTime: STALE.settings,
  });
}

export function usePublicUiStrings() {
  const { language } = useLocale();
  return useQuery({
    queryKey: publicKeys.uiStrings(language),
    queryFn: () => fetchPublicUiStrings(language),
    staleTime: STALE.uiStrings,
  });
}

export function useContentTypes() {
  return useQuery({
    queryKey: publicKeys.contentTypes(),
    queryFn: fetchContentTypes,
    staleTime: STALE.contentTypes,
  });
}

export function useNavPages() {
  const { language } = useLocale();
  return useQuery({
    queryKey: publicKeys.posts('page', language, 0, NAV_PAGE_SIZE),
    queryFn: () => fetchPublishedPosts('page', language, 0, NAV_PAGE_SIZE),
    staleTime: STALE.list,
  });
}

/** Tier A shell: settings, public UI strings, nav pages, content types. */
export function usePublicShell() {
  const settings = useSiteSettings();
  const uiStrings = usePublicUiStrings();
  const pages = useNavPages();
  const contentTypes = useContentTypes();
  const isLoading = [settings, uiStrings, pages, contentTypes].some((query) => query.isPending);
  return { settings, uiStrings, pages, contentTypes, isLoading };
}

export function usePublishedList(
  type: PublicPostType | 'course',
  page: number,
  size: number,
  enabled = true,
) {
  const { language } = useLocale();
  return useQuery({
    queryKey:
      type === 'course'
        ? publicKeys.courses(language, page, size)
        : publicKeys.posts(type, language, page, size),
    queryFn: () =>
      type === 'course'
        ? fetchPublishedCourses(language, page, size)
        : fetchPublishedPosts(type, language, page, size),
    staleTime: STALE.list,
    enabled,
  });
}

export function useHomeSectionFeeds(
  sections: VisibilityOrderItem<HomeSectionId>[],
  enabled: boolean,
) {
  const { language } = useLocale();
  const visible = useMemo(() => sections.filter((section) => section.visible), [sections]);

  const results = useQueries({
    queries: visible.map((section) => {
      const size = resolveHomeSectionLimit(section, section.id);
      if (section.id === 'courses') {
        return {
          queryKey: publicKeys.courses(language, 0, size),
          queryFn: () => fetchPublishedCourses(language, 0, size),
          staleTime: STALE.list,
          enabled,
        };
      }
      const type = SECTION_TYPE[section.id];
      return {
        queryKey: publicKeys.posts(type, language, 0, size),
        queryFn: () => fetchPublishedPosts(type, language, 0, size),
        staleTime: STALE.list,
        enabled,
      };
    }),
  });

  const feeds: Record<HomeSectionId, PublishedList | undefined> = {
    services: undefined,
    products: undefined,
    blog: undefined,
    courses: undefined,
  };
  visible.forEach((section, index) => {
    feeds[section.id] = results[index]?.data;
  });
  return feeds;
}

export function usePublishedBySlug(kind: PublicDetailKind, slug: string | undefined) {
  const { language } = useLocale();
  const queryClient = useQueryClient();
  const seeded = slug ? findCachedPublished(queryClient, kind, slug, language) : undefined;

  return useQuery({
    queryKey:
      kind === 'course'
        ? publicKeys.courseBySlug(slug ?? '', language)
        : publicKeys.postBySlug(kind, slug ?? '', language),
    queryFn: () => fetchPublishedBySlug(kind, slug ?? '', language),
    enabled: Boolean(slug),
    staleTime: STALE.list,
    ...(seeded
      ? { initialData: seeded, initialDataUpdatedAt: Date.now() }
      : {}),
  });
}

export function useCourseLessons(courseId: string | undefined, enabled = true) {
  const { language } = useLocale();
  return useQuery({
    queryKey: publicKeys.lessons(courseId ?? '', language),
    queryFn: () => fetchCourseLessons(courseId ?? '', language),
    enabled: Boolean(courseId) && enabled,
    staleTime: STALE.list,
  });
}

/** Fire-and-forget view increment. Does not refetch the entity. Courses stay local-only. */
export function useRecordPublicView(
  kind: PublicDetailKind,
  slug: string | undefined,
  entityId: string | undefined,
  active: boolean,
) {
  const { language } = useLocale();
  const queryClient = useQueryClient();
  const countedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!active || !entityId || !slug || countedFor.current === entityId) return;
    countedFor.current = entityId;
    const key =
      kind === 'course'
        ? publicKeys.courseBySlug(slug, language)
        : publicKeys.postBySlug(kind, slug, language);

    queryClient.setQueryData(
      key,
      (current: { post: { id: string; viewCount: number } } | null | undefined) => {
        if (!current?.post || current.post.id !== entityId) return current;
        return { ...current, post: { ...current.post, viewCount: current.post.viewCount + 1 } };
      },
    );

    if (kind !== 'course') {
      void contentApi.incrementView(entityId).catch(() => undefined);
    }
  }, [active, entityId, slug, kind, language, queryClient]);
}
