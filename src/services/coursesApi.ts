import { apiEnv } from '../config/env';
import type {
  AccessLevel,
  LanguageCode,
  LocalizedCourseLesson,
  LocalizedPost,
  PostMetadata,
  PostStatus,
} from '../types/content';
import {
  mapLocalizedPost,
  type LocalizedPostDto,
  type PostMetadataDto,
} from './contentApi';
import { apiRequest, withQuery } from './httpClient';

export interface LocalizedCourseDto extends LocalizedPostDto {
  lessonCount?: number;
}

export interface LocalizedLessonDto {
  id: string;
  courseId: string;
  parentLessonId: string | null;
  sortOrder: number;
  accessLevel: string;
  createdAt: string;
  updatedAt: string;
  languageCode: string;
  title: string;
  slug: string;
  content: string;
}

export interface CourseTranslationRequest {
  languageCode: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CreateCourseBody {
  authorId?: string;
  featuredImageUrl?: string;
  accessLevel?: string;
  status?: string;
  translation: CourseTranslationRequest;
  metadata?: Array<{ metaKey: string; metaValue?: string }>;
}

export interface UpdateCourseBody {
  featuredImageUrl?: string;
  accessLevel?: string;
  status?: string;
  translation?: CourseTranslationRequest;
}

export interface CreateLessonBody {
  parentLessonId?: string | null;
  sortOrder?: number;
  accessLevel?: string;
  translation: {
    languageCode: string;
    title: string;
    slug: string;
    content: string;
  };
}

export interface UpdateLessonBody {
  parentLessonId?: string | null;
  sortOrder?: number;
  accessLevel?: string;
  translation?: {
    languageCode: string;
    title: string;
    slug: string;
    content: string;
  };
}

const base = () => apiEnv.coursesBaseUrl;

export function mapLocalizedCourse(dto: LocalizedCourseDto): LocalizedPost {
  return {
    ...mapLocalizedPost(dto),
    lessonCount: dto.lessonCount ?? 0,
  };
}

export function mapLocalizedLesson(dto: LocalizedLessonDto): LocalizedCourseLesson {
  return {
    id: dto.id,
    courseId: dto.courseId,
    parentLessonId: dto.parentLessonId,
    sortOrder: dto.sortOrder ?? 0,
    accessLevel: (dto.accessLevel as AccessLevel) || 'premium',
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    languageCode: (dto.languageCode as LanguageCode) || 'en',
    title: dto.title ?? '',
    slug: dto.slug ?? '',
    content: dto.content ?? '',
  };
}

export function mapCourseMetadata(dto: PostMetadataDto): PostMetadata {
  return {
    id: dto.id,
    postId: dto.postId,
    metaKey: dto.metaKey,
    metaValue: dto.metaValue ?? '',
  };
}

export const coursesApi = {
  listCourses(params?: { status?: string; lang?: string }) {
    return apiRequest<LocalizedCourseDto[]>(base(), withQuery('/api/courses', params), {
      auth: false,
    });
  },

  getCourse(id: string, lang?: string) {
    return apiRequest<LocalizedCourseDto>(base(), withQuery(`/api/courses/${id}`, { lang }), {
      auth: false,
    });
  },

  getCourseBySlug(slug: string, lang?: string) {
    return apiRequest<LocalizedCourseDto>(
      base(),
      withQuery(`/api/courses/by-slug/${encodeURIComponent(slug)}`, { lang }),
      { auth: false },
    );
  },

  createCourse(body: CreateCourseBody) {
    return apiRequest<LocalizedCourseDto>(base(), '/api/courses', { method: 'POST', body });
  },

  updateCourse(id: string, body: UpdateCourseBody, lang?: string) {
    return apiRequest<LocalizedCourseDto>(base(), withQuery(`/api/courses/${id}`, { lang }), {
      method: 'PUT',
      body,
    });
  },

  setCourseStatus(id: string, status: PostStatus | string, lang?: string) {
    return apiRequest<LocalizedCourseDto>(
      base(),
      withQuery(`/api/courses/${id}/status`, { lang }),
      { method: 'PATCH', body: { status } },
    );
  },

  deleteCourse(id: string) {
    return apiRequest<void>(base(), `/api/courses/${id}`, { method: 'DELETE' });
  },

  getMetadata(courseId: string) {
    return apiRequest<PostMetadataDto[]>(base(), `/api/courses/${courseId}/metadata`, {
      auth: false,
    });
  },

  putMetadata(courseId: string, entries: Array<{ metaKey: string; metaValue?: string }>) {
    return apiRequest<PostMetadataDto[]>(base(), `/api/courses/${courseId}/metadata`, {
      method: 'PUT',
      body: entries,
    });
  },

  listLessons(courseId: string, lang?: string) {
    return apiRequest<LocalizedLessonDto[]>(
      base(),
      withQuery(`/api/courses/${courseId}/lessons`, { lang }),
      { auth: false },
    );
  },

  getLessonBySlug(courseId: string, slug: string, lang?: string) {
    return apiRequest<LocalizedLessonDto>(
      base(),
      withQuery(
        `/api/courses/${courseId}/lessons/by-slug/${encodeURIComponent(slug)}`,
        { lang },
      ),
      { auth: false },
    );
  },

  createLesson(courseId: string, body: CreateLessonBody) {
    return apiRequest<LocalizedLessonDto>(base(), `/api/courses/${courseId}/lessons`, {
      method: 'POST',
      body,
    });
  },

  updateLesson(courseId: string, id: string, body: UpdateLessonBody, lang?: string) {
    return apiRequest<LocalizedLessonDto>(
      base(),
      withQuery(`/api/courses/${courseId}/lessons/${id}`, { lang }),
      { method: 'PUT', body },
    );
  },

  deleteLesson(courseId: string, id: string) {
    return apiRequest<void>(base(), `/api/courses/${courseId}/lessons/${id}`, {
      method: 'DELETE',
    });
  },

  updateLessonById(id: string, body: UpdateLessonBody, lang?: string) {
    return apiRequest<LocalizedLessonDto>(base(), withQuery(`/api/lessons/${id}`, { lang }), {
      method: 'PUT',
      body,
    });
  },

  deleteLessonById(id: string) {
    return apiRequest<void>(base(), `/api/lessons/${id}`, { method: 'DELETE' });
  },
};
