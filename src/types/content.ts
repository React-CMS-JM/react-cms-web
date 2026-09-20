/**
 * Mirrors `content_types`, `posts`, `post_i18n`, `post_metadata`,
 * `course_lessons`, and `course_lesson_i18n` from react-cms-create-tables-v02.sql.
 * Translatable text lives only in the `_i18n` sidecar tables.
 */
export type ContentTypeSlug = 'post' | 'page' | 'course' | 'service' | 'product';

export type LanguageCode = 'en' | 'es';

export const SUPPORTED_LANGUAGES: { code: LanguageCode; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export interface ContentType {
  id: number;
  name: string;
  slug: ContentTypeSlug;
  description: string;
}

export type AccessLevel = 'public' | 'premium';
export type PostStatus = 'draft' | 'published' | 'archived';

/** Non-translatable post row (`posts` table). */
export interface Post {
  id: string;
  authorId: string;
  contentTypeId: number;
  featuredImageUrl: string;
  accessLevel: AccessLevel;
  status: PostStatus;
  viewCount: number;
  publishedAt: string | null;
  categoryIds: number[];
  tagIds: number[];
  createdAt: string;
  updatedAt: string;
}

/** Translation sidecar (`post_i18n` table). */
export interface PostI18n {
  id: number;
  postId: string;
  languageCode: LanguageCode;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

/** Post merged with the resolved translation for a language. */
export type LocalizedPost = Post & {
  languageCode: LanguageCode;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  /** Present for courses — count from list API (avoids N+1 lesson fetches). */
  lessonCount?: number;
};

export type PostInput = Omit<Post, 'id' | 'viewCount' | 'createdAt' | 'updatedAt' | 'publishedAt'>;

export type PostI18nInput = Omit<PostI18n, 'id' | 'createdAt' | 'updatedAt'>;

export interface PostMetadata {
  id: string;
  postId: string;
  metaKey: string;
  metaValue: string;
}

export type PostMetadataInput = Omit<PostMetadata, 'id'>;

/** Non-translatable lesson row (`course_lessons` table). */
export interface CourseLesson {
  id: string;
  courseId: string;
  parentLessonId: string | null;
  sortOrder: number;
  accessLevel: AccessLevel;
  createdAt: string;
  updatedAt: string;
}

/** Translation sidecar (`course_lesson_i18n` table). */
export interface CourseLessonI18n {
  id: number;
  courseLessonId: string;
  languageCode: LanguageCode;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type LocalizedCourseLesson = CourseLesson & {
  languageCode: LanguageCode;
  title: string;
  slug: string;
  content: string;
};

export type CourseLessonInput = Omit<CourseLesson, 'id' | 'createdAt' | 'updatedAt'>;
export type CourseLessonI18nInput = Omit<CourseLessonI18n, 'id' | 'createdAt' | 'updatedAt'>;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function excerptFromHtml(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}
