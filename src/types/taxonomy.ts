import type { LanguageCode } from './content';

/**
 * Mirrors `categories`, `category_i18n`, `tags`, and `tag_i18n`
 * from react-cms-create-tables-v02.sql.
 */

/** Non-translatable category row (`categories` table). */
export interface Category {
  id: number;
  /** English helper for DB/admin browsing; UI labels live in category_i18n. */
  dbDescription: string;
}

/** Translation sidecar (`category_i18n` table). */
export interface CategoryI18n {
  id: number;
  categoryId: number;
  languageCode: LanguageCode;
  name: string;
  slug: string;
}

export type LocalizedCategory = Category & {
  languageCode: LanguageCode;
  name: string;
  slug: string;
  /** Posts linked via posts_categories (from content-service). */
  usageCount: number;
};

/** Non-translatable tag row (`tags` table). */
export interface Tag {
  id: number;
  /** English helper for DB/admin browsing; UI labels live in tag_i18n. */
  dbDescription: string;
}

/** Translation sidecar (`tag_i18n` table). */
export interface TagI18n {
  id: number;
  tagId: number;
  languageCode: LanguageCode;
  name: string;
  slug: string;
}

export type LocalizedTag = Tag & {
  languageCode: LanguageCode;
  name: string;
  slug: string;
  /** Posts linked via posts_tags (from content-service). */
  usageCount: number;
};

export type CategoryI18nInput = Omit<CategoryI18n, 'id'>;
export type TagI18nInput = Omit<TagI18n, 'id'>;
