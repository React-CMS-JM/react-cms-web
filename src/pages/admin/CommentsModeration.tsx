import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { useUsersByIds, userSummaryDisplayName } from '../../hooks/useUsersByIds';
import { CommentStatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import type { CommentStatus } from '../../types/comment';

export function CommentsModeration() {
  const {
    comments,
    ensureCommentsLoaded,
    getLocalizedPost,
    setCommentStatus,
    deleteComment,
  } = useContent();
  const [filter, setFilter] = useState<'all' | CommentStatus>('pending');

  useEffect(() => {
    void ensureCommentsLoaded();
  }, [ensureCommentsLoaded]);

  const filtered = useMemo(
    () =>
      [...comments]
        .filter((c) => filter === 'all' || c.status === filter)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [comments, filter],
  );

  const authorIds = useMemo(() => filtered.map((c) => c.userId), [filtered]);
  const authorsById = useUsersByIds(authorIds);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Comments</h1>
          <p className="page-subtitle">Moderate reader comments across posts and courses</p>
        </div>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | CommentStatus)}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'spam', label: 'Spam' },
            { value: 'all', label: 'All' },
          ]}
        />
      </header>

      <section className="card">
        {filtered.length === 0 ? (
          <p className="empty-state">No comments in this view.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Comment</th>
                <th>Lang</th>
                <th>Author</th>
                <th>On</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((comment) => {
                const authorName = userSummaryDisplayName(authorsById[comment.userId]);
                const post = getLocalizedPost(comment.postId);
                return (
                  <tr key={comment.id}>
                    <td className="comment-cell">{comment.content}</td>
                    <td className="text-muted">{comment.languageCode}</td>
                    <td className="text-muted">{authorName || 'Unknown'}</td>
                    <td className="text-muted">
                      {post ? <Link to={`/admin/posts/${post.id}`}>{post.title}</Link> : '—'}
                    </td>
                    <td>
                      <CommentStatusBadge status={comment.status} />
                    </td>
                    <td>
                      <div className="row-actions">
                        {comment.status !== 'approved' && (
                          <Button size="sm" variant="success" onClick={() => void setCommentStatus(comment.id, 'approved')}>
                            Approve
                          </Button>
                        )}
                        {comment.status !== 'spam' && (
                          <Button size="sm" variant="warning" onClick={() => void setCommentStatus(comment.id, 'spam')}>
                            Spam
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => void deleteComment(comment.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
