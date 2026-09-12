import type { PostMetadata } from '../types/content';

/** post_metadata seed data — flexible key/value fields per post. */
export const MOCK_POST_METADATA: PostMetadata[] = [
  { id: 'meta-1', postId: 'post-getting-started', metaKey: 'reading_time_minutes', metaValue: '6' },
  { id: 'meta-2', postId: 'post-typescript-tips', metaKey: 'reading_time_minutes', metaValue: '8' },
  { id: 'meta-3', postId: 'post-premium-scaling', metaKey: 'reading_time_minutes', metaValue: '12' },
  { id: 'meta-4', postId: 'course-react-fundamentals', metaKey: 'duration_hours', metaValue: '4.5' },
  { id: 'meta-5', postId: 'course-react-fundamentals', metaKey: 'level', metaValue: 'Beginner' },
  { id: 'meta-6', postId: 'course-advanced-typescript', metaKey: 'duration_hours', metaValue: '6' },
  { id: 'meta-7', postId: 'course-advanced-typescript', metaKey: 'level', metaValue: 'Advanced' },
  {
    id: 'meta-8',
    postId: 'product-youtube-stats-app',
    metaKey: 'website-url',
    metaValue: 'https://youtubestats.example.com',
  },
  {
    id: 'meta-9',
    postId: 'product-youtube-stats-app',
    metaKey: 'live-demo-url',
    metaValue: 'https://demo.youtubestats.example.com',
  },
  {
    id: 'meta-10',
    postId: 'product-my-resume-manager',
    metaKey: 'website-url',
    metaValue: 'https://myresumemanager.example.com',
  },
  {
    id: 'meta-11',
    postId: 'product-my-resume-manager',
    metaKey: 'live-demo-url',
    metaValue: 'https://demo.myresumemanager.example.com',
  },
];
