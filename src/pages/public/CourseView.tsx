import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { AccessBadge } from '../../components/ui/Badge';
import { CommentsSection } from '../../components/content/CommentsSection';
import { IconLock } from '../../components/ui/Icons';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { useUiString } from '../../hooks/useUiString';
import type { LocalizedCourseLesson } from '../../types/content';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function CourseView() {
  const { slug } = useParams<{ slug: string }>();
  const {
    getLocalizedPostBySlug,
    getLocalizedLessonsByCourse,
    ensureLessonsLoaded,
    incrementViewCount,
  } = useContent();
  const { can } = useAuth();
  const t = useUiString();
  const course = slug ? getLocalizedPostBySlug(slug, 'course') : undefined;
  const counted = useRef(false);
  const [lessonsReady, setLessonsReady] = useState(false);

  useEffect(() => {
    if (course && course.status === 'published' && !counted.current) {
      counted.current = true;
      incrementViewCount(course.id);
    }
  }, [course, incrementViewCount]);

  useEffect(() => {
    if (!course || course.status !== 'published') {
      setLessonsReady(false);
      return;
    }
    let cancelled = false;
    setLessonsReady(false);
    void ensureLessonsLoaded(course.id).then(() => {
      if (!cancelled) setLessonsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [course, ensureLessonsLoaded]);

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

  const lessons = getLocalizedLessonsByCourse(course.id);
  const topLevel = lessons.filter((l) => !l.parentLessonId);
  const childrenOf = (id: string) => lessons.filter((l) => l.parentLessonId === id);
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
          {!lessonsReady ? (
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
