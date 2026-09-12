import type { LanguageCode } from './content';

/** Mirrors `comments` + active `comment_i18n` (original text + cached translations). */
export type CommentStatus = 'approved' | 'pending' | 'spam';

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentCommentId: string | null;
  /** Original comment body. */
  content: string;
  /** Language of the original comment. */
  languageCode: LanguageCode | string;
  /** Cached non-original language codes already stored in comment_i18n. */
  availableTranslationLanguages: string[];
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
}

export type CommentInput = Omit<
  Comment,
  'id' | 'createdAt' | 'updatedAt' | 'status' | 'availableTranslationLanguages' | 'languageCode'
> & {
  status?: CommentStatus;
  /** Provisional language until backend detection via Translation API. */
  languageCode?: LanguageCode | string;
};
