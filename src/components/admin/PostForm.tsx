import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { useTaxonomyPickerOptions } from '../../hooks/useTaxonomy';
import { contentApi, mapCategory, mapTag } from '../../services/contentApi';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { HtmlEditor } from '../ui/HtmlEditor';
import { Modal } from '../ui/Modal';
import { SearchableMultiSelect } from '../ui/SearchableMultiSelect';
import type { AccessLevel, ContentTypeSlug, PostStatus } from '../../types/content';
import { slugify } from '../../types/content';
import { IconPlus, IconX } from '../ui/Icons';

interface PostFormProps {
  typeSlug: ContentTypeSlug;
  basePath: string;
  publicBasePath: string;
  noun: string;
}

export function PostForm({ typeSlug, basePath, publicBasePath, noun }: PostFormProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser, can } = useAuth();
  const {
    getPost,
    getLocalizedPost,
    createPost,
    updatePost,
    deletePost,
    contentTypes,
    getMetadataForPost,
    setMetadataForPost,
    language,
  } = useContent();

  const categoriesPicker = useTaxonomyPickerOptions('categories', language);
  const tagsPicker = useTaxonomyPickerOptions('tags', language);

  const isNew = id === 'new';
  const existing = isNew ? undefined : getPost(id!);
  const localizedExisting = isNew ? undefined : (id ? getLocalizedPost(id) : undefined);
  const contentType = contentTypes.find((t) => t.slug === typeSlug);

  const canEditAll = can('content:edit_all');
  const canEditOwn = can('content:edit_own');
  const canPublish = can('content:publish');
  const ownsExisting = !!existing && !!currentUser && existing.authorId === currentUser.id;
  const canEditThis = isNew ? can('content:create') : canEditAll || (canEditOwn && ownsExisting);

  const [title, setTitle] = useState(localizedExisting?.title ?? '');
  const [slug, setSlug] = useState(localizedExisting?.slug ?? '');
  const [excerpt, setExcerpt] = useState(localizedExisting?.excerpt ?? '');
  const [content, setContent] = useState(localizedExisting?.content ?? '');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(existing?.accessLevel ?? 'public');
  const [status, setStatus] = useState<PostStatus>(existing?.status ?? 'draft');
  const [categoryIds, setCategoryIds] = useState<number[]>(existing?.categoryIds ?? []);
  const [tagIds, setTagIds] = useState<number[]>(existing?.tagIds ?? []);
  const [metaFields, setMetaFields] = useState<{ metaKey: string; metaValue: string }[]>(
    existing ? getMetadataForPost(existing.id).map((m) => ({ metaKey: m.metaKey, metaValue: m.metaValue })) : [],
  );
  const [slugManual, setSlugManual] = useState(!!existing);
  const [showDelete, setShowDelete] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isNew && !existing) {
    return (
      <div className="page">
        <p className="empty-state">{noun} not found.</p>
        <Link to={basePath}>← Back</Link>
      </div>
    );
  }

  if (!canEditThis) {
    return (
      <div className="page">
        <p className="empty-state">You don&apos;t have permission to edit this {noun.toLowerCase()}.</p>
        <Link to={basePath}>← Back</Link>
      </div>
    );
  }

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugManual) setSlug(slugify(value));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser || !contentType) return;
    void (async () => {
      const finalStatus: PostStatus = status === 'published' && !canPublish ? 'draft' : status;
      const postInput = {
        authorId: existing?.authorId ?? currentUser.id,
        contentTypeId: contentType.id,
        featuredImageUrl: existing?.featuredImageUrl ?? '',
        accessLevel,
        status: finalStatus,
        categoryIds,
        tagIds,
      };
      const translation = {
        languageCode: language,
        title,
        slug,
        content,
        excerpt,
        metaTitle: localizedExisting?.metaTitle || title,
        metaDescription: localizedExisting?.metaDescription || excerpt,
      };
      let postId = existing?.id;
      if (isNew) {
        const created = await createPost(postInput, translation);
        postId = created.id;
        navigate(`${basePath}/${created.id}`, { replace: true });
      } else {
        await updatePost(id!, postInput, translation);
      }
      if (postId) await setMetadataForPost(postId, metaFields);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    })();
  };

  const handleDelete = () => {
    void (async () => {
      if (existing) await deletePost(existing.id);
      navigate(basePath);
    })();
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <Link to={basePath} className="breadcrumb">
            ← {noun}s
          </Link>
          <h1 className="page-title">{isNew ? `New ${noun}` : `Edit ${noun}`}</h1>
        </div>
        <div className="page-actions">
          {saved && <span className="save-indicator">Saved</span>}
          {!isNew && (canEditAll || ownsExisting) && (
            <Button variant="danger" type="button" onClick={() => setShowDelete(true)}>
              Delete
            </Button>
          )}
        </div>
      </header>

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="editor-main">
          <Input
            label="Title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder={`${noun} title`}
          />
          <Input
            label="Slug"
            value={slug}
            onChange={(e) => {
              setSlugManual(true);
              setSlug(slugify(e.target.value));
            }}
            required
            placeholder={`${noun.toLowerCase()}-url-slug`}
          />
          <Textarea
            label="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Brief summary for listings..."
          />
          <HtmlEditor
            label="Content (HTML)"
            value={content}
            onChange={setContent}
            placeholder={`Write your ${noun.toLowerCase()} content…`}
            minHeight={320}
          />

          <div className="card">
            <h2 className="card-title">Custom Fields</h2>
            <p className="text-muted field-hint">Flexible key/value metadata stored alongside this {noun.toLowerCase()}.</p>
            {metaFields.map((field, index) => (
              <div className="meta-field-row" key={index}>
                <Input
                  placeholder="key"
                  value={field.metaKey}
                  onChange={(e) => {
                    const next = [...metaFields];
                    next[index] = { ...next[index], metaKey: e.target.value };
                    setMetaFields(next);
                  }}
                />
                <Input
                  placeholder="value"
                  value={field.metaValue}
                  onChange={(e) => {
                    const next = [...metaFields];
                    next[index] = { ...next[index], metaValue: e.target.value };
                    setMetaFields(next);
                  }}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm meta-field-remove"
                  onClick={() => setMetaFields(metaFields.filter((_, i) => i !== index))}
                >
                  <IconX width={14} height={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setMetaFields([...metaFields, { metaKey: '', metaValue: '' }])}
            >
              <IconPlus width={14} height={14} /> Add field
            </button>
          </div>
        </div>

        <aside className="editor-sidebar">
          <div className="card">
            <Select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as PostStatus)}
              options={[
                { value: 'draft', label: 'Draft' },
                ...(canPublish ? [{ value: 'published', label: 'Published' }] : []),
                { value: 'archived', label: 'Archived' },
              ]}
            />
            {!canPublish && (
              <p className="field-hint">Only editors and administrators can publish.</p>
            )}
            <Select
              label="Access Level"
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
              options={[
                { value: 'public', label: 'Public' },
                { value: 'premium', label: 'Premium' },
              ]}
            />
            <Button type="submit" className="btn-full">
              {isNew ? `Create ${noun}` : 'Save Changes'}
            </Button>
            {!isNew && status === 'published' && (
              <Link to={`${publicBasePath}/${slug}`} className="preview-link">
                Preview on site →
              </Link>
            )}
          </div>

          <div className="card">
            <h2 className="card-title">Categories</h2>
            <SearchableMultiSelect
              placeholder="Search or add category…"
              data={categoriesPicker.items.map((cat) => ({
                value: String(cat.id),
                label: cat.name,
              }))}
              value={categoryIds.map(String)}
              onChange={(next) => setCategoryIds(next.map(Number))}
              onSearchChange={categoriesPicker.onSearchChange}
              onCreate={async (name) => {
                const created = mapCategory(
                  await contentApi.createCategory({
                    languageCode: language,
                    name,
                    slug: slugify(name),
                    dbDescription: name,
                  }),
                );
                void queryClient.invalidateQueries({ queryKey: ['taxonomy', 'categories'] });
                return String(created.id);
              }}
            />
          </div>

          <div className="card">
            <h2 className="card-title">Tags</h2>
            <SearchableMultiSelect
              placeholder="Search or add tag…"
              data={tagsPicker.items.map((tag) => ({
                value: String(tag.id),
                label: tag.name,
              }))}
              value={tagIds.map(String)}
              onChange={(next) => setTagIds(next.map(Number))}
              onSearchChange={tagsPicker.onSearchChange}
              onCreate={async (name) => {
                const created = mapTag(
                  await contentApi.createTag({
                    languageCode: language,
                    name,
                    slug: slugify(name),
                    dbDescription: name,
                  }),
                );
                void queryClient.invalidateQueries({ queryKey: ['taxonomy', 'tags'] });
                return String(created.id);
              }}
            />
          </div>
        </aside>
      </form>

      <Modal
        open={showDelete}
        title={`Delete ${noun}`}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        confirmVariant="danger"
      >
        <p>Are you sure you want to delete &ldquo;{title}&rdquo;? This cannot be undone.</p>
      </Modal>
    </div>
  );
}
