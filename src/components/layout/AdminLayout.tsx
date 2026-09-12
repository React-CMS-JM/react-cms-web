import { Outlet } from 'react-router-dom';
import { RequirePermission } from '../auth/RequirePermission';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const STAFF_PERMISSIONS = [
  'content:create',
  'content:edit_own',
  'content:edit_all',
  'content:publish',
  'comment:moderate',
  'user:ban',
] as const;

export function AdminLayout() {
  return (
    <RequirePermission anyOf={[...STAFF_PERMISSIONS]}>
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-main">
          <Topbar />
          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>
    </RequirePermission>
  );
}
