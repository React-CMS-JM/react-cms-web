import type { ContentType } from '../types/content';

/** content_types seed data. */
export const MOCK_CONTENT_TYPES: ContentType[] = [
  { id: 1, name: 'Blog Post', slug: 'post', description: 'Articles shown in the blog.' },
  { id: 2, name: 'Page', slug: 'page', description: 'Static site pages such as About or Contact.' },
  { id: 3, name: 'Course', slug: 'course', description: 'Structured courses made up of lessons.' },
  { id: 4, name: 'Service', slug: 'service', description: 'Professional services offered to clients.' },
  { id: 5, name: 'Product', slug: 'product', description: 'Software products and applications.' },
];

export const CONTENT_TYPE_ID = {
  post: 1,
  page: 2,
  course: 3,
  service: 4,
  product: 5,
} as const;
