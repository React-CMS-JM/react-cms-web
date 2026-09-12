import { useParams } from 'react-router-dom';
import { PostForm } from '../../components/admin/PostForm';
import { LessonsManager } from '../../components/admin/LessonsManager';

export function CourseEditor() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';

  return (
    <>
      <PostForm typeSlug="course" basePath="/admin/courses" publicBasePath="/courses" noun="Course" />
      {!isNew && id && (
        <div className="page page-append">
          <LessonsManager courseId={id} />
        </div>
      )}
    </>
  );
}
