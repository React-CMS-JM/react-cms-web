import { ContentList } from '../../components/admin/ContentList';
import { useContent } from '../../context/ContentContext';

export function CoursesList() {
  const { getLocalizedLessonsByCourse } = useContent();

  return (
    <ContentList
      typeSlug="course"
      title="Courses"
      subtitle="Manage courses and their lessons"
      basePath="/admin/courses"
      publicBasePath="/courses"
      newLabel="New Course"
      extraColumnHeader="Lessons"
      extraColumn={(course) => getLocalizedLessonsByCourse(course.id).length}
    />
  );
}
