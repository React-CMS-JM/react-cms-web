import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../../components/ui/Avatar';
import { RoleBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { userFullName } from '../../types/user';
import type { User } from '../../types/user';

export function UsersList() {
  const { users, roles, updateUser, banUser, unbanUser } = useContent();
  const { currentUser } = useAuth();
  const [banTarget, setBanTarget] = useState<User | null>(null);
  const [banReason, setBanReason] = useState('');
  const [rolesTarget, setRolesTarget] = useState<User | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);

  const openRoles = (user: User) => {
    setRolesTarget(user);
    setSelectedRoleIds(user.roleIds);
  };

  const saveRoles = () => {
    if (rolesTarget) void updateUser(rolesTarget.id, { roleIds: selectedRoleIds });
    setRolesTarget(null);
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Manage accounts, roles, and bans</p>
        </div>
      </header>

      <section className="card">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Roles</th>
              <th>Status</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <Avatar user={user} size={32} />
                    <div>
                      <p className="table-link">{userFullName(user)}</p>
                      <p className="table-link-muted">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="tag-list">
                    {user.roleIds.map((rid) => {
                      const role = roles.find((r) => r.id === rid);
                      return role ? <RoleBadge key={rid} role={role.name} /> : null;
                    })}
                  </div>
                </td>
                <td>
                  {user.isBanned ? (
                    <span className="badge badge-banned" title={user.banReason ?? ''}>
                      Banned
                    </span>
                  ) : (
                    <span className="badge badge-active">Active</span>
                  )}
                </td>
                <td className="text-muted">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="row-actions">
                    <Button size="sm" variant="secondary" onClick={() => openRoles(user)}>
                      Roles
                    </Button>
                    {user.isBanned ? (
                      <Button size="sm" variant="success" onClick={() => void unbanUser(user.id)}>
                        Unban
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={user.id === currentUser?.id}
                        onClick={() => {
                          setBanTarget(user);
                          setBanReason('');
                        }}
                      >
                        Ban
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <Modal
        open={!!banTarget}
        title={`Ban ${banTarget ? userFullName(banTarget) : ''}`}
        onClose={() => setBanTarget(null)}
        onConfirm={() => {
          if (banTarget) void banUser(banTarget.id, banReason || 'No reason provided.');
          setBanTarget(null);
        }}
        confirmLabel="Ban User"
        confirmVariant="danger"
      >
        <Input
          label="Reason"
          value={banReason}
          onChange={(e) => setBanReason(e.target.value)}
          placeholder="Why is this user being banned?"
        />
      </Modal>

      <Modal
        open={!!rolesTarget}
        title={`Roles for ${rolesTarget ? userFullName(rolesTarget) : ''}`}
        onClose={() => setRolesTarget(null)}
        onConfirm={saveRoles}
        confirmLabel="Save Roles"
      >
        <div className="checkbox-list">
          {roles.map((role) => (
            <label key={role.id} className="checkbox-item">
              <input
                type="checkbox"
                checked={selectedRoleIds.includes(role.id)}
                onChange={() =>
                  setSelectedRoleIds((prev) =>
                    prev.includes(role.id) ? prev.filter((id) => id !== role.id) : [...prev, role.id],
                  )
                }
              />
              {role.name.replace('_', ' ')}
            </label>
          ))}
        </div>
      </Modal>
    </div>
  );
}
