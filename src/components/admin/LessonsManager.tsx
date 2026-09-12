import { useState, type FormEvent } from 'react';
import { useContent } from '../../context/ContentContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { HtmlEditor } from '../ui/HtmlEditor';
import { Modal } from '../ui/Modal';
import { AccessBadge } from '../ui/Badge';
import type { AccessLevel, LocalizedCourseLesson } from '../../types/content';
import { slugify } from '../../types/content';

export function LessonsManager({ courseId }: { courseId: string }) {
  const { getLocalizedLessonsByCourse, createLesson, updateLesson, deleteLesson, language } = useContent();
  const lessons = getLocalizedLessonsByCourse(courseId);
  const topLevel = lessons.filter((l) => !l.parentLessonId);
  const childrenOf = (id: string) => lessons.filter((l) => l.parentLessonId === id);

  const [editing, setEditing] = useState<LocalizedCourseLesson | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LocalizedCourseLesson | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [parentLessonId, setParentLessonId] = useState<string>('');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('public');
  const [sortOrder, setSortOrder] = useState(1);
  const [slugManual, setSlugManual] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setTitle('');
    setSlug('');
    setContent('');
    setParentLessonId('');
    setAccessLevel('public');
    setSortOrder(lessons.length + 1);
    setSlugManual(false);
    setShowForm(true);
  };

  const openEdit = (lesson: LocalizedCourseLesson) => {
    setEditing(lesson);
    setTitle(lesson.title);
    setSlug(lesson.slug);
    setContent(lesson.content);
    setParentLessonId(lesson.parentLessonId ?? '');
    setAccessLevel(lesson.accessLevel);
    setSortOrder(lesson.sortOrder);
    setSlugManual(true);
    setShowForm(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void (async () => {
      const lessonInput = {
        courseId,
        parentLessonId: parentLessonId || null,
        sortOrder,
        accessLevel,
      };
      const translation = {
        languageCode: language,
        title,
        slug,
        content,
      };
      if (editing) {
        await updateLesson(editing.id, lessonInput, translation);
      } else {
        await createLesson(lessonInput, translation);
      }
      setShowForm(false);
    })();
  };

  const renderLesson = (lesson: LocalizedCourseLesson, depth = 0) => (
    <div key={lesson.id}>
      <div className="lesson-row" style={{ paddingLeft: depth * 24 }}>
        <button type="button" className="table-link lesson-row-title" onClick={() => openEdit(lesson)}>
          {lesson.title}
        </button>
        <AccessBadge level={lesson.accessLevel} />
        <span className="text-muted">#{lesson.sortOrder}</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(lesson)}>
          Delete
        </button>
      </div>
      {childrenOf(lesson.id).map((child) => renderLesson(child, depth + 1))}
    </div>
  );

  return (
    <section className="card">
      <div className="card-header-row">
        <h2 className="card-title">Lessons</h2>
        <Button size="sm" onClick={openCreate}>
          Add Lesson
        </Button>
      </div>

      {topLevel.length === 0 ? (
        <p className="empty-state">No lessons yet. Add the first one.</p>
      ) : (
        <div className="lesson-manager-list">{topLevel.map((lesson) => renderLesson(lesson))}</div>
      )}

      <Modal open={showForm} title={editing ? 'Edit Lesson' : 'New Lesson'} onClose={() => setShowForm(false)}>
        <form onSubmit={handleSubmit} className="modal-form">
          <Input
            label="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugManual) setSlug(slugify(e.target.value));
            }}
            required
            autoFocus
          />
          <Input
            label="Slug"
            value={slug}
            onChange={(e) => {
              setSlugManual(true);
              setSlug(slugify(e.target.value));
            }}
            required
          />
          <HtmlEditor
            key={editing?.id ?? 'new-lesson'}
            label="Content (HTML)"
            value={content}
            onChange={setContent}
            placeholder="Write lesson content…"
            minHeight={200}
          />
          <Select
            label="Parent Lesson"
            value={parentLessonId}
            onChange={(e) => setParentLessonId(e.target.value)}
            options={[
              { value: '', label: 'None (top-level)' },
              ...lessons
                .filter((l) => l.id !== editing?.id)
                .map((l) => ({ value: l.id, label: l.title })),
            ]}
          />
          <Select
            label="Access Level"
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
            options={[
              { value: 'public', label: 'Public' },
              { value: 'premium', label: 'Premium' },
            ]}
          />
          <Input
            label="Sort Order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            min={1}
          />
          <div className="modal-actions">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit">{editing ? 'Save Changes' : 'Add Lesson'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        title="Delete Lesson"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) void deleteLesson(deleteTarget.id);
          setDeleteTarget(null);
        }}
        confirmLabel="Delete"
        confirmVariant="danger"
      >
        <p>
          Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? Any sub-lessons will
          also be removed.
        </p>
      </Modal>
    </section>
  );
}
