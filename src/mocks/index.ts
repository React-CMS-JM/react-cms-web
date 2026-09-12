/**
 * Static seed fixtures kept for tests / reference.
 * Runtime CMS data is loaded from the Quarkus microservices — do not import this
 * into business logic or providers.
 */
import type { CMSData } from '../types/cms';
import { DEFAULT_SETTINGS } from '../types/settings';
import { MOCK_CATEGORIES } from './categories';
import { MOCK_CATEGORY_I18N } from './categoryI18n';
import { MOCK_COMMENTS } from './comments';
import { MOCK_CONTENT_TYPES } from './contentTypes';
import { MOCK_COURSE_LESSONS } from './courseLessons';
import { MOCK_COURSE_LESSON_I18N } from './courseLessonI18n';
import { MOCK_PARAM_UI_STRINGS } from './paramUiStrings';
import { MOCK_PARAM_UI_STRING_I18N } from './paramUiStringI18n';
import { MOCK_PERMISSIONS } from './permissions';
import { MOCK_POSTS } from './posts';
import { MOCK_POST_I18N } from './postI18n';
import { MOCK_POST_METADATA } from './postMetadata';
import { MOCK_ROLES } from './roles';
import { MOCK_TAGS } from './tags';
import { MOCK_TAG_I18N } from './tagI18n';
import { MOCK_USERS } from './users';

export const MOCK_CMS_DATA: CMSData = {
  users: MOCK_USERS,
  roles: MOCK_ROLES,
  permissions: MOCK_PERMISSIONS,
  contentTypes: MOCK_CONTENT_TYPES,
  posts: MOCK_POSTS,
  postI18n: MOCK_POST_I18N,
  postMetadata: MOCK_POST_METADATA,
  courseLessons: MOCK_COURSE_LESSONS,
  courseLessonI18n: MOCK_COURSE_LESSON_I18N,
  categories: MOCK_CATEGORIES,
  categoryI18n: MOCK_CATEGORY_I18N,
  tags: MOCK_TAGS,
  tagI18n: MOCK_TAG_I18N,
  comments: MOCK_COMMENTS,
  paramUiStrings: MOCK_PARAM_UI_STRINGS,
  paramUiStringI18n: MOCK_PARAM_UI_STRING_I18N,
  settings: DEFAULT_SETTINGS,
};

export * from './categories';
export * from './categoryI18n';
export * from './comments';
export * from './contentTypes';
export * from './courseLessons';
export * from './courseLessonI18n';
export * from './paramUiStrings';
export * from './paramUiStringI18n';
export * from './permissions';
export * from './postI18n';
export * from './postMetadata';
export * from './posts';
export * from './roles';
export * from './tags';
export * from './tagI18n';
export * from './users';
