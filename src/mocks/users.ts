import type { User } from '../types/user';
import { ROLE_ID } from './roles';

const iso = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

/** users + users_roles seed data. */
export const MOCK_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'admin@reactcms.dev',
    firstName: 'Alice',
    lastName: 'Adminson',
    avatarColor: '#6366f1',
    isBanned: false,
    banReason: null,
    roleIds: [ROLE_ID.Administrator],
    createdAt: iso(365),
    updatedAt: iso(2),
  },
  {
    id: 'user-editor',
    email: 'ben.editor@reactcms.dev',
    firstName: 'Ben',
    lastName: 'Ellery',
    avatarColor: '#0ea5e9',
    isBanned: false,
    banReason: null,
    roleIds: [ROLE_ID.Content_Editor],
    createdAt: iso(300),
    updatedAt: iso(5),
  },
  {
    id: 'user-contributor',
    email: 'carla.contributor@reactcms.dev',
    firstName: 'Carla',
    lastName: 'Conti',
    avatarColor: '#8b5cf6',
    isBanned: false,
    banReason: null,
    roleIds: [ROLE_ID.Course_Contributor],
    createdAt: iso(210),
    updatedAt: iso(9),
  },
  {
    id: 'user-premium',
    email: 'diego.premium@reactcms.dev',
    firstName: 'Diego',
    lastName: 'Prem',
    avatarColor: '#14b8a6',
    isBanned: false,
    banReason: null,
    roleIds: [ROLE_ID.Premium_Member],
    createdAt: iso(120),
    updatedAt: iso(1),
  },
  {
    id: 'user-free',
    email: 'fiona.free@reactcms.dev',
    firstName: 'Fiona',
    lastName: 'Freeman',
    avatarColor: '#f59e0b',
    isBanned: false,
    banReason: null,
    roleIds: [ROLE_ID.Free_Member],
    createdAt: iso(80),
    updatedAt: iso(3),
  },
  {
    id: 'user-banned',
    email: 'gary.banned@reactcms.dev',
    firstName: 'Gary',
    lastName: 'Banning',
    avatarColor: '#64748b',
    isBanned: true,
    banReason: 'Repeated spam comments across multiple posts.',
    roleIds: [ROLE_ID.Free_Member],
    createdAt: iso(150),
    updatedAt: iso(14),
  },
];
