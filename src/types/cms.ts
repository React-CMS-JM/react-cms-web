import type { Comment } from './comment';
import type {
  ContentType,
  CourseLesson,
  CourseLessonI18n,
  Post,
  PostI18n,
  PostMetadata,
} from './content';
import type { ParamUiString, ParamUiStringI18n } from './paramUi';
import type { Permission, Role } from './rbac';
import type { SiteSettings } from './settings';
import type { Category, CategoryI18n, Tag, TagI18n } from './taxonomy';
import type { User } from './user';

/** The full shape of the mocked "database" persisted to localStorage. */
export interface CMSData {
  users: User[];
  roles: Role[];
  permissions: Permission[];
  contentTypes: ContentType[];
  posts: Post[];
  postI18n: PostI18n[];
  postMetadata: PostMetadata[];
  courseLessons: CourseLesson[];
  courseLessonI18n: CourseLessonI18n[];
  categories: Category[];
  categoryI18n: CategoryI18n[];
  tags: Tag[];
  tagI18n: TagI18n[];
  comments: Comment[];
  paramUiStrings: ParamUiString[];
  paramUiStringI18n: ParamUiStringI18n[];
  settings: SiteSettings;
}
