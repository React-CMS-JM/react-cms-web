import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  authApi,
  mapAuthUser,
  mapPermissionDto,
  mapRoleDto,
} from '../services/authApi';
import {
  contentApi,
  mapComment,
  mapLocalizedPost,
  mapMetadata,
  mapSiteSettings,
  mapUiString,
  type PageResult,
} from '../services/contentApi';
import {
  coursesApi,
  mapCourseMetadata,
  mapLocalizedCourse,
  mapLocalizedLesson,
} from '../services/coursesApi';
import type { CMSData } from '../types/cms';
import type { Comment, CommentInput, CommentStatus } from '../types/comment';
import type {
  ContentTypeSlug,
  CourseLesson,
  CourseLessonI18nInput,
  CourseLessonInput,
  LanguageCode,
  LocalizedCourseLesson,
  LocalizedPost,
  Post,
  PostI18nInput,
  PostInput,
  PostMetadata,
} from '../types/content';
import type { SiteSettings } from '../types/settings';
import { DEFAULT_SETTINGS, resolveHomeHero } from '../types/settings';
import type { User, UserInput } from '../types/user';
import type { ParamUiStringI18n } from '../types/paramUi';
import type { Permission, Role } from '../types/rbac';
import { useAuth } from './AuthContext';
import { useLocale } from './LocaleContext';
import { queryClient } from '../lib/queryClient';
import {
  STALE,
  fetchContentTypes,
  fetchPublicUiStrings,
  fetchSettings,
  publicKeys,
} from '../lib/publicQueries';

const ADMIN_UI_COMPONENT = 'AdminSidebar';

function mergeUiStringRows(
  current: ParamUiStringI18n[] | undefined,
  rows: ParamUiStringI18n[],
): ParamUiStringI18n[] {
  const next = [...(current ?? [])];
  for (const row of rows) {
    const index = next.findIndex(
      (item) => item.stringKey === row.stringKey && item.languageCode === row.languageCode,
    );
    if (index === -1) next.push(row);
    else next[index] = row;
  }
  return next;
}

interface ContentContextValue {
  data: CMSData;
  language: LanguageCode;
  loading: boolean;
  hasLoaded: boolean;
  isInitialLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  /** Language whose AdminSidebar strings are in cache; null until the admin shell loads them. */
  adminUiLanguage: LanguageCode | null;
  /** Fetches AdminSidebar UI strings. Call only from the admin shell. */
  loadAdminUiStrings: () => Promise<void>;

  contentTypes: CMSData['contentTypes'];
  roles: CMSData['roles'];
  permissions: CMSData['permissions'];

  posts: Post[];
  postI18n: CMSData['postI18n'];
  getPost: (id: string) => Post | undefined;
  getLocalizedPost: (id: string, lang?: LanguageCode) => LocalizedPost | undefined;
  getLocalizedPostBySlug: (
    slug: string,
    typeSlug?: ContentTypeSlug,
    lang?: LanguageCode,
  ) => LocalizedPost | undefined;
  getLocalizedPostsByType: (typeSlug: ContentTypeSlug, lang?: LanguageCode) => LocalizedPost[];
  /** Fetches a page of posts (or pages/services/products) and merges into cache. */
  fetchPostsPage: (
    typeSlug: Exclude<ContentTypeSlug, 'course'>,
    page: number,
    size: number,
    status?: string,
  ) => Promise<PageResult<LocalizedPost>>;
  /** Fetches a page of courses and merges into cache. */
  fetchCoursesPage: (
    page: number,
    size: number,
    status?: string,
  ) => Promise<PageResult<LocalizedPost>>;
  /** Loads up to 100 items of a type for admin catalogs (no-op if already loaded). */
  ensureTypeCatalog: (typeSlug: ContentTypeSlug) => Promise<void>;
  /** Loads a single post/course by slug when missing from cache. */
  ensurePostBySlug: (
    slug: string,
    typeSlug?: ContentTypeSlug,
  ) => Promise<LocalizedPost | undefined>;
  createPost: (
    input: PostInput,
    translation: Omit<PostI18nInput, 'postId'>,
  ) => Promise<LocalizedPost>;
  updatePost: (
    id: string,
    input?: Partial<PostInput>,
    translation?: Partial<Omit<PostI18nInput, 'postId' | 'languageCode'>> & {
      languageCode?: LanguageCode;
    },
  ) => Promise<LocalizedPost | undefined>;
  deletePost: (id: string) => Promise<void>;
  setPostStatus: (id: string, status: Post['status']) => Promise<void>;
  incrementViewCount: (id: string) => Promise<void>;

  postMetadata: PostMetadata[];
  getMetadataForPost: (postId: string) => PostMetadata[];
  setMetadataForPost: (
    postId: string,
    entries: { metaKey: string; metaValue: string }[],
  ) => Promise<void>;

  courseLessons: CourseLesson[];
  getLocalizedLessonsByCourse: (courseId: string, lang?: LanguageCode) => LocalizedCourseLesson[];
  /** Loads lessons for a course once (no-op if already loaded). Use on course/lesson pages. */
  ensureLessonsLoaded: (courseId: string) => Promise<void>;
  getLocalizedLesson: (id: string, lang?: LanguageCode) => LocalizedCourseLesson | undefined;
  getLocalizedLessonBySlug: (
    courseId: string,
    slug: string,
    lang?: LanguageCode,
  ) => LocalizedCourseLesson | undefined;
  createLesson: (
    input: CourseLessonInput,
    translation: Omit<CourseLessonI18nInput, 'courseLessonId'>,
  ) => Promise<LocalizedCourseLesson>;
  updateLesson: (
    id: string,
    input?: Partial<CourseLessonInput>,
    translation?: Partial<Omit<CourseLessonI18nInput, 'courseLessonId' | 'languageCode'>> & {
      languageCode?: LanguageCode;
    },
  ) => Promise<LocalizedCourseLesson | undefined>;
  deleteLesson: (id: string) => Promise<void>;

  comments: Comment[];
  getCommentsByPost: (postId: string) => Comment[];
  /** Loads all comments once (admin moderation / dashboard). */
  ensureCommentsLoaded: () => Promise<void>;
  /** Loads comments for one post (public CommentsSection). */
  ensureCommentsForPost: (postId: string) => Promise<void>;
  createComment: (input: CommentInput) => Promise<Comment>;
  setCommentStatus: (id: string, status: CommentStatus) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;

  users: User[];
  getUser: (id: string) => User | undefined;
  /** Loads users for the Users admin page. */
  loadUsersAdmin: () => Promise<void>;
  /** Loads roles + permissions for the Roles & Permissions admin page (only place that fetches /api/roles). */
  loadRolesAdmin: () => Promise<void>;
  createUser: (input: UserInput & { password?: string }) => Promise<User>;
  updateUser: (id: string, input: Partial<UserInput & { password?: string }>) => Promise<User | undefined>;
  banUser: (id: string, reason: string) => Promise<void>;
  unbanUser: (id: string) => Promise<void>;

  settings: SiteSettings;
  updateSettings: (
    settings: SiteSettings,
    uiStringUpdates?: Array<{
      stringKey: string;
      languageCode: LanguageCode;
      stringValue: string;
    }>,
  ) => Promise<void>;
  updateParamUiString: (
    stringKey: string,
    languageCode: LanguageCode,
    stringValue: string,
  ) => Promise<ParamUiStringI18n | undefined>;
  /** @deprecated Prefer refreshData — reloads from microservices. */
  resetData: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

const ADMIN_CATALOG_SIZE = 100;

function emptyData(): CMSData {
  return {
    users: [],
    roles: [],
    permissions: [],
    contentTypes: [],
    posts: [],
    postI18n: [],
    postMetadata: [],
    courseLessons: [],
    courseLessonI18n: [],
    categories: [],
    categoryI18n: [],
    tags: [],
    tagI18n: [],
    comments: [],
    paramUiStrings: [],
    paramUiStringI18n: [],
    settings: {
      ...DEFAULT_SETTINGS,
      homeHero: resolveHomeHero(null),
      homeSections: DEFAULT_SETTINGS.homeSections.map((s) => ({ ...s })),
      mainMenu: DEFAULT_SETTINGS.mainMenu.map((m) => ({ ...m })),
    },
  };
}

function toPost(localized: LocalizedPost): Post {
  return {
    id: localized.id,
    authorId: localized.authorId,
    contentTypeId: localized.contentTypeId,
    featuredImageUrl: localized.featuredImageUrl,
    accessLevel: localized.accessLevel,
    status: localized.status,
    viewCount: localized.viewCount,
    publishedAt: localized.publishedAt,
    categoryIds: localized.categoryIds,
    tagIds: localized.tagIds,
    createdAt: localized.createdAt,
    updatedAt: localized.updatedAt,
  };
}

function toLesson(localized: LocalizedCourseLesson): CourseLesson {
  return {
    id: localized.id,
    courseId: localized.courseId,
    parentLessonId: localized.parentLessonId,
    sortOrder: localized.sortOrder,
    accessLevel: localized.accessLevel,
    createdAt: localized.createdAt,
    updatedAt: localized.updatedAt,
  };
}

function upsertLocalizedPost(list: LocalizedPost[], next: LocalizedPost): LocalizedPost[] {
  const index = list.findIndex((p) => p.id === next.id);
  if (index === -1) return [...list, next];
  const copy = [...list];
  copy[index] = next;
  return copy;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const { language } = useLocale();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const isInitialLoading = loading && !hasLoaded;
  const [error, setError] = useState<string | null>(null);
  const [localizedPosts, setLocalizedPosts] = useState<LocalizedPost[]>([]);
  const [localizedLessons, setLocalizedLessons] = useState<LocalizedCourseLesson[]>([]);
  const lessonsLoadedRef = useRef(new Set<string>());
  const lessonsLoadingRef = useRef(new Map<string, Promise<void>>());
  const [comments, setComments] = useState<Comment[]>([]);
  const commentsFullyLoadedRef = useRef(false);
  const commentsLoadingRef = useRef<Promise<void> | null>(null);
  const commentsLoadedByPostRef = useRef(new Set<string>());
  const commentsLoadingByPostRef = useRef(new Map<string, Promise<void>>());
  const [postMetadata, setPostMetadata] = useState<PostMetadata[]>([]);
  const [contentTypes, setContentTypes] = useState<CMSData['contentTypes']>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const usersAdminLoadingRef = useRef<Promise<void> | null>(null);
  const rolesAdminLoadingRef = useRef<Promise<void> | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(emptyData().settings);
  const [paramUiStringI18n, setParamUiStringI18n] = useState<ParamUiStringI18n[]>([]);
  const [adminUiLanguage, setAdminUiLanguage] = useState<LanguageCode | null>(null);
  const adminUiLoadedLangRef = useRef<string | null>(null);
  const adminUiLoadingRef = useRef<Promise<void> | null>(null);
  const languageRef = useRef(language);
  languageRef.current = language;
  const typeCatalogLoadedRef = useRef(new Set<string>());
  const typeCatalogLoadingRef = useRef(new Map<string, Promise<void>>());
  const slugLoadingRef = useRef(new Map<string, Promise<LocalizedPost | undefined>>());

  const courseTypeId = useMemo(
    () => contentTypes.find((t) => t.slug === 'course')?.id,
    [contentTypes],
  );

  const ingestPosts = useCallback((posts: LocalizedPost[], metadata: PostMetadata[]) => {
    if (posts.length === 0) return;
    setLocalizedPosts((prev) => {
      let next = prev;
      for (const post of posts) {
        next = upsertLocalizedPost(next, post);
      }
      return next;
    });
    const postIds = new Set(posts.map((p) => p.id));
    setPostMetadata((prev) => [
      ...prev.filter((m) => !postIds.has(m.postId)),
      ...metadata,
    ]);
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      adminUiLoadedLangRef.current = null;
      setAdminUiLanguage(null);

      const [types, settingsRes, publicUiStrings] = await Promise.all([
        queryClient.fetchQuery({
          queryKey: publicKeys.contentTypes(),
          queryFn: fetchContentTypes,
          staleTime: STALE.contentTypes,
        }),
        queryClient.fetchQuery({
          queryKey: publicKeys.settings(language),
          queryFn: () => fetchSettings(language),
          staleTime: STALE.settings,
        }),
        queryClient.fetchQuery({
          queryKey: publicKeys.uiStrings(language),
          queryFn: () => fetchPublicUiStrings(language),
          staleTime: STALE.uiStrings,
        }),
      ]);

      setContentTypes(types);
      setSettings(settingsRes);
      setParamUiStringI18n(publicUiStrings);
      setComments([]);
      commentsFullyLoadedRef.current = false;
      commentsLoadingRef.current = null;
      commentsLoadedByPostRef.current.clear();
      commentsLoadingByPostRef.current.clear();
      typeCatalogLoadedRef.current.clear();
      typeCatalogLoadingRef.current.clear();
      slugLoadingRef.current.clear();

      // Pages at bootstrap for public nav. Admin content catalogs load on demand via ensureTypeCatalog.
      const pagesRes = await contentApi.listPosts({
        type: 'page',
        lang: language,
        page: 0,
        size: ADMIN_CATALOG_SIZE,
      });
      const pagePosts = pagesRes.items.map(mapLocalizedPost);
      const pageMetadata = pagesRes.items.flatMap((dto) =>
        (dto.metadata ?? []).map(mapMetadata),
      );

      typeCatalogLoadedRef.current.add(`page:${language}`);
      setLocalizedPosts(pagePosts);
      setPostMetadata(pageMetadata);
      setLocalizedLessons([]);
      lessonsLoadedRef.current.clear();
      lessonsLoadingRef.current.clear();

      // Users / roles / permissions load only on their admin pages.
      setUsers([]);
      setRoles([]);
      setPermissions([]);
      usersAdminLoadingRef.current = null;
      rolesAdminLoadingRef.current = null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content from API');
    } finally {
      setHasLoaded(true);
      setLoading(false);
    }
  }, [language]);

  const loadAdminUiStrings = useCallback(async () => {
    if (adminUiLoadedLangRef.current === language) return;
    if (adminUiLoadingRef.current) {
      await adminUiLoadingRef.current;
      if (adminUiLoadedLangRef.current === language) return;
    }

    const requested = language;
    const load = (async () => {
      try {
        const rows = await contentApi.listUiStrings({
          lang: requested,
          component: ADMIN_UI_COMPONENT,
        });
        if (languageRef.current !== requested) return;
        const mapped = rows.map(mapUiString);
        setParamUiStringI18n((prev) => {
          const incoming = new Set(mapped.map((row) => `${row.stringKey}:${row.languageCode}`));
          return [
            ...prev.filter((row) => !incoming.has(`${row.stringKey}:${row.languageCode}`)),
            ...mapped,
          ];
        });
      } catch {
        // Sidebar falls back to the raw string key.
      } finally {
        if (languageRef.current === requested) {
          adminUiLoadedLangRef.current = requested;
          setAdminUiLanguage(requested);
        }
        adminUiLoadingRef.current = null;
      }
    })();

    adminUiLoadingRef.current = load;
    await load;
  }, [language]);

  useEffect(() => {
    // Drop cached users/roles when the session changes; admin pages reload on next visit.
    usersAdminLoadingRef.current = null;
    rolesAdminLoadingRef.current = null;
    if (!token) {
      setUsers([]);
      setRoles([]);
      setPermissions([]);
      setComments([]);
      commentsFullyLoadedRef.current = false;
      commentsLoadingRef.current = null;
      commentsLoadedByPostRef.current.clear();
      commentsLoadingByPostRef.current.clear();
    }
  }, [token]);

  const data = useMemo<CMSData>(() => {
    const posts = localizedPosts.map(toPost);
    const postI18n = localizedPosts.map((p, index) => ({
      id: index + 1,
      postId: p.id,
      languageCode: p.languageCode,
      title: p.title,
      slug: p.slug,
      content: p.content,
      excerpt: p.excerpt,
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));
    const courseLessons = localizedLessons.map(toLesson);
    const courseLessonI18n = localizedLessons.map((l, index) => ({
      id: index + 1,
      courseLessonId: l.id,
      languageCode: l.languageCode,
      title: l.title,
      slug: l.slug,
      content: l.content,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    }));
    const categories: CMSData['categories'] = [];
    const categoryI18n: CMSData['categoryI18n'] = [];
    const tags: CMSData['tags'] = [];
    const tagI18n: CMSData['tagI18n'] = [];

    return {
      users,
      roles,
      permissions,
      contentTypes,
      posts,
      postI18n,
      postMetadata,
      courseLessons,
      courseLessonI18n,
      categories,
      categoryI18n,
      tags,
      tagI18n,
      comments,
      paramUiStrings: [],
      paramUiStringI18n,
      settings,
    };
  }, [
    localizedPosts,
    localizedLessons,
    comments,
    postMetadata,
    users,
    roles,
    permissions,
    contentTypes,
    paramUiStringI18n,
    settings,
  ]);

  const isCourseId = useCallback(
    (id: string) => {
      const post = localizedPosts.find((p) => p.id === id);
      if (!post) return false;
      if (courseTypeId != null && post.contentTypeId === courseTypeId) return true;
      return contentTypes.find((t) => t.id === post.contentTypeId)?.slug === 'course';
    },
    [localizedPosts, courseTypeId, contentTypes],
  );

  const getPost = useCallback(
    (id: string) => {
      const localized = localizedPosts.find((p) => p.id === id);
      return localized ? toPost(localized) : undefined;
    },
    [localizedPosts],
  );

  const getLocalizedPost = useCallback(
    (id: string, _lang?: LanguageCode) => localizedPosts.find((p) => p.id === id),
    [localizedPosts],
  );

  const getLocalizedPostBySlug = useCallback(
    (slug: string, typeSlug?: ContentTypeSlug, _lang?: LanguageCode) => {
      const type = typeSlug ? contentTypes.find((t) => t.slug === typeSlug) : undefined;
      return localizedPosts.find(
        (p) => p.slug === slug && (!type || p.contentTypeId === type.id),
      );
    },
    [localizedPosts, contentTypes],
  );

  const getLocalizedPostsByType = useCallback(
    (typeSlug: ContentTypeSlug, _lang?: LanguageCode) => {
      const type = contentTypes.find((t) => t.slug === typeSlug);
      if (!type) return [];
      return localizedPosts.filter((p) => p.contentTypeId === type.id);
    },
    [localizedPosts, contentTypes],
  );

  const fetchPostsPage = useCallback(
    async (
      typeSlug: Exclude<ContentTypeSlug, 'course'>,
      page: number,
      size: number,
      status?: string,
    ): Promise<PageResult<LocalizedPost>> => {
      const result = await contentApi.listPosts({
        type: typeSlug,
        lang: language,
        page,
        size,
        status,
      });
      const items = result.items.map(mapLocalizedPost);
      const metadata = result.items.flatMap((dto) => (dto.metadata ?? []).map(mapMetadata));
      ingestPosts(items, metadata);
      return { items, page: result.page, size: result.size, total: result.total };
    },
    [language, ingestPosts],
  );

  const fetchCoursesPage = useCallback(
    async (
      page: number,
      size: number,
      status?: string,
    ): Promise<PageResult<LocalizedPost>> => {
      const result = await coursesApi.listCourses({
        lang: language,
        page,
        size,
        status,
      });
      const items = result.items.map(mapLocalizedCourse);
      const metadata = result.items.flatMap((dto) =>
        (dto.metadata ?? []).map(mapCourseMetadata),
      );
      ingestPosts(items, metadata);
      return { items, page: result.page, size: result.size, total: result.total };
    },
    [language, ingestPosts],
  );

  const ensureTypeCatalog = useCallback(
    async (typeSlug: ContentTypeSlug) => {
      const key = `${typeSlug}:${language}`;
      if (typeCatalogLoadedRef.current.has(key)) return;
      const inflight = typeCatalogLoadingRef.current.get(key);
      if (inflight) {
        await inflight;
        return;
      }

      const load = (async () => {
        try {
          if (typeSlug === 'course') {
            await fetchCoursesPage(0, ADMIN_CATALOG_SIZE);
          } else {
            await fetchPostsPage(typeSlug, 0, ADMIN_CATALOG_SIZE);
          }
          typeCatalogLoadedRef.current.add(key);
        } catch {
          // Leave unloaded so a later navigation can retry.
        } finally {
          typeCatalogLoadingRef.current.delete(key);
        }
      })();

      typeCatalogLoadingRef.current.set(key, load);
      await load;
    },
    [language, fetchPostsPage, fetchCoursesPage],
  );

  const ensurePostBySlug = useCallback(
    async (slug: string, typeSlug?: ContentTypeSlug): Promise<LocalizedPost | undefined> => {
      if (!slug) return undefined;
      const existing = getLocalizedPostBySlug(slug, typeSlug);
      if (existing) return existing;

      const key = `${typeSlug ?? 'any'}:${slug}:${language}`;
      const inflight = slugLoadingRef.current.get(key);
      if (inflight) return inflight;

      const load = (async () => {
        try {
          if (typeSlug === 'course') {
            const dto = await coursesApi.getCourseBySlug(slug, language);
            const mapped = mapLocalizedCourse(dto);
            const metadata = (dto.metadata ?? []).map(mapCourseMetadata);
            ingestPosts([mapped], metadata);
            return mapped;
          }
          const dto = await contentApi.getPostBySlug(slug, typeSlug, language);
          const mapped = mapLocalizedPost(dto);
          const metadata = (dto.metadata ?? []).map(mapMetadata);
          ingestPosts([mapped], metadata);
          return mapped;
        } catch {
          return undefined;
        } finally {
          slugLoadingRef.current.delete(key);
        }
      })();

      slugLoadingRef.current.set(key, load);
      return load;
    },
    [getLocalizedPostBySlug, language, ingestPosts],
  );

  const createPost = useCallback(
    async (
      input: PostInput,
      translation: Omit<PostI18nInput, 'postId'>,
    ): Promise<LocalizedPost> => {
      const type = contentTypes.find((t) => t.id === input.contentTypeId);
      if (type?.slug === 'course') {
        const created = mapLocalizedCourse(
          await coursesApi.createCourse({
            authorId: input.authorId,
            featuredImageUrl: input.featuredImageUrl || undefined,
            accessLevel: input.accessLevel,
            status: input.status,
            translation: {
              languageCode: translation.languageCode,
              title: translation.title,
              slug: translation.slug,
              content: translation.content,
              excerpt: translation.excerpt,
              metaTitle: translation.metaTitle,
              metaDescription: translation.metaDescription,
            },
          }),
        );
        setLocalizedPosts((prev) => upsertLocalizedPost(prev, created));
        return created;
      }

      const created = mapLocalizedPost(
        await contentApi.createPost({
          authorId: input.authorId,
          contentTypeId: input.contentTypeId,
          featuredImageUrl: input.featuredImageUrl || undefined,
          accessLevel: input.accessLevel,
          status: input.status,
          categoryIds: input.categoryIds,
          tagIds: input.tagIds,
          languageCode: translation.languageCode,
          title: translation.title,
          slug: translation.slug,
          content: translation.content,
          excerpt: translation.excerpt,
          metaTitle: translation.metaTitle,
          metaDescription: translation.metaDescription,
        }),
      );
      setLocalizedPosts((prev) => upsertLocalizedPost(prev, created));
      return created;
    },
    [contentTypes],
  );

  const updatePost = useCallback(
    async (
      id: string,
      input?: Partial<PostInput>,
      translation?: Partial<Omit<PostI18nInput, 'postId' | 'languageCode'>> & {
        languageCode?: LanguageCode;
      },
    ): Promise<LocalizedPost | undefined> => {
      const existing = localizedPosts.find((p) => p.id === id);
      if (!existing) return undefined;
      const lang = translation?.languageCode ?? language;

      if (isCourseId(id)) {
        const updated = mapLocalizedCourse(
          await coursesApi.updateCourse(
            id,
            {
              featuredImageUrl: input?.featuredImageUrl,
              accessLevel: input?.accessLevel,
              status: input?.status,
              translation: translation
                ? {
                    languageCode: lang,
                    title: translation.title ?? existing.title,
                    slug: translation.slug ?? existing.slug,
                    content: translation.content ?? existing.content,
                    excerpt: translation.excerpt ?? existing.excerpt,
                    metaTitle: translation.metaTitle ?? existing.metaTitle,
                    metaDescription: translation.metaDescription ?? existing.metaDescription,
                  }
                : undefined,
            },
            lang,
          ),
        );
        setLocalizedPosts((prev) => upsertLocalizedPost(prev, updated));
        return updated;
      }

      const updated = mapLocalizedPost(
        await contentApi.updatePost(id, {
          contentTypeId: input?.contentTypeId,
          featuredImageUrl: input?.featuredImageUrl,
          accessLevel: input?.accessLevel,
          status: input?.status,
          categoryIds: input?.categoryIds,
          tagIds: input?.tagIds,
          languageCode: lang,
          title: translation?.title,
          slug: translation?.slug,
          content: translation?.content,
          excerpt: translation?.excerpt,
          metaTitle: translation?.metaTitle,
          metaDescription: translation?.metaDescription,
        }),
      );
      setLocalizedPosts((prev) => upsertLocalizedPost(prev, updated));
      return updated;
    },
    [localizedPosts, language, isCourseId],
  );

  const deletePost = useCallback(
    async (id: string) => {
      if (isCourseId(id)) {
        await coursesApi.deleteCourse(id);
        setLocalizedLessons((prev) => prev.filter((l) => l.courseId !== id));
      } else {
        await contentApi.deletePost(id);
      }
      setLocalizedPosts((prev) => prev.filter((p) => p.id !== id));
      setComments((prev) => prev.filter((c) => c.postId !== id));
      setPostMetadata((prev) => prev.filter((m) => m.postId !== id));
    },
    [isCourseId],
  );

  const setPostStatus = useCallback(
    async (id: string, status: Post['status']) => {
      if (isCourseId(id)) {
        const updated = mapLocalizedCourse(await coursesApi.setCourseStatus(id, status, language));
        setLocalizedPosts((prev) => upsertLocalizedPost(prev, updated));
        return;
      }
      const updated = mapLocalizedPost(await contentApi.setPostStatus(id, status));
      setLocalizedPosts((prev) => upsertLocalizedPost(prev, updated));
    },
    [isCourseId, language],
  );

  const incrementViewCount = useCallback(
    async (id: string) => {
      if (isCourseId(id)) {
        setLocalizedPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p)),
        );
        return;
      }
      try {
        const updated = mapLocalizedPost(await contentApi.incrementView(id));
        setLocalizedPosts((prev) => upsertLocalizedPost(prev, updated));
      } catch {
        setLocalizedPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, viewCount: p.viewCount + 1 } : p)),
        );
      }
    },
    [isCourseId],
  );

  const getMetadataForPost = useCallback(
    (postId: string) => postMetadata.filter((m) => m.postId === postId),
    [postMetadata],
  );

  const setMetadataForPost = useCallback(
    async (postId: string, entries: { metaKey: string; metaValue: string }[]) => {
      const cleaned = entries.filter((e) => e.metaKey.trim());
      const next = isCourseId(postId)
        ? (await coursesApi.putMetadata(postId, cleaned)).map(mapCourseMetadata)
        : (await contentApi.putMetadata(postId, cleaned)).map(mapMetadata);
      setPostMetadata((prev) => [...prev.filter((m) => m.postId !== postId), ...next]);
    },
    [isCourseId],
  );

  const getLocalizedLessonsByCourse = useCallback(
    (courseId: string, _lang?: LanguageCode) =>
      [...localizedLessons]
        .filter((l) => l.courseId === courseId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [localizedLessons],
  );

  const ensureLessonsLoaded = useCallback(
    async (courseId: string) => {
      if (!courseId || lessonsLoadedRef.current.has(courseId)) return;
      const inflight = lessonsLoadingRef.current.get(courseId);
      if (inflight) {
        await inflight;
        return;
      }

      const load = (async () => {
        try {
          const lessons = (await coursesApi.listLessons(courseId, language)).map(mapLocalizedLesson);
          setLocalizedLessons((prev) => [
            ...prev.filter((l) => l.courseId !== courseId),
            ...lessons,
          ]);
          lessonsLoadedRef.current.add(courseId);
          setLocalizedPosts((prev) =>
            prev.map((p) => (p.id === courseId ? { ...p, lessonCount: lessons.length } : p)),
          );
        } catch {
          // Leave unloaded so a later navigation can retry.
        } finally {
          lessonsLoadingRef.current.delete(courseId);
        }
      })();

      lessonsLoadingRef.current.set(courseId, load);
      await load;
    },
    [language],
  );

  const getLocalizedLesson = useCallback(
    (id: string, _lang?: LanguageCode) => localizedLessons.find((l) => l.id === id),
    [localizedLessons],
  );

  const getLocalizedLessonBySlug = useCallback(
    (courseId: string, slug: string, _lang?: LanguageCode) =>
      localizedLessons.find((l) => l.courseId === courseId && l.slug === slug),
    [localizedLessons],
  );

  const createLesson = useCallback(
    async (
      input: CourseLessonInput,
      translation: Omit<CourseLessonI18nInput, 'courseLessonId'>,
    ): Promise<LocalizedCourseLesson> => {
      const created = mapLocalizedLesson(
        await coursesApi.createLesson(input.courseId, {
          parentLessonId: input.parentLessonId,
          sortOrder: input.sortOrder,
          accessLevel: input.accessLevel,
          translation: {
            languageCode: translation.languageCode,
            title: translation.title,
            slug: translation.slug,
            content: translation.content,
          },
        }),
      );
      setLocalizedLessons((prev) => [...prev, created]);
      lessonsLoadedRef.current.add(input.courseId);
      setLocalizedPosts((prev) =>
        prev.map((p) =>
          p.id === input.courseId ? { ...p, lessonCount: (p.lessonCount ?? 0) + 1 } : p,
        ),
      );
      return created;
    },
    [],
  );

  const updateLesson = useCallback(
    async (
      id: string,
      input?: Partial<CourseLessonInput>,
      translation?: Partial<Omit<CourseLessonI18nInput, 'courseLessonId' | 'languageCode'>> & {
        languageCode?: LanguageCode;
      },
    ): Promise<LocalizedCourseLesson | undefined> => {
      const existing = localizedLessons.find((l) => l.id === id);
      if (!existing) return undefined;
      const lang = translation?.languageCode ?? language;
      const updated = mapLocalizedLesson(
        await coursesApi.updateLesson(
          existing.courseId,
          id,
          {
            parentLessonId: input?.parentLessonId,
            sortOrder: input?.sortOrder,
            accessLevel: input?.accessLevel,
            translation: translation
              ? {
                  languageCode: lang,
                  title: translation.title ?? existing.title,
                  slug: translation.slug ?? existing.slug,
                  content: translation.content ?? existing.content,
                }
              : undefined,
          },
          lang,
        ),
      );
      setLocalizedLessons((prev) => {
        const index = prev.findIndex((l) => l.id === id);
        if (index === -1) return [...prev, updated];
        const copy = [...prev];
        copy[index] = updated;
        return copy;
      });
      return updated;
    },
    [localizedLessons, language],
  );

  const deleteLesson = useCallback(async (id: string) => {
    const existing = localizedLessons.find((l) => l.id === id);
    await coursesApi.deleteLessonById(id);
    setLocalizedLessons((prev) =>
      prev.filter((l) => l.id !== id && l.parentLessonId !== id),
    );
    if (existing) {
      setLocalizedPosts((prev) =>
        prev.map((p) =>
          p.id === existing.courseId
            ? { ...p, lessonCount: Math.max(0, (p.lessonCount ?? 1) - 1) }
            : p,
        ),
      );
    }
  }, [localizedLessons]);

  const getCommentsByPost = useCallback(
    (postId: string) => comments.filter((c) => c.postId === postId),
    [comments],
  );

  const ensureCommentsLoaded = useCallback(async () => {
    if (commentsFullyLoadedRef.current) return;
    if (commentsLoadingRef.current) {
      await commentsLoadingRef.current;
      return;
    }

    const load = (async () => {
      try {
        const rows = (await contentApi.listComments()).map(mapComment);
        setComments(rows);
        commentsFullyLoadedRef.current = true;
        commentsLoadedByPostRef.current = new Set(rows.map((c) => c.postId));
      } catch {
        // Leave unloaded so a later navigation can retry.
      } finally {
        commentsLoadingRef.current = null;
      }
    })();

    commentsLoadingRef.current = load;
    await load;
  }, []);

  /** Users admin page: user accounts only. */
  const loadUsersAdmin = useCallback(async () => {
    if (!token) {
      setUsers([]);
      return;
    }
    if (usersAdminLoadingRef.current) {
      await usersAdminLoadingRef.current;
      return;
    }

    const load = (async () => {
      try {
        const usersRes = await authApi.listUsers();
        setUsers(usersRes.map(mapAuthUser));
      } catch {
        setUsers([]);
      } finally {
        usersAdminLoadingRef.current = null;
      }
    })();

    usersAdminLoadingRef.current = load;
    await load;
  }, [token]);

  /** Roles & Permissions page: full roles catalog + permissions matrix. */
  const loadRolesAdmin = useCallback(async () => {
    if (!token) {
      setRoles([]);
      setPermissions([]);
      return;
    }
    if (rolesAdminLoadingRef.current) {
      await rolesAdminLoadingRef.current;
      return;
    }

    const load = (async () => {
      try {
        const [rolesRes, permissionsRes] = await Promise.all([
          authApi.listRoles(),
          authApi.listPermissions(),
        ]);
        setRoles(rolesRes.map(mapRoleDto));
        setPermissions(permissionsRes.map(mapPermissionDto));
      } catch {
        setRoles([]);
        setPermissions([]);
      } finally {
        rolesAdminLoadingRef.current = null;
      }
    })();

    rolesAdminLoadingRef.current = load;
    await load;
  }, [token]);

  const ensureCommentsForPost = useCallback(async (postId: string) => {
    if (!postId || commentsFullyLoadedRef.current || commentsLoadedByPostRef.current.has(postId)) {
      return;
    }
    const inflight = commentsLoadingByPostRef.current.get(postId);
    if (inflight) {
      await inflight;
      return;
    }

    const load = (async () => {
      try {
        const rows = (await contentApi.listComments({ postId })).map(mapComment);
        setComments((prev) => [...prev.filter((c) => c.postId !== postId), ...rows]);
        commentsLoadedByPostRef.current.add(postId);
      } catch {
        // Leave unloaded so a later navigation can retry.
      } finally {
        commentsLoadingByPostRef.current.delete(postId);
      }
    })();

    commentsLoadingByPostRef.current.set(postId, load);
    await load;
  }, []);

  const createComment = useCallback(async (input: CommentInput): Promise<Comment> => {
    const created = mapComment(
      await contentApi.createComment({
        postId: input.postId,
        userId: input.userId,
        parentCommentId: input.parentCommentId,
        content: input.content,
        languageCode: input.languageCode,
        status: input.status,
      }),
    );
    setComments((prev) => [...prev, created]);
    commentsLoadedByPostRef.current.add(input.postId);
    return created;
  }, []);

  const setCommentStatus = useCallback(async (id: string, status: CommentStatus) => {
    const updated = mapComment(await contentApi.setCommentStatus(id, status));
    setComments((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const deleteComment = useCallback(async (id: string) => {
    await contentApi.deleteComment(id);
    setComments((prev) => prev.filter((c) => c.id !== id && c.parentCommentId !== id));
  }, []);

  const getUser = useCallback((id: string) => users.find((u) => u.id === id), [users]);

  const createUser = useCallback(async (input: UserInput & { password?: string }): Promise<User> => {
    if (!input.password) throw new Error('password is required');
    const created = mapAuthUser(
      await authApi.createUser({
        email: input.email,
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
        roleIds: input.roleIds,
      }),
    );
    setUsers((prev) => [...prev, created]);
    return created;
  }, []);

  const updateUser = useCallback(
    async (
      id: string,
      input: Partial<UserInput & { password?: string }>,
    ): Promise<User | undefined> => {
      const existing = users.find((u) => u.id === id);
      if (!existing) return undefined;
      const updated = mapAuthUser(
        await authApi.updateUser(id, {
          email: input.email ?? existing.email,
          password: input.password,
          firstName: input.firstName ?? existing.firstName,
          lastName: input.lastName ?? existing.lastName,
          roleIds: input.roleIds ?? existing.roleIds,
        }),
      );
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    },
    [users],
  );

  const banUser = useCallback(async (id: string, reason: string) => {
    const updated = mapAuthUser(await authApi.banUser(id, reason));
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  }, []);

  const unbanUser = useCallback(async (id: string) => {
    const updated = mapAuthUser(await authApi.unbanUser(id));
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
  }, []);

  const updateSettings = useCallback(
    async (
      nextSettings: SiteSettings,
      uiStringUpdates?: Array<{
        stringKey: string;
        languageCode: LanguageCode;
        stringValue: string;
      }>,
    ) => {
      const saved = mapSiteSettings(await contentApi.updateSettings(nextSettings, language));
      setSettings(saved);
      queryClient.setQueryData(publicKeys.settings(language), saved);
      if (uiStringUpdates?.length) {
        const patched = await contentApi.patchUiStrings(uiStringUpdates);
        setParamUiStringI18n((prev) => {
          const next = [...prev];
          for (const row of patched.map(mapUiString)) {
            const index = next.findIndex(
              (r) => r.stringKey === row.stringKey && r.languageCode === row.languageCode,
            );
            if (index === -1) next.push(row);
            else next[index] = { ...row, id: next[index].id };
          }
          queryClient.setQueryData<ParamUiStringI18n[]>(publicKeys.uiStrings(language), (current) =>
            mergeUiStringRows(current, patched.map(mapUiString)),
          );
          return next;
        });
      }
    },
    [language],
  );

  const updateParamUiString = useCallback(
    async (
      stringKey: string,
      languageCode: LanguageCode,
      stringValue: string,
    ): Promise<ParamUiStringI18n | undefined> => {
      const patched = await contentApi.patchUiStrings([{ stringKey, languageCode, stringValue }]);
      const mapped = patched.map(mapUiString);
      queryClient.setQueryData<ParamUiStringI18n[]>(publicKeys.uiStrings(languageCode), (current) =>
        mergeUiStringRows(current, mapped),
      );
      setParamUiStringI18n((prev) => {
        const next = [...prev];
        for (const row of mapped) {
          const index = next.findIndex(
            (r) => r.stringKey === row.stringKey && r.languageCode === row.languageCode,
          );
          if (index === -1) next.push(row);
          else next[index] = { ...row, id: next[index].id };
        }
        return next;
      });
      return mapped[0];
    },
    [],
  );

  const resetData = useCallback(async () => {
    await refreshData();
  }, [refreshData]);

  const value = useMemo<ContentContextValue>(
    () => ({
      data,
      language,
      loading,
      hasLoaded,
      isInitialLoading,
      error,
      refreshData,
      adminUiLanguage,
      loadAdminUiStrings,
      contentTypes,
      roles,
      permissions,
      posts: data.posts,
      postI18n: data.postI18n,
      getPost,
      getLocalizedPost,
      getLocalizedPostBySlug,
      getLocalizedPostsByType,
      fetchPostsPage,
      fetchCoursesPage,
      ensureTypeCatalog,
      ensurePostBySlug,
      createPost,
      updatePost,
      deletePost,
      setPostStatus,
      incrementViewCount,
      postMetadata,
      getMetadataForPost,
      setMetadataForPost,
      courseLessons: data.courseLessons,
      getLocalizedLessonsByCourse,
      ensureLessonsLoaded,
      getLocalizedLesson,
      getLocalizedLessonBySlug,
      createLesson,
      updateLesson,
      deleteLesson,
      comments,
      getCommentsByPost,
      ensureCommentsLoaded,
      ensureCommentsForPost,
      createComment,
      setCommentStatus,
      deleteComment,
      users,
      getUser,
      loadUsersAdmin,
      loadRolesAdmin,
      createUser,
      updateUser,
      banUser,
      unbanUser,
      settings,
      updateSettings,
      updateParamUiString,
      resetData,
    }),
    [
      data,
      language,
      loading,
      hasLoaded,
      isInitialLoading,
      error,
      refreshData,
      adminUiLanguage,
      loadAdminUiStrings,
      contentTypes,
      roles,
      permissions,
      getPost,
      getLocalizedPost,
      getLocalizedPostBySlug,
      getLocalizedPostsByType,
      fetchPostsPage,
      fetchCoursesPage,
      ensureTypeCatalog,
      ensurePostBySlug,
      createPost,
      updatePost,
      deletePost,
      setPostStatus,
      incrementViewCount,
      postMetadata,
      getMetadataForPost,
      setMetadataForPost,
      getLocalizedLessonsByCourse,
      ensureLessonsLoaded,
      getLocalizedLesson,
      getLocalizedLessonBySlug,
      createLesson,
      updateLesson,
      deleteLesson,
      comments,
      getCommentsByPost,
      ensureCommentsLoaded,
      ensureCommentsForPost,
      createComment,
      setCommentStatus,
      deleteComment,
      users,
      getUser,
      loadUsersAdmin,
      loadRolesAdmin,
      createUser,
      updateUser,
      banUser,
      unbanUser,
      settings,
      updateSettings,
      updateParamUiString,
      resetData,
    ],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
