import { useState, type FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { useLocale } from '../../context/LocaleContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { userFullName } from '../../types/user';
import type { Comment } from '../../types/comment';
import { Link } from 'react-router-dom';
import { contentApi } from '../../services/contentApi';

export function CommentsSection({ postId }: { postId: string }) {
  const { getCommentsByPost, createComment, getUser } = useContent();
  const { currentUser, can, isGuest } = useAuth();
  const { language } = useLocale();
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [translationByComment, setTranslationByComment] = useState<Record<string, string>>({});
  const [loadingTranslationId, setLoadingTranslationId] = useState<string | null>(null);
  const [translationErrorByComment, setTranslationErrorByComment] = useState<Record<string, string>>({});

  const comments = getCommentsByPost(postId).filter((c) => c.status === 'approved');
  const topLevel = comments.filter((c) => !c.parentCommentId);
  const repliesOf = (id: string) => comments.filter((c) => c.parentCommentId === id);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser || !content.trim()) return;
    void (async () => {
      await createComment({
        postId,
        userId: currentUser.id,
        parentCommentId: null,
        content: content.trim(),
        // Provisional until backend language detection is wired.
        languageCode: language,
      });
      setContent('');
      setSubmitted(true);
    })();
  };

  const handleViewTranslation = async (comment: Comment) => {
    if (translationByComment[comment.id]) {
      setTranslationByComment((prev) => {
        const next = { ...prev };
        delete next[comment.id];
        return next;
      });
      setTranslationErrorByComment((prev) => {
        const next = { ...prev };
        delete next[comment.id];
        return next;
      });
      return;
    }

    setLoadingTranslationId(comment.id);
    setTranslationErrorByComment((prev) => {
      const next = { ...prev };
      delete next[comment.id];
      return next;
    });
    try {
      // Reads only from comment_i18n cache — no Content Translation API yet.
      const translation = await contentApi.getCommentTranslation(comment.id, language);
      setTranslationByComment((prev) => ({ ...prev, [comment.id]: translation.content }));
    } catch {
      setTranslationErrorByComment((prev) => ({
        ...prev,
        [comment.id]:
          language === 'es'
            ? 'Traducción aún no disponible.'
            : 'Translation not available yet.',
      }));
    } finally {
      setLoadingTranslationId(null);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const author = getUser(comment.userId);
    if (!author) return null;
    const needsTranslation = comment.languageCode !== language;
    const showingTranslation = Boolean(translationByComment[comment.id]);
    const translationError = translationErrorByComment[comment.id];

    return (
      <div key={comment.id} className={`comment ${isReply ? 'comment-reply' : ''}`}>
        <Avatar user={author} size={32} />
        <div className="comment-body">
          <p className="comment-author">
            {userFullName(author)}
            <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
          </p>
          <p className="comment-content">{comment.content}</p>
          {showingTranslation && (
            <p className="comment-translation">{translationByComment[comment.id]}</p>
          )}
          {translationError && <p className="comment-translation-error">{translationError}</p>}
          {needsTranslation && (
            <button
              type="button"
              className="comment-translate-btn"
              onClick={() => void handleViewTranslation(comment)}
              disabled={loadingTranslationId === comment.id}
            >
              {loadingTranslationId === comment.id
                ? language === 'es'
                  ? 'Cargando…'
                  : 'Loading…'
                : showingTranslation
                  ? language === 'es'
                    ? 'Ocultar traducción'
                    : 'Hide translation'
                  : language === 'es'
                    ? 'Ver traducción'
                    : 'View translation'}
            </button>
          )}
        </div>
        {repliesOf(comment.id).length > 0 && (
          <div className="comment-replies">
            {repliesOf(comment.id).map((reply) => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="comments-section">
      <h2>Comments ({topLevel.length})</h2>

      {topLevel.length === 0 && <p className="empty-state">No comments yet. Be the first to share your thoughts.</p>}
      <div className="comments-list">{topLevel.map((c) => renderComment(c))}</div>

      {can('comment:write') ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <Textarea
            label="Add a comment"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setSubmitted(false);
            }}
            rows={3}
            placeholder="Share your thoughts..."
            required
          />
          <Button type="submit" size="sm">
            Post Comment
          </Button>
          {submitted && (
            <p className="comment-note">Thanks! Your comment is pending moderation.</p>
          )}
        </form>
      ) : (
        <p className="empty-state">
          {isGuest ? (
            <>
              <Link to="/login">Sign in</Link> to join the conversation.
            </>
          ) : (
            'Your account cannot post comments.'
          )}
        </p>
      )}
    </section>
  );
}
