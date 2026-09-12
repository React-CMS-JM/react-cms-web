import type { TagI18n } from '../types/taxonomy';

/** tag_i18n seed data — en + es for all tags. */
export const MOCK_TAG_I18N: TagI18n[] = [
  { id: 1, tagId: 1, languageCode: 'en', name: 'react', slug: 'react' },
  { id: 2, tagId: 1, languageCode: 'es', name: 'react', slug: 'react' },
  { id: 3, tagId: 2, languageCode: 'en', name: 'typescript', slug: 'typescript' },
  { id: 4, tagId: 2, languageCode: 'es', name: 'typescript', slug: 'typescript' },
  { id: 5, tagId: 3, languageCode: 'en', name: 'css', slug: 'css' },
  { id: 6, tagId: 3, languageCode: 'es', name: 'css', slug: 'css' },
  { id: 7, tagId: 4, languageCode: 'en', name: 'beginner', slug: 'beginner' },
  { id: 8, tagId: 4, languageCode: 'es', name: 'principiante', slug: 'principiante' },
  { id: 9, tagId: 5, languageCode: 'en', name: 'advanced', slug: 'advanced' },
  { id: 10, tagId: 5, languageCode: 'es', name: 'avanzado', slug: 'avanzado' },
  { id: 11, tagId: 6, languageCode: 'en', name: 'productivity', slug: 'productivity' },
  { id: 12, tagId: 6, languageCode: 'es', name: 'productividad', slug: 'productividad' },
  { id: 13, tagId: 7, languageCode: 'en', name: 'career', slug: 'career' },
  { id: 14, tagId: 7, languageCode: 'es', name: 'carrera', slug: 'carrera' },
];
