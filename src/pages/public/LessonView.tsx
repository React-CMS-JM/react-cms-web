import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { PremiumGate } from '../../components/content/PremiumGate';
import { useContent } from '../../context/ContentContext';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function LessonView() {
  const { slug, lessonSlug } = useParams<{ slug: string; lessonSlug: string }>();
  const { getLocalizedPostBySlug, getLocalizedLessonBySlug, getLocalizedLessonsByCourse } = useContent();
  const t = useUiString();
  const course = slug ? getLocalizedPostBySlug(slug, 'course') : undefined;
  const lesson = course && lessonSlug ? getLocalizedLessonBySlug(course.id, lessonSlug) : undefined;

  if (!course || course.status !== 'published' || !lesson) {
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

  const allLessons = getLocalizedLessonsByCourse(course.id);
  const lessons = allLessons.filter((l) => !l.parentLessonId);
  const flatOrder = lessons.flatMap((l) => [l, ...allLessons.filter((c) => c.parentLessonId === l.id)]);
  const index = flatOrder.findIndex((l) => l.id === lesson.id);
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
