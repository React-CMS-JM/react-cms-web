import type { Role } from '../types/rbac';

/**
 * roles + roles_permissions seed data.
 * Administrator has every permission; other roles receive the subset that
 * matches their real-world responsibilities so the demo can show meaningful
 * gating (who can publish, moderate, ban, or read premium content).
 */
export const MOCK_ROLES: Role[] = [
  {
    id: 1,
    name: 'Administrator',
    description: 'Full access to every module, including user and role management.',
    permissions: [
      'content:create',
      'content:edit_own',
      'content:edit_all',
      'content:publish',
      'content:read_premium',
      'comment:write',
      'comment:moderate',
      'user:ban',
      'content:read',
    ],
  },
  {
    id: 2,
    name: 'Content_Editor',
    description: 'Manages and publishes blog posts and pages, moderates comments.',
    permissions: [
      'content:create',
      'content:edit_own',
      'content:edit_all',
      'content:publish',
      'content:read_premium',
      'comment:write',
      'comment:moderate',
      'content:read',
    ],
  },
  {
    id: 3,
    name: 'Course_Contributor',
    description: 'Creates and edits their own courses and lessons; drafts require approval to publish.',
    permissions: [
      'content:create',
      'content:edit_own',
      'content:read_premium',
      'comment:write',
      'content:read',
    ],
  },
  {
    id: 4,
    name: 'Premium_Member',
    description: 'Paying subscriber with access to premium articles and courses.',
    permissions: ['content:read_premium', 'comment:write', 'content:read'],
  },
  {
    id: 5,
    name: 'Free_Member',
    description: 'Registered visitor with access to public content and commenting.',
    permissions: ['comment:write', 'content:read'],
  },
  {
    id: 6,
    name: 'Guest',
    description: 'Unauthenticated visitor; can browse public content only.',
    permissions: ['content:read'],
  },
];

export const ROLE_ID = {
  Administrator: 1,
  Content_Editor: 2,
  Course_Contributor: 3,
  Premium_Member: 4,
  Free_Member: 5,
  Guest: 6,
} as const;
