import { useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { slugify } from '../../types/content';

interface TaxonomyItem {
  id: number;
  name: string;
  slug: string;
}

interface TaxonomyManagerProps {
  title: string;
  description: string;
  items: TaxonomyItem[];
  usageCount: (id: number) => number;
  onCreate: (input: { name: string; slug: string }) => unknown | Promise<unknown>;
  onUpdate: (id: number, input: { name: string; slug: string }) => unknown | Promise<unknown>;
  onDelete: (id: number) => unknown | Promise<unknown>;
}

export function TaxonomyManager({
  title,
  description,
  items,
  usageCount,
  onCreate,
  onUpdate,
  onDelete,
}: TaxonomyManagerProps) {
  const [editing, setEditing] = useState<TaxonomyItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TaxonomyItem | null>(null);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setSlug('');
    setSlugManual(false);
    setShowForm(true);
  };

  const openEdit = (item: TaxonomyItem) => {
    setEditing(item);
    setName(item.name);
    setSlug(item.slug);
    setSlugManual(true);
    setShowForm(true);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void (async () => {
      if (editing) {
        await onUpdate(editing.id, { name, slug });
      } else {
        await onCreate({ name, slug });
      }
      setShowForm(false);
    })();
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{description}</p>
        </div>
        <Button onClick={openCreate}>New {title.replace(/s$/, '')}</Button>
      </header>

      <section className="card">
        {items.length === 0 ? (
          <p className="empty-state">Nothing here yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Used by</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="table-link" onClick={() => openEdit(item)} role="button">
                    {item.name}
                  </td>
                  <td className="text-muted">/{item.slug}</td>
                  <td className="text-muted">{usageCount(item.id)} posts</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setDeleteTarget(item)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <Modal
        open={showForm}
        title={editing ? `Edit ${title.replace(/s$/, '')}` : `New ${title.replace(/s$/, '')}`}
        onClose={() => setShowForm(false)}
      >
        <form onSubmit={handleSubmit} className="modal-form">
          <Input
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
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
          <div className="modal-actions">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit">{editing ? 'Save Changes' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        title={`Delete ${title.replace(/s$/, '')}`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) void onDelete(deleteTarget.id);
          setDeleteTarget(null);
        }}
        confirmLabel="Delete"
        confirmVariant="danger"
      >
        <p>
          Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? It will be removed
          from any posts using it.
        </p>
      </Modal>
    </div>
  );
}
