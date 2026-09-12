import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  mapCategory,
  mapComment,
  mapContentType,
  mapLocalizedPost,
  mapMetadata,
  mapSiteSettings,
  mapTag,
  mapUiString,
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
import type {
  Category,
  CategoryI18nInput,
  LocalizedCategory,
  LocalizedTag,
  Tag,
  TagI18nInput,
} from '../types/taxonomy';
import type { User, UserInput } from '../types/user';
import type { ParamUiStringI18n } from '../types/paramUi';
import type { Permission, Role } from '../types/rbac';
import { useAuth } from './AuthContext';
import { useLocale } from './LocaleContext';

interface ContentContextValue {
  data: CMSData;
  language: LanguageCode;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;

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

  categories: Category[];
  getLocalizedCategories: (lang?: LanguageCode) => LocalizedCategory[];
  createCategory: (translation: Omit<CategoryI18nInput, 'categoryId'>) => Promise<LocalizedCategory>;
  updateCategory: (
    id: number,
    translation: Partial<Omit<CategoryI18nInput, 'categoryId' | 'languageCode'>> & {
      languageCode?: LanguageCode;
    },
  ) => Promise<LocalizedCategory | undefined>;
  deleteCategory: (id: number) => Promise<void>;

  tags: Tag[];
  getLocalizedTags: (lang?: LanguageCode) => LocalizedTag[];
  createTag: (translation: Omit<TagI18nInput, 'tagId'>) => Promise<LocalizedTag>;
  updateTag: (
    id: number,
    translation: Partial<Omit<TagI18nInput, 'tagId' | 'languageCode'>> & {
      languageCode?: LanguageCode;
    },
  ) => Promise<LocalizedTag | undefined>;
  deleteTag: (id: number) => Promise<void>;

  comments: Comment[];
  getCommentsByPost: (postId: string) => Comment[];
  createComment: (input: CommentInput) => Promise<Comment>;
  setCommentStatus: (id: string, status: CommentStatus) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;

  users: User[];
  getUser: (id: string) => User | undefined;
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

const CONTENT_TYPE_SLUGS: ContentTypeSlug[] = ['post', 'page', 'service', 'product'];

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localizedPosts, setLocalizedPosts] = useState<LocalizedPost[]>([]);
  const [localizedLessons, setLocalizedLessons] = useState<LocalizedCourseLesson[]>([]);
  const [localizedCategories, setLocalizedCategories] = useState<LocalizedCategory[]>([]);
  const [localizedTags, setLocalizedTags] = useState<LocalizedTag[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [postMetadata, setPostMetadata] = useState<PostMetadata[]>([]);
  const [contentTypes, setContentTypes] = useState<CMSData['contentTypes']>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(emptyData().settings);
  const [paramUiStringI18n, setParamUiStringI18n] = useState<ParamUiStringI18n[]>([]);

  const courseTypeId = useMemo(
    () => contentTypes.find((t) => t.slug === 'course')?.id,
    [contentTypes],
  );

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [types, settingsRes, uiStrings, categoriesRes, tagsRes, commentsRes] =
        await Promise.all([
          contentApi.listContentTypes(),
          contentApi.getSettings(language),
          contentApi.listUiStrings({ lang: language }),
          contentApi.listCategories(language),
          contentApi.listTags(language),
          contentApi.listComments(),
        ]);

      const mappedTypes = types.map(mapContentType);
      setContentTypes(mappedTypes);
      setSettings(mapSiteSettings(settingsRes));
      setParamUiStringI18n(uiStrings.map(mapUiString));
      setLocalizedCategories(categoriesRes.map(mapCategory));
      setLocalizedTags(tagsRes.map(mapTag));
      setComments(commentsRes.map(mapComment));

      const postPages = await Promise.all(
        CONTENT_TYPE_SLUGS.map((type) =>
          contentApi.listPosts({ type, lang: language, page: 0, size: 100 }),
        ),
      );
      const contentPosts = postPages.flatMap((page) => page.items.map(mapLocalizedPost));

      const courses = (await coursesApi.listCourses({ lang: language })).map(mapLocalizedCourse);
      const allPosts = [...contentPosts, ...courses];
      setLocalizedPosts(allPosts);

      const lessonGroups = await Promise.all(
        courses.map(async (course) => {
          try {
            const lessons = await coursesApi.listLessons(course.id, language);
            return lessons.map(mapLocalizedLesson);
          } catch {
            return [] as LocalizedCourseLesson[];
          }
        }),
      );
      setLocalizedLessons(lessonGroups.flat());

      const metadataGroups = await Promise.all(
        allPosts.map(async (post) => {
          try {
            const isCourse = mappedTypes.find((t) => t.id === post.contentTypeId)?.slug === 'course'
              || post.contentTypeId === mappedTypes.find((t) => t.slug === 'course')?.id;
            if (isCourse || courses.some((c) => c.id === post.id)) {
              return (await coursesApi.getMetadata(post.id)).map(mapCourseMetadata);
            }
            return (await contentApi.getMetadata(post.id)).map(mapMetadata);
          } catch {
            return [] as PostMetadata[];
          }
        }),
      );
      setPostMetadata(metadataGroups.flat());

      if (token) {
        try {
          const [usersRes, rolesRes, permissionsRes] = await Promise.all([
            authApi.listUsers(),
            authApi.listRoles(),
            authApi.listPermissions(),
          ]);
          setUsers(usersRes.map(mapAuthUser));
          setRoles(rolesRes.map(mapRoleDto));
          setPermissions(permissionsRes.map(mapPermissionDto));
        } catch {
          setUsers([]);
          setRoles([]);
          setPermissions([]);
        }
      } else {
        setUsers([]);
        setRoles([]);
        setPermissions([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content from API');
    } finally {
      setLoading(false);
    }
  }, [language, token]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

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
    const categories = localizedCategories.map((c) => ({
      id: c.id,
      dbDescription: c.dbDescription,
    }));
    const categoryI18n = localizedCategories.map((c, index) => ({
      id: index + 1,
      categoryId: c.id,
      languageCode: c.languageCode,
      name: c.name,
      slug: c.slug,
    }));
    const tags = localizedTags.map((t) => ({
      id: t.id,
      dbDescription: t.dbDescription,
    }));
    const tagI18n = localizedTags.map((t, index) => ({
      id: index + 1,
      tagId: t.id,
      languageCode: t.languageCode,
      name: t.name,
      slug: t.slug,
    }));

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
    localizedCategories,
    localizedTags,
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
    await coursesApi.deleteLessonById(id);
    setLocalizedLessons((prev) =>
      prev.filter((l) => l.id !== id && l.parentLessonId !== id),
    );
  }, []);

  const getLocalizedCategories = useCallback(
    (_lang?: LanguageCode) => localizedCategories,
    [localizedCategories],
  );

  const createCategory = useCallback(
    async (translation: Omit<CategoryI18nInput, 'categoryId'>): Promise<LocalizedCategory> => {
      const created = mapCategory(
        await contentApi.createCategory({
          languageCode: translation.languageCode,
          name: translation.name,
          slug: translation.slug,
          dbDescription: translation.name,
        }),
      );
      setLocalizedCategories((prev) => [...prev, created]);
      return created;
    },
    [],
  );

  const updateCategory = useCallback(
    async (
      id: number,
      translation: Partial<Omit<CategoryI18nInput, 'categoryId' | 'languageCode'>> & {
        languageCode?: LanguageCode;
      },
    ): Promise<LocalizedCategory | undefined> => {
      const existing = localizedCategories.find((c) => c.id === id);
      if (!existing) return undefined;
      const updated = mapCategory(
        await contentApi.updateCategory(id, {
          languageCode: translation.languageCode ?? language,
          name: translation.name,
          slug: translation.slug,
          dbDescription: translation.name,
        }),
      );
      setLocalizedCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      return updated;
    },
    [localizedCategories, language],
  );

  const deleteCategory = useCallback(async (id: number) => {
    await contentApi.deleteCategory(id);
    setLocalizedCategories((prev) => prev.filter((c) => c.id !== id));
    setLocalizedPosts((prev) =>
      prev.map((p) => ({ ...p, categoryIds: p.categoryIds.filter((cid) => cid !== id) })),
    );
  }, []);

  const getLocalizedTags = useCallback(
    (_lang?: LanguageCode) => localizedTags,
    [localizedTags],
  );

  const createTag = useCallback(
    async (translation: Omit<TagI18nInput, 'tagId'>): Promise<LocalizedTag> => {
      const created = mapTag(
        await contentApi.createTag({
          languageCode: translation.languageCode,
          name: translation.name,
          slug: translation.slug,
          dbDescription: translation.name,
        }),
      );
      setLocalizedTags((prev) => [...prev, created]);
      return created;
    },
    [],
  );

  const updateTag = useCallback(
    async (
      id: number,
      translation: Partial<Omit<TagI18nInput, 'tagId' | 'languageCode'>> & {
        languageCode?: LanguageCode;
      },
    ): Promise<LocalizedTag | undefined> => {
      const existing = localizedTags.find((t) => t.id === id);
      if (!existing) return undefined;
      const updated = mapTag(
        await contentApi.updateTag(id, {
          languageCode: translation.languageCode ?? language,
          name: translation.name,
          slug: translation.slug,
          dbDescription: translation.name,
        }),
      );
      setLocalizedTags((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    },
    [localizedTags, language],
  );

  const deleteTag = useCallback(async (id: number) => {
    await contentApi.deleteTag(id);
    setLocalizedTags((prev) => prev.filter((t) => t.id !== id));
    setLocalizedPosts((prev) =>
      prev.map((p) => ({ ...p, tagIds: p.tagIds.filter((tid) => tid !== id) })),
    );
  }, []);

  const getCommentsByPost = useCallback(
    (postId: string) => comments.filter((c) => c.postId === postId),
    [comments],
  );

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
      error,
      refreshData,
      contentTypes,
      roles,
      permissions,
      posts: data.posts,
      postI18n: data.postI18n,
      getPost,
      getLocalizedPost,
      getLocalizedPostBySlug,
      getLocalizedPostsByType,
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
      getLocalizedLesson,
      getLocalizedLessonBySlug,
      createLesson,
      updateLesson,
      deleteLesson,
      categories: data.categories,
      getLocalizedCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      tags: data.tags,
      getLocalizedTags,
      createTag,
      updateTag,
      deleteTag,
      comments,
      getCommentsByPost,
      createComment,
      setCommentStatus,
      deleteComment,
      users,
      getUser,
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
      error,
      refreshData,
      contentTypes,
      roles,
      permissions,
      getPost,
      getLocalizedPost,
      getLocalizedPostBySlug,
      getLocalizedPostsByType,
      createPost,
      updatePost,
      deletePost,
      setPostStatus,
      incrementViewCount,
      postMetadata,
      getMetadataForPost,
      setMetadataForPost,
      getLocalizedLessonsByCourse,
      getLocalizedLesson,
      getLocalizedLessonBySlug,
      createLesson,
      updateLesson,
      deleteLesson,
      getLocalizedCategories,
      createCategory,
      updateCategory,
      deleteCategory,
      getLocalizedTags,
      createTag,
      updateTag,
      deleteTag,
      comments,
      getCommentsByPost,
      createComment,
      setCommentStatus,
      deleteComment,
      users,
      getUser,
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
