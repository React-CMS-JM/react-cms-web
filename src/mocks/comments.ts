import type { Comment } from '../types/comment';

const iso = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

/** comments seed data (original language + optional cached translations). */
export const MOCK_COMMENTS: Comment[] = [
  {
    id: 'comment-1',
    postId: 'post-getting-started',
    userId: 'user-premium',
    parentCommentId: null,
    content: 'Great overview! The role switcher makes it really easy to see the differences.',
    languageCode: 'en',
    availableTranslationLanguages: ['es'],
    status: 'approved',
    createdAt: iso(40),
    updatedAt: iso(40),
  },
  {
    id: 'comment-2',
    postId: 'post-getting-started',
    userId: 'user-free',
    parentCommentId: null,
    content: 'Would love to see a walkthrough of the permissions matrix in more detail.',
    languageCode: 'en',
    availableTranslationLanguages: [],
    status: 'approved',
    createdAt: iso(38),
    updatedAt: iso(38),
  },
  {
    id: 'comment-3',
    postId: 'post-getting-started',
    userId: 'user-editor',
    parentCommentId: 'comment-2',
    content: 'Good idea — check the Roles & Permissions page in the admin panel!',
    languageCode: 'en',
    availableTranslationLanguages: [],
    status: 'approved',
    createdAt: iso(37),
    updatedAt: iso(37),
  },
  {
    id: 'comment-4',
    postId: 'post-typescript-tips',
    userId: 'user-free',
    parentCommentId: null,
    content: '¡El tip #3 con `satisfies` cambió cómo escribo objetos de configuración. Gracias!',
    languageCode: 'es',
    availableTranslationLanguages: [],
    status: 'approved',
    createdAt: iso(18),
    updatedAt: iso(18),
  },
  {
    id: 'comment-5',
    postId: 'post-typescript-tips',
    userId: 'user-banned',
    parentCommentId: null,
    content: 'Check out my link for cheap followers!! www.spam-example.test',
    languageCode: 'en',
    availableTranslationLanguages: [],
    status: 'pending',
    createdAt: iso(2),
    updatedAt: iso(2),
  },
  {
    id: 'comment-6',
    postId: 'course-react-fundamentals',
    userId: 'user-premium',
    parentCommentId: null,
    content: 'The Practice lesson on card lists was a perfect checkpoint before moving on.',
    languageCode: 'en',
    availableTranslationLanguages: [],
    status: 'pending',
    createdAt: iso(5),
    updatedAt: iso(5),
  },
];
