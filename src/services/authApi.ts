import { apiEnv } from '../config/env';
import type { PermissionName, RoleName } from '../types/rbac';
import type { User } from '../types/user';
import { apiRequest, withQuery } from './httpClient';

export interface AuthUserDto {
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

export interface LoginResponseDto {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUserDto;
  roles: string[];
  permissions: string[];
}

export interface MeResponseDto {
  user: AuthUserDto;
  roles: string[];
  permissions: string[];
}

export interface RoleDto {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

export interface UserStatsDto {
  total: number;
  banned: number;
}

export interface UserSummaryDto {
  id: string;
  firstName: string;
  lastName: string;
  avatarColor: string;
}

export interface PermissionDto {
  id: number;
  name: string;
  description: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleIds: number[];
}

export interface UpdateUserRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  roleIds: number[];
}

const base = () => apiEnv.authBaseUrl;

export function mapAuthUser(dto: AuthUserDto): User {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    avatarColor: dto.avatarColor || '#6366f1',
    isBanned: Boolean(dto.isBanned),
    banReason: dto.banReason,
    roleIds: dto.roleIds ?? [],
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export const authApi = {
  login(email: string, password: string) {
    return apiRequest<LoginResponseDto>(base(), '/api/auth/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
    });
  },

  me(token?: string | null) {
    return apiRequest<MeResponseDto>(base(), '/api/auth/me', { token });
  },

  logout() {
    return apiRequest<void>(base(), '/api/auth/logout', { method: 'POST' });
  },

  listUsers() {
    return apiRequest<AuthUserDto[]>(base(), '/api/users');
  },

  getUserStats() {
    return apiRequest<UserStatsDto>(base(), '/api/users/stats');
  },

  getUsersByIds(ids: string[]) {
    const unique = [...new Set(ids.filter(Boolean))];
    if (unique.length === 0) {
      return Promise.resolve([] as UserSummaryDto[]);
    }
    return apiRequest<UserSummaryDto[]>(
      base(),
      withQuery('/api/users/by-ids', { ids: unique.join(',') }),
    );
  },

  createUser(body: CreateUserRequest) {
    return apiRequest<AuthUserDto>(base(), '/api/users', { method: 'POST', body });
  },

  updateUser(id: string, body: UpdateUserRequest) {
    return apiRequest<AuthUserDto>(base(), `/api/users/${id}`, { method: 'PUT', body });
  },

  banUser(id: string, reason: string) {
    return apiRequest<AuthUserDto>(base(), `/api/users/${id}/ban`, {
      method: 'POST',
      body: { reason },
    });
  },

  unbanUser(id: string) {
    return apiRequest<AuthUserDto>(base(), `/api/users/${id}/unban`, { method: 'POST' });
  },

  listRoles() {
    return apiRequest<RoleDto[]>(base(), '/api/roles');
  },

  listPermissions() {
    return apiRequest<PermissionDto[]>(base(), '/api/permissions');
  },
};

export function mapRoleDto(dto: RoleDto) {
  return {
    id: dto.id,
    name: dto.name as RoleName,
    description: dto.description,
    permissions: (dto.permissions ?? []) as PermissionName[],
  };
}

export function mapPermissionDto(dto: PermissionDto) {
  return {
    id: dto.id,
    name: dto.name as PermissionName,
    description: dto.description,
  };
}
