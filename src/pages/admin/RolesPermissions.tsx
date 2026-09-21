import { useEffect, useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { RoleBadge } from '../../components/ui/Badge';
import { IconCheck } from '../../components/ui/Icons';

export function RolesPermissions() {
  const { roles, permissions, ensureAuthDirectoryLoaded } = useContent();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void ensureAuthDirectoryLoaded().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [ensureAuthDirectoryLoaded]);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Roles &amp; Permissions</h1>
          <p className="page-subtitle">Reference matrix of what each role can do (read-only)</p>
        </div>
      </header>

      {loading ? (
        <section className="card">
          <p className="empty-state">Loading…</p>
        </section>
      ) : (
        <>
          <section className="card permissions-matrix-card">
            <table className="table permissions-matrix">
              <thead>
                <tr>
                  <th>Permission</th>
                  {roles.map((role) => (
                    <th key={role.id}>
                      <RoleBadge role={role.name} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm) => (
                  <tr key={perm.id}>
                    <td>
                      <p className="table-link">{perm.name}</p>
                      <p className="table-link-muted">{perm.description}</p>
                    </td>
                    {roles.map((role) => (
                      <td key={role.id} className="matrix-cell">
                        {role.permissions.includes(perm.name) && (
                          <IconCheck className="matrix-check" width={16} height={16} />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="card">
            <h2 className="card-title">Roles</h2>
            <div className="roles-grid">
              {roles.map((role) => (
                <div key={role.id} className="role-summary-card">
                  <RoleBadge role={role.name} />
                  <p className="text-muted">{role.description}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
