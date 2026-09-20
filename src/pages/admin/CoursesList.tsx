import { ContentList } from '../../components/admin/ContentList';

export function CoursesList() {
  return (
    <ContentList
      typeSlug="course"
      title="Courses"
      subtitle="Manage courses and their lessons"
      basePath="/admin/courses"
      publicBasePath="/courses"
      newLabel="New Course"
      extraColumnHeader="Lessons"
      extraColumn={(course) => course.lessonCount ?? 0}
    />
  );
}
