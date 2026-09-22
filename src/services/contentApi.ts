import { apiEnv } from '../config/env';
import type { Comment, CommentStatus } from '../types/comment';
import type {
  AccessLevel,
  ContentType,
  ContentTypeSlug,
  LanguageCode,
  LocalizedPost,
  PostMetadata,
  PostStatus,
} from '../types/content';
import type { ParamUiStringI18n } from '../types/paramUi';
import {
  DEFAULT_HOME_SECTION_LIMITS,
  DEFAULT_SETTINGS,
  resolveHomeHero,
  type HomeSectionId,
  type SiteSettings,
} from '../types/settings';
import type { LocalizedCategory, LocalizedTag } from '../types/taxonomy';
import { apiRequest, withQuery } from './httpClient';

export interface PageResult<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

export interface LocalizedPostDto {
  id: string;
  authorId: string;
  contentTypeId: number;
  featuredImageUrl: string | null;
  accessLevel: string;
  status: string;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  categoryIds: number[];
  tagIds: number[];
  languageCode: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metadata?: PostMetadataDto[];
}

export interface AdminRecentActivityDto {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  status: string;
  contentTypeSlug: string;
  updatedAt: string;
}

export interface AdminDashboardDto {
  counts: Record<string, number>;
  pendingComments: number;
  recent: AdminRecentActivityDto[];
}

export interface ContentTypeDto {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface LocalizedTaxonomyDto {
  id: number;
  dbDescription: string | null;
  languageCode: string;
  name: string;
  slug: string;
  usageCount?: number;
}

export interface CommentDto {
  id: string;
  postId: string;
  userId: string;
  parentCommentId: string | null;
  content: string;
  languageCode: string;
  availableTranslationLanguages?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentTranslationDto {
  commentId: string;
  languageCode: string;
  content: string;
  isOriginal: boolean;
}

export interface PostMetadataDto {
  id: string;
  postId: string;
  metaKey: string;
  metaValue: string;
}

export interface UiStringDto {
  stringKey: string;
  uiComponent: string;
  languageCode: string;
  stringValue: string;
  updatedAt: string;
}

export interface CreatePostBody {
  authorId?: string;
  contentTypeId?: number;
  contentTypeSlug?: string;
  featuredImageUrl?: string;
  accessLevel?: string;
  status?: string;
  categoryIds?: number[];
  tagIds?: number[];
  languageCode?: string;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdatePostBody {
  contentTypeId?: number;
  featuredImageUrl?: string;
  accessLevel?: string;
  status?: string;
  categoryIds?: number[];
  tagIds?: number[];
  languageCode?: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
}

const base = () => apiEnv.contentBaseUrl;

export function mapLocalizedPost(dto: LocalizedPostDto): LocalizedPost {
  return {
    id: dto.id,
    authorId: dto.authorId,
    contentTypeId: dto.contentTypeId,
    featuredImageUrl: dto.featuredImageUrl ?? '',
    accessLevel: (dto.accessLevel as AccessLevel) || 'public',
    status: (dto.status as PostStatus) || 'draft',
    viewCount: dto.viewCount ?? 0,
    publishedAt: dto.publishedAt,
    categoryIds: dto.categoryIds ?? [],
    tagIds: dto.tagIds ?? [],
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    languageCode: (dto.languageCode as LanguageCode) || 'en',
    title: dto.title ?? '',
    slug: dto.slug ?? '',
    content: dto.content ?? '',
    excerpt: dto.excerpt ?? '',
    metaTitle: dto.metaTitle ?? '',
    metaDescription: dto.metaDescription ?? '',
  };
}

export function mapContentType(dto: ContentTypeDto): ContentType {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug as ContentTypeSlug,
    description: dto.description ?? '',
  };
}

export function mapCategory(dto: LocalizedTaxonomyDto): LocalizedCategory {
  return {
    id: dto.id,
    dbDescription: dto.dbDescription ?? dto.name,
    languageCode: (dto.languageCode as LanguageCode) || 'en',
    name: dto.name,
    slug: dto.slug,
    usageCount: dto.usageCount ?? 0,
  };
}

export function mapTag(dto: LocalizedTaxonomyDto): LocalizedTag {
  return {
    id: dto.id,
    dbDescription: dto.dbDescription ?? dto.name,
    languageCode: (dto.languageCode as LanguageCode) || 'en',
    name: dto.name,
    slug: dto.slug,
    usageCount: dto.usageCount ?? 0,
  };
}

export function mapComment(dto: CommentDto): Comment {
  return {
    id: dto.id,
    postId: dto.postId,
    userId: dto.userId,
    parentCommentId: dto.parentCommentId,
    content: dto.content,
    languageCode: dto.languageCode || 'en',
    availableTranslationLanguages: dto.availableTranslationLanguages ?? [],
    status: (dto.status as CommentStatus) || 'pending',
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function mapMetadata(dto: PostMetadataDto): PostMetadata {
  return {
    id: dto.id,
    postId: dto.postId,
    metaKey: dto.metaKey,
    metaValue: dto.metaValue ?? '',
  };
}

export function mapUiString(dto: UiStringDto, index: number): ParamUiStringI18n {
  return {
    id: index + 1,
    stringKey: dto.stringKey,
    languageCode: (dto.languageCode as LanguageCode) || 'en',
    stringValue: dto.stringValue,
    updatedAt: dto.updatedAt,
  };
}

export function mapSiteSettings(dto: Partial<SiteSettings> | null | undefined): SiteSettings {
  if (!dto) return { ...DEFAULT_SETTINGS, homeHero: resolveHomeHero(null) };
  return {
    siteName: dto.siteName ?? DEFAULT_SETTINGS.siteName,
    siteIconUrl: dto.siteIconUrl ?? '',
    siteDescription: dto.siteDescription ?? '',
    postsPerPage: dto.postsPerPage ?? DEFAULT_SETTINGS.postsPerPage,
    homeHero: resolveHomeHero(dto.homeHero),
    homeSections: dto.homeSections?.length
      ? dto.homeSections.map((section) => {
          const id = section.id as HomeSectionId;
          const fallback = DEFAULT_HOME_SECTION_LIMITS[id] ?? 6;
          const limit = section.itemLimit ?? fallback;
          return {
            ...section,
            itemLimit: !Number.isFinite(limit) || limit < 1 ? 1 : Math.min(50, Math.floor(limit)),
          };
        })
      : DEFAULT_SETTINGS.homeSections.map((s) => ({ ...s })),
    mainMenu: dto.mainMenu?.length
      ? dto.mainMenu
      : DEFAULT_SETTINGS.mainMenu.map((m) => ({ ...m })),
  };
}

export const contentApi = {
  listContentTypes() {
    return apiRequest<ContentTypeDto[]>(base(), '/api/content-types', { auth: false });
  },

  getAdminDashboard(params?: { lang?: string; recentLimit?: number }) {
    return apiRequest<AdminDashboardDto>(base(), withQuery('/api/admin/dashboard', params));
  },

  listPosts(params: {
    type?: string;
    status?: string;
    lang?: string;
    page?: number;
    size?: number;
  }) {
    return apiRequest<PageResult<LocalizedPostDto>>(
      base(),
      withQuery('/api/posts', params),
      { auth: false },
    );
  },

  getPost(id: string, lang?: string) {
    return apiRequest<LocalizedPostDto>(base(), withQuery(`/api/posts/${id}`, { lang }), {
      auth: false,
    });
  },

  getPostBySlug(slug: string, type?: string, lang?: string) {
    return apiRequest<LocalizedPostDto>(
      base(),
      withQuery(`/api/posts/by-slug/${encodeURIComponent(slug)}`, { type, lang }),
      { auth: false },
    );
  },

  createPost(body: CreatePostBody) {
    return apiRequest<LocalizedPostDto>(base(), '/api/posts', { method: 'POST', body });
  },

  updatePost(id: string, body: UpdatePostBody) {
    return apiRequest<LocalizedPostDto>(base(), `/api/posts/${id}`, { method: 'PUT', body });
  },

  setPostStatus(id: string, status: string) {
    return apiRequest<LocalizedPostDto>(base(), `/api/posts/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },

  incrementView(id: string) {
    return apiRequest<LocalizedPostDto>(base(), `/api/posts/${id}/view`, { method: 'POST' });
  },

  deletePost(id: string) {
    return apiRequest<void>(base(), `/api/posts/${id}`, { method: 'DELETE' });
  },

  getMetadata(postId: string) {
    return apiRequest<PostMetadataDto[]>(base(), `/api/posts/${postId}/metadata`, { auth: false });
  },

  putMetadata(postId: string, entries: { metaKey: string; metaValue: string }[]) {
    return apiRequest<PostMetadataDto[]>(base(), `/api/posts/${postId}/metadata`, {
      method: 'PUT',
      body: { entries },
    });
  },

  listCategories(lang?: string) {
    return apiRequest<LocalizedTaxonomyDto[]>(
      base(),
      withQuery('/api/categories', { lang }),
      { auth: false },
    );
  },

  searchCategories(q: string, lang?: string, limit = 20) {
    return apiRequest<LocalizedTaxonomyDto[]>(
      base(),
      withQuery('/api/categories/search', { q, lang, limit }),
      { auth: false },
    );
  },

  listCategoriesByIds(ids: number[], lang?: string) {
    if (ids.length === 0) return Promise.resolve([] as LocalizedTaxonomyDto[]);
    return apiRequest<LocalizedTaxonomyDto[]>(
      base(),
      withQuery('/api/categories/by-ids', { ids: ids.join(','), lang }),
      { auth: false },
    );
  },

  listCategoriesAdmin(params?: { lang?: string; page?: number; size?: number; q?: string }) {
    return apiRequest<PageResult<LocalizedTaxonomyDto>>(
      base(),
      withQuery('/api/categories/admin', {
        lang: params?.lang,
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        q: params?.q,
      }),
      { auth: false },
    );
  },

  createCategory(body: {
    languageCode?: string;
    name: string;
    slug?: string;
    dbDescription?: string;
  }) {
    return apiRequest<LocalizedTaxonomyDto>(base(), '/api/categories', { method: 'POST', body });
  },

  updateCategory(
    id: number,
    body: { languageCode?: string; name?: string; slug?: string; dbDescription?: string },
  ) {
    return apiRequest<LocalizedTaxonomyDto>(base(), `/api/categories/${id}`, {
      method: 'PUT',
      body,
    });
  },

  deleteCategory(id: number) {
    return apiRequest<void>(base(), `/api/categories/${id}`, { method: 'DELETE' });
  },

  listTags(lang?: string) {
    return apiRequest<LocalizedTaxonomyDto[]>(base(), withQuery('/api/tags', { lang }), {
      auth: false,
    });
  },

  searchTags(q: string, lang?: string, limit = 20) {
    return apiRequest<LocalizedTaxonomyDto[]>(
      base(),
      withQuery('/api/tags/search', { q, lang, limit }),
      { auth: false },
    );
  },

  listTagsByIds(ids: number[], lang?: string) {
    if (ids.length === 0) return Promise.resolve([] as LocalizedTaxonomyDto[]);
    return apiRequest<LocalizedTaxonomyDto[]>(
      base(),
      withQuery('/api/tags/by-ids', { ids: ids.join(','), lang }),
      { auth: false },
    );
  },

  listTagsAdmin(params?: { lang?: string; page?: number; size?: number; q?: string }) {
    return apiRequest<PageResult<LocalizedTaxonomyDto>>(
      base(),
      withQuery('/api/tags/admin', {
        lang: params?.lang,
        page: params?.page ?? 0,
        size: params?.size ?? 10,
        q: params?.q,
      }),
      { auth: false },
    );
  },

  createTag(body: {
    languageCode?: string;
    name: string;
    slug?: string;
    dbDescription?: string;
  }) {
    return apiRequest<LocalizedTaxonomyDto>(base(), '/api/tags', { method: 'POST', body });
  },

  updateTag(
    id: number,
    body: { languageCode?: string; name?: string; slug?: string; dbDescription?: string },
  ) {
    return apiRequest<LocalizedTaxonomyDto>(base(), `/api/tags/${id}`, { method: 'PUT', body });
  },

  deleteTag(id: number) {
    return apiRequest<void>(base(), `/api/tags/${id}`, { method: 'DELETE' });
  },

  listComments(params?: { postId?: string; status?: string }) {
    return apiRequest<CommentDto[]>(base(), withQuery('/api/comments', params), { auth: false });
  },

  createComment(body: {
    postId: string;
    userId?: string;
    parentCommentId?: string | null;
    content: string;
    languageCode?: string;
    status?: string;
  }) {
    return apiRequest<CommentDto>(base(), '/api/comments', { method: 'POST', body });
  },

  updateComment(id: string, body: { content: string; languageCode?: string }) {
    return apiRequest<CommentDto>(base(), `/api/comments/${id}`, { method: 'PUT', body });
  },

  getCommentTranslation(id: string, lang: string) {
    return apiRequest<CommentTranslationDto>(base(), `/api/comments/${id}/translations/${lang}`, {
      auth: false,
    });
  },

  setCommentStatus(id: string, status: string) {
    return apiRequest<CommentDto>(base(), `/api/comments/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  },

  deleteComment(id: string) {
    return apiRequest<void>(base(), `/api/comments/${id}`, { method: 'DELETE' });
  },

  getSettings(lang?: string) {
    return apiRequest<SiteSettings>(base(), withQuery('/api/settings', { lang }), { auth: false });
  },

  updateSettings(body: SiteSettings, lang?: string) {
    return apiRequest<SiteSettings>(base(), withQuery('/api/settings', { lang }), {
      method: 'PUT',
      body,
    });
  },

  listUiStrings(params?: { lang?: string; component?: string }) {
    return apiRequest<UiStringDto[]>(base(), withQuery('/api/ui-strings', params), { auth: false });
  },

  patchUiStrings(
    items: Array<{ stringKey: string; languageCode: string; stringValue: string }>,
  ) {
    return apiRequest<UiStringDto[]>(base(), '/api/ui-strings', {
      method: 'PATCH',
      body: { items },
    });
  },
};
