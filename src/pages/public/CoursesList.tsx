import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { AccessBadge } from '../../components/ui/Badge';
import { useContent } from '../../context/ContentContext';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';

export function CoursesList() {
  const { getLocalizedPostsByType, getLocalizedLessonsByCourse } = useContent();
  const t = useUiString();

  const courses = getLocalizedPostsByType('course')
    .filter((c) => c.status === 'published')
    .sort((a, b) => b.viewCount - a.viewCount);

  return (
    <PublicLayout>
      <section className="posts-section">
        <div className="section-heading">
          <h1>{t(UI_STRING_KEYS.listing_courses_title)}</h1>
          <p className="page-subtitle">{t(UI_STRING_KEYS.listing_courses_subtitle)}</p>
        </div>

        {courses.length === 0 ? (
          <p className="empty-state">{t(UI_STRING_KEYS.listing_empty)}</p>
        ) : (
          <div className="posts-grid">
            {courses.map((course) => (
              <article key={course.id} className="post-card course-card">
                <div className="post-card-top">
                  <h3>
                    <Link to={`/courses/${course.slug}`}>{course.title}</Link>
                  </h3>
                  <AccessBadge level={course.accessLevel} />
                </div>
                <p className="post-excerpt">{course.excerpt}</p>
                <div className="post-meta">
                  <span>{getLocalizedLessonsByCourse(course.id).length} lessons</span>
                  <span>{course.viewCount.toLocaleString()} enrolled</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
