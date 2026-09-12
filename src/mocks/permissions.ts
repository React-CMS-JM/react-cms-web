import type { Permission } from '../types/rbac';
import { PERMISSION_LABELS } from '../types/rbac';

export const MOCK_PERMISSIONS: Permission[] = Object.entries(PERMISSION_LABELS).map(
  ([name, description], index) => ({
    id: index + 1,
    name: name as Permission['name'],
    description,
  }),
);
