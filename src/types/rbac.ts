/**
 * Mirrors the RBAC tables in react-cms-create-tables.sql:
 * permissions, roles, roles_permissions, users_roles.
 */
export type PermissionName =
  | 'content:create'
  | 'content:edit_own'
  | 'content:edit_all'
  | 'content:publish'
  | 'content:read_premium'
  | 'comment:write'
  | 'comment:moderate'
  | 'user:ban'
  | 'content:read';

export type RoleName =
  | 'Administrator'
  | 'Content_Editor'
  | 'Course_Contributor'
  | 'Premium_Member'
  | 'Free_Member'
  | 'Guest';

export interface Permission {
  id: number;
  name: PermissionName;
  description: string;
}

export interface Role {
  id: number;
  name: RoleName;
  description: string;
  permissions: PermissionName[];
}

export const ROLE_LABELS: Record<RoleName, string> = {
  Administrator: 'Administrator',
  Content_Editor: 'Content Editor',
  Course_Contributor: 'Course Contributor',
  Premium_Member: 'Premium Member',
  Free_Member: 'Free Member',
  Guest: 'Guest',
};

export const PERMISSION_LABELS: Record<PermissionName, string> = {
  'content:create': 'Create content',
  'content:edit_own': 'Edit own content',
  'content:edit_all': 'Edit all content',
  'content:publish': 'Publish content',
  'content:read_premium': 'Read premium content',
  'comment:write': 'Write comments',
  'comment:moderate': 'Moderate comments',
  'user:ban': 'Ban users',
  'content:read': 'Read public content',
};
