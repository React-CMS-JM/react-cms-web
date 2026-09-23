import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { PremiumGate } from '../../components/content/PremiumGate';
import { useCourseLessons, usePublishedBySlug } from '../../hooks/usePublicContent';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function LessonView() {
  const { slug, lessonSlug } = useParams<{ slug: string; lessonSlug: string }>();
  const t = useUiString();
  const courseQuery = usePublishedBySlug('course', slug);
  const course = courseQuery.data?.post;
  const resolving = Boolean(slug) && courseQuery.isPending;
  const lessonsQuery = useCourseLessons(course?.id, course?.status === 'published');
  const lessons = lessonsQuery.data ?? [];
  const lesson =
    course && lessonSlug ? lessons.find((row) => row.slug === lessonSlug) : undefined;

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

  if (lessonsQuery.isPending) {
    return (
      <PublicLayout>
        <p className="empty-state">Loading lesson…</p>
      </PublicLayout>
    );
  }

  if (!lesson) {
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

  const topLevel = lessons.filter((row) => !row.parentLessonId);
  const flatOrder = topLevel.flatMap((row) => [
    row,
    ...lessons.filter((child) => child.parentLessonId === row.id),
  ]);
  const index = flatOrder.findIndex((row) => row.id === lesson.id);
  const prev = index > 0 ? flatOrder[index - 1] : undefined;
  const next = index >= 0 && index < flatOrder.length - 1 ? flatOrder[index + 1] : undefined;
  const locked = course.accessLevel === 'premium' || lesson.accessLevel === 'premium';

  return (
    <PublicLayout>
      <article className="public-article">
        <p className="breadcrumb">
          <Link to={`/courses/${course.slug}`}>← {course.title}</Link>
        </p>
        <header className="article-header">
          <h1>{lesson.title}</h1>
        </header>

        {locked ? (
          <PremiumGate>
            <div className="prose" dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </PremiumGate>
        ) : (
          <div className="prose" dangerouslySetInnerHTML={{ __html: lesson.content }} />
        )}

        <nav className="lesson-pagination">
          {prev ? (
            <Link to={`/courses/${course.slug}/${prev.slug}`} className="btn btn-secondary btn-sm">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link to={`/courses/${course.slug}/${next.slug}`} className="btn btn-primary btn-sm">
              {next.title} →
            </Link>
          )}
        </nav>
      </article>
    </PublicLayout>
  );
}
