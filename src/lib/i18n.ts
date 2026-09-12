import type {
  CourseLesson,
  CourseLessonI18n,
  LanguageCode,
  LocalizedCourseLesson,
  LocalizedPost,
  Post,
  PostI18n,
} from '../types/content';
import { DEFAULT_LANGUAGE } from '../types/content';
import type {
  Category,
  CategoryI18n,
  LocalizedCategory,
  LocalizedTag,
  Tag,
  TagI18n,
} from '../types/taxonomy';

function pickTranslation<T extends { languageCode: LanguageCode }>(
  rows: T[],
  languageCode: LanguageCode,
): T | undefined {
  return rows.find((r) => r.languageCode === languageCode) ?? rows.find((r) => r.languageCode === DEFAULT_LANGUAGE) ?? rows[0];
}

export function localizePost(
  post: Post,
  translations: PostI18n[],
  languageCode: LanguageCode,
): LocalizedPost | undefined {
  const i18n = pickTranslation(
    translations.filter((t) => t.postId === post.id),
    languageCode,
  );
  if (!i18n) return undefined;
  return {
    ...post,
    languageCode: i18n.languageCode,
    title: i18n.title,
    slug: i18n.slug,
    content: i18n.content,
    excerpt: i18n.excerpt,
    metaTitle: i18n.metaTitle,
    metaDescription: i18n.metaDescription,
  };
}

export function localizeLesson(
  lesson: CourseLesson,
  translations: CourseLessonI18n[],
  languageCode: LanguageCode,
): LocalizedCourseLesson | undefined {
  const i18n = pickTranslation(
    translations.filter((t) => t.courseLessonId === lesson.id),
    languageCode,
  );
  if (!i18n) return undefined;
  return {
    ...lesson,
    languageCode: i18n.languageCode,
    title: i18n.title,
    slug: i18n.slug,
    content: i18n.content,
  };
}

export function localizeCategory(
  category: Category,
  translations: CategoryI18n[],
  languageCode: LanguageCode,
): LocalizedCategory | undefined {
  const i18n = pickTranslation(
    translations.filter((t) => t.categoryId === category.id),
    languageCode,
  );
  if (!i18n) return undefined;
  return {
    ...category,
    languageCode: i18n.languageCode,
    name: i18n.name,
    slug: i18n.slug,
  };
}

export function localizeTag(
  tag: Tag,
  translations: TagI18n[],
  languageCode: LanguageCode,
): LocalizedTag | undefined {
  const i18n = pickTranslation(
    translations.filter((t) => t.tagId === tag.id),
    languageCode,
  );
  if (!i18n) return undefined;
  return {
    ...tag,
    languageCode: i18n.languageCode,
    name: i18n.name,
    slug: i18n.slug,
  };
}
