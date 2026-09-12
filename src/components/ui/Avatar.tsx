import type { User } from '../../types/user';
import { userInitials } from '../../types/user';

export function Avatar({ user, size = 32 }: { user: User; size?: number }) {
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: user.avatarColor,
      }}
    >
      {userInitials(user)}
    </span>
  );
}
