import { useState, type FormEvent } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { ListingPagination } from '../public/ListingPagination';
import { slugify } from '../../types/content';
import { isTaxonomySearchEligible } from '../../lib/queryClient';

interface TaxonomyItem {
  id: number;
  name: string;
  slug: string;
  usageCount?: number;
}

interface TaxonomyManagerProps {
  title: string;
  description: string;
  items: TaxonomyItem[];
  loading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSearchSubmit: () => void;
  onCreate: (input: { name: string; slug: string }) => unknown | Promise<unknown>;
  onUpdate: (id: number, input: { name: string; slug: string }) => unknown | Promise<unknown>;
  onDelete: (id: number) => unknown | Promise<unknown>;
}

export function TaxonomyManager({
  title,
  description,
  items,
  loading,
  page,
  totalPages,
  onPageChange,
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
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

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed && !isTaxonomySearchEligible(trimmed)) return;
    onSearchSubmit();
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
        <form className="taxonomy-search-bar" onSubmit={handleSearchSubmit}>
          <Input
            label="Search"
            value={searchValue}
            onChange={(e) => onSearchValueChange(e.target.value)}
            placeholder="At least 2 characters…"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        {loading ? (
          <p className="empty-state">Loading…</p>
        ) : items.length === 0 ? (
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
                  <td className="text-muted">{item.usageCount ?? 0} items</td>
                  <td>
                    <Button size="sm" variant="danger" onClick={() => setDeleteTarget(item)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <ListingPagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
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
