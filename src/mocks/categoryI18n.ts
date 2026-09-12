import type { CategoryI18n } from '../types/taxonomy';

/** category_i18n seed data — en + es for all 5 categories. */
export const MOCK_CATEGORY_I18N: CategoryI18n[] = [
  { id: 1, categoryId: 1, languageCode: 'en', name: 'Web Development', slug: 'web-development' },
  { id: 2, categoryId: 1, languageCode: 'es', name: 'Desarrollo Web', slug: 'desarrollo-web' },
  { id: 3, categoryId: 2, languageCode: 'en', name: 'Design', slug: 'design' },
  { id: 4, categoryId: 2, languageCode: 'es', name: 'Diseño', slug: 'diseno' },
  { id: 5, categoryId: 3, languageCode: 'en', name: 'Tutorials', slug: 'tutorials' },
  { id: 6, categoryId: 3, languageCode: 'es', name: 'Tutoriales', slug: 'tutoriales' },
  { id: 7, categoryId: 4, languageCode: 'en', name: 'Announcements', slug: 'announcements' },
  { id: 8, categoryId: 4, languageCode: 'es', name: 'Anuncios', slug: 'anuncios' },
  { id: 9, categoryId: 5, languageCode: 'en', name: 'Career', slug: 'career' },
  { id: 10, categoryId: 5, languageCode: 'es', name: 'Carrera', slug: 'carrera' },
];
