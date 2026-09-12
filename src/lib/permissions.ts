import type { PermissionName, Role } from '../types/rbac';
import type { User } from '../types/user';

export function permissionsForUser(user: User | null, roles: Role[] | undefined): Set<PermissionName> {
  if (!roles) return new Set();
  if (!user) {
    const guestRole = roles.find((r) => r.name === 'Guest');
    return new Set(guestRole?.permissions ?? []);
  }
  const perms = new Set<PermissionName>();
  for (const roleId of user.roleIds) {
    const role = roles.find((r) => r.id === roleId);
    role?.permissions.forEach((p) => perms.add(p));
  }
  return perms;
}

export function rolesForUser(user: User | null, roles: Role[] | undefined): Role[] {
  if (!roles) return [];
  if (!user) {
    const guestRole = roles.find((r) => r.name === 'Guest');
    return guestRole ? [guestRole] : [];
  }
  return roles.filter((r) => user.roleIds.includes(r.id));
}

export function primaryRole(user: User | null, roles: Role[] | undefined): Role | undefined {
  if (!roles) return undefined;
  const userRoles = rolesForUser(user, roles);
  const priority: Role['name'][] = [
    'Administrator',
    'Content_Editor',
    'Course_Contributor',
    'Premium_Member',
    'Free_Member',
    'Guest',
  ];
  return userRoles.sort((a, b) => priority.indexOf(a.name) - priority.indexOf(b.name))[0];
}