import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { AccessBadge } from '../../components/ui/Badge';
import { CommentsSection } from '../../components/content/CommentsSection';
import { IconLock } from '../../components/ui/Icons';
import { useAuth } from '../../context/AuthContext';
import { useCourseLessons, usePublishedBySlug, useRecordPublicView } from '../../hooks/usePublicContent';
import { useUiString } from '../../hooks/useUiString';
import type { LocalizedCourseLesson } from '../../types/content';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function CourseView() {
  const { slug } = useParams<{ slug: string }>();
  const { can } = useAuth();
  const t = useUiString();
  const query = usePublishedBySlug('course', slug);
  const course = query.data?.post;
  const resolving = Boolean(slug) && query.isPending;
  useRecordPublicView('course', slug, course?.id, course?.status === 'published');
  const lessonsQuery = useCourseLessons(course?.id, course?.status === 'published');
  const lessons = lessonsQuery.data ?? [];

  if (resolving) {
    return (
      <PublicLayout>
        <p className="empty-state">Loading…</p>
      </PublicLayout>
    );
  }

  if (!course || course.status !== 'published') {
    return (
      <PublicLayout>
        <div className="not-found">
          <h1>{t(UI_STRING_KEYS.common_not_found_title)}</h1>
          <p>{t(UI_STRING_KEYS.common_not_found_body)}</p>
          <Link to="/courses">{t(UI_STRING_KEYS.common_back_courses)}</Link>
        </div>
      </PublicLayout>
    );
  }

  const topLevel = lessons.filter((lesson) => !lesson.parentLessonId);
  const childrenOf = (id: string) => lessons.filter((lesson) => lesson.parentLessonId === id);
  const isLocked = (lesson: LocalizedCourseLesson) =>
    (course.accessLevel === 'premium' || lesson.accessLevel === 'premium') &&
    !can('content:read_premium');

  const renderLesson = (lesson: LocalizedCourseLesson, depth = 0) => (
    <div key={lesson.id} className="lesson-item" style={{ paddingLeft: depth * 20 }}>
      <Link to={`/courses/${course.slug}/${lesson.slug}`} className="lesson-link">
        <span>{lesson.title}</span>
        {isLocked(lesson) && <IconLock className="lesson-lock" width={14} height={14} />}
      </Link>
      {childrenOf(lesson.id).map((child) => renderLesson(child, depth + 1))}
    </div>
  );

  return (
    <PublicLayout>
      <article className="public-article">
        <header className="article-header">
          <div className="article-header-top">
            <h1>{course.title}</h1>
            <AccessBadge level={course.accessLevel} />
          </div>
          <div className="post-meta">
            <span>{course.lessonCount ?? lessons.length} lessons</span>
            <span>{course.viewCount.toLocaleString()} enrolled</span>
          </div>
        </header>

        <div className="prose" dangerouslySetInnerHTML={{ __html: course.content }} />

        <section className="lesson-list">
          <h2>Course Content</h2>
          {lessonsQuery.isPending ? (
            <p className="empty-state">Loading lessons…</p>
          ) : topLevel.length === 0 ? (
            <p className="empty-state">Lessons coming soon.</p>
          ) : (
            topLevel.map((lesson) => renderLesson(lesson))
          )}
        </section>
      </article>

      <CommentsSection postId={course.id} />

      <p className="back-link">
        <Link to="/courses">{t(UI_STRING_KEYS.common_back_courses)}</Link>
      </p>
    </PublicLayout>
  );
}
