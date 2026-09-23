import type { QueryClient } from '@tanstack/react-query';
import {
  contentApi,
  mapContentType,
  mapLocalizedPost,
  mapMetadata,
  mapSiteSettings,
  mapUiString,
} from '../services/contentApi';
import {
  coursesApi,
  mapCourseMetadata,
  mapLocalizedCourse,
  mapLocalizedLesson,
} from '../services/coursesApi';
import type { ContentType, LanguageCode, LocalizedCourseLesson, LocalizedPost, PostMetadata } from '../types/content';
import type { ParamUiStringI18n } from '../types/paramUi';
import type { SiteSettings } from '../types/settings';

/** Public nav only needs published pages (about, contact, home). */
export const NAV_PAGE_SIZE = 50;

export const STALE = {
  settings: 15 * 60_000,
  uiStrings: 30 * 60_000,
  contentTypes: 60 * 60_000,
  list: 3 * 60_000,
  taxonomyPopular: 10 * 60_000,
} as const;

const ADMIN_UI_COMPONENT = 'AdminSidebar';

export type PublicPostType = 'post' | 'page' | 'service' | 'product';
export type PublicDetailKind = PublicPostType | 'course';

export interface PublishedList {
  items: LocalizedPost[];
  metadata: PostMetadata[];
  page: number;
  size: number;
  total: number;
}

export interface PublishedEntity {
  post: LocalizedPost;
  metadata: PostMetadata[];
}

export const publicKeys = {
  settings: (lang: string) => ['settings', lang] as const,
  uiStrings: (lang: string) => ['ui-strings', lang] as const,
  contentTypes: () => ['content-types'] as const,
  posts: (type: PublicPostType, lang: string, page: number, size: number) =>
    ['posts', type, 'published', lang, page, size] as const,
  courses: (lang: string, page: number, size: number) =>
    ['courses', 'published', lang, page, size] as const,
  postBySlug: (type: PublicPostType, slug: string, lang: string) =>
    ['post', type, 'slug', slug, lang] as const,
  courseBySlug: (slug: string, lang: string) => ['course', 'slug', slug, lang] as const,
  lessons: (courseId: string, lang: string) => ['course', courseId, 'lessons', lang] as const,
};

export function fetchSettings(lang: LanguageCode): Promise<SiteSettings> {
  return contentApi.getSettings(lang).then(mapSiteSettings);
}

export function fetchPublicUiStrings(lang: LanguageCode): Promise<ParamUiStringI18n[]> {
  return contentApi.listUiStrings({ lang }).then((rows) =>
    rows.filter((row) => row.uiComponent !== ADMIN_UI_COMPONENT).map(mapUiString),
  );
}

export function fetchContentTypes(): Promise<ContentType[]> {
  return contentApi.listContentTypes().then((rows) => rows.map(mapContentType));
}

export async function fetchPublishedPosts(
  type: PublicPostType,
  lang: LanguageCode,
  page: number,
  size: number,
): Promise<PublishedList> {
  const result = await contentApi.listPosts({
    type,
    status: 'published',
    lang,
    page,
    size,
  });
  return {
    items: result.items.map(mapLocalizedPost),
    metadata: result.items.flatMap((dto) => (dto.metadata ?? []).map(mapMetadata)),
    page: result.page,
    size: result.size,
    total: result.total,
  };
}

export async function fetchPublishedCourses(
  lang: LanguageCode,
  page: number,
  size: number,
): Promise<PublishedList> {
  const result = await coursesApi.listCourses({
    status: 'published',
    lang,
    page,
    size,
  });
  return {
    items: result.items.map(mapLocalizedCourse),
    metadata: result.items.flatMap((dto) => (dto.metadata ?? []).map(mapCourseMetadata)),
    page: result.page,
    size: result.size,
    total: result.total,
  };
}

export async function fetchPublishedBySlug(
  kind: PublicDetailKind,
  slug: string,
  lang: LanguageCode,
): Promise<PublishedEntity | null> {
  try {
    if (kind === 'course') {
      const dto = await coursesApi.getCourseBySlug(slug, lang);
      return {
        post: mapLocalizedCourse(dto),
        metadata: (dto.metadata ?? []).map(mapCourseMetadata),
      };
    }
    const dto = await contentApi.getPostBySlug(slug, kind, lang);
    return {
      post: mapLocalizedPost(dto),
      metadata: (dto.metadata ?? []).map(mapMetadata),
    };
  } catch {
    return null;
  }
}

export function fetchCourseLessons(
  courseId: string,
  lang: LanguageCode,
): Promise<LocalizedCourseLesson[]> {
  return coursesApi.listLessons(courseId, lang).then((rows) => rows.map(mapLocalizedLesson));
}

/** Reuse a list row already in cache so list → detail does not refetch immediately. */
export function findCachedPublished(
  client: QueryClient,
  kind: PublicDetailKind,
  slug: string,
  lang: string,
): PublishedEntity | undefined {
  const listKey =
    kind === 'course'
      ? (['courses', 'published', lang] as const)
      : (['posts', kind, 'published', lang] as const);
  const lists = client.getQueriesData<PublishedList>({ queryKey: listKey });
  for (const [, data] of lists) {
    const post = data?.items.find((item) => item.slug === slug);
    if (!post) continue;
    return {
      post,
      metadata: (data?.metadata ?? []).filter((row) => row.postId === post.id),
    };
  }
  return undefined;
}
