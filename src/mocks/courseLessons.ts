import type { CourseLesson } from '../types/content';

const iso = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

/** course_lessons seed data — non-translatable fields only (text lives in course_lesson_i18n). */
export const MOCK_COURSE_LESSONS: CourseLesson[] = [
  // React Fundamentals
  {
    id: 'lesson-rf-1',
    courseId: 'course-react-fundamentals',
    parentLessonId: null,
    sortOrder: 1,
    accessLevel: 'public',
    createdAt: iso(130),
    updatedAt: iso(15),
  },
  {
    id: 'lesson-rf-2',
    courseId: 'course-react-fundamentals',
    parentLessonId: null,
    sortOrder: 2,
    accessLevel: 'public',
    createdAt: iso(129),
    updatedAt: iso(15),
  },
  {
    id: 'lesson-rf-2a',
    courseId: 'course-react-fundamentals',
    parentLessonId: 'lesson-rf-2',
    sortOrder: 1,
    accessLevel: 'public',
    createdAt: iso(128),
    updatedAt: iso(15),
  },
  {
    id: 'lesson-rf-3',
    courseId: 'course-react-fundamentals',
    parentLessonId: null,
    sortOrder: 3,
    accessLevel: 'public',
    createdAt: iso(127),
    updatedAt: iso(15),
  },

  // Advanced TypeScript Patterns (premium course)
  {
    id: 'lesson-ts-1',
    courseId: 'course-advanced-typescript',
    parentLessonId: null,
    sortOrder: 1,
    accessLevel: 'public',
    createdAt: iso(40),
    updatedAt: iso(12),
  },
  {
    id: 'lesson-ts-2',
    courseId: 'course-advanced-typescript',
    parentLessonId: null,
    sortOrder: 2,
    accessLevel: 'premium',
    createdAt: iso(39),
    updatedAt: iso(12),
  },
  {
    id: 'lesson-ts-3',
    courseId: 'course-advanced-typescript',
    parentLessonId: null,
    sortOrder: 3,
    accessLevel: 'premium',
    createdAt: iso(38),
    updatedAt: iso(12),
  },

  // UI Design Basics (draft course)
  {
    id: 'lesson-ui-1',
    courseId: 'course-ui-design-basics',
    parentLessonId: null,
    sortOrder: 1,
    accessLevel: 'public',
    createdAt: iso(6),
    updatedAt: iso(2),
  },
];
