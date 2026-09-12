/** Mirrors the `users` and `users_roles` tables. */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarColor: string;
  isBanned: boolean;
  banReason: string | null;
  roleIds: number[];
  createdAt: string;
  updatedAt: string;
}

export type UserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export function userFullName(user: User): string {
  return `${user.firstName} ${user.lastName}`.trim();
}

export function userInitials(user: User): string {
  return `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();
}
