import type { AccessLevel, PostStatus } from '../../types/content';
import type { CommentStatus } from '../../types/comment';
import type { RoleName } from '../../types/rbac';
import { ROLE_LABELS } from '../../types/rbac';

export function StatusBadge({ status }: { status: PostStatus }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export function AccessBadge({ level }: { level: AccessLevel }) {
  return (
    <span className={`badge badge-access-${level}`}>{level === 'premium' ? 'Premium' : 'Public'}</span>
  );
}

export function CommentStatusBadge({ status }: { status: CommentStatus }) {
  return <span className={`badge badge-comment-${status}`}>{status}</span>;
}

const ROLE_CLASS: Record<RoleName, string> = {
  Administrator: 'role-admin',
  Content_Editor: 'role-editor',
  Course_Contributor: 'role-contributor',
  Premium_Member: 'role-premium',
  Free_Member: 'role-free',
  Guest: 'role-guest',
};

export function RoleBadge({ role }: { role: RoleName }) {
  return <span className={`badge role-badge ${ROLE_CLASS[role]}`}>{ROLE_LABELS[role]}</span>;
}
