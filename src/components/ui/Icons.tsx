import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function base(children: ReactNode, props: IconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconDashboard = (p: IconProps) =>
  base(
    <>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </>,
    p,
  );

export const IconPost = (p: IconProps) =>
  base(
    <>
      <path d="M4 4h13l3 3v13H4z" />
      <path d="M8 9h9M8 13h9M8 17h5" />
    </>,
    p,
  );

export const IconPage = (p: IconProps) =>
  base(
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v4h4" />
    </>,
    p,
  );

export const IconCourse = (p: IconProps) =>
  base(
    <>
      <path d="M12 4 2 8l10 4 10-4-10-4Z" />
      <path d="M6 10v6c0 1.5 3 3 6 3s6-1.5 6-3v-6" />
    </>,
    p,
  );

export const IconService = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </>,
    p,
  );

export const IconProduct = (p: IconProps) =>
  base(
    <>
      <path d="M3 9 12 4l9 5v8l-9 5-9-5V9Z" />
      <path d="M12 13v9M3 9l9 4 9-4" />
    </>,
    p,
  );

export const IconCategory = (p: IconProps) =>
  base(
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </>,
    p,
  );

export const IconTag = (p: IconProps) =>
  base(
    <>
      <path d="M11 3H4v7l10 10 7-7L11 3Z" />
      <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
    </>,
    p,
  );

export const IconComment = (p: IconProps) =>
  base(
    <>
      <path d="M4 5h16v11H9l-5 4V5Z" />
      <path d="M8 9h8M8 12h5" />
    </>,
    p,
  );

export const IconUsers = (p: IconProps) =>
  base(
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="8" r="2.4" />
      <path d="M15 14.2c2.3.5 4 2.6 4 5.8" />
    </>,
    p,
  );

export const IconShield = (p: IconProps) =>
  base(<path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3Z" />, p);

export const IconSettings = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </>,
    p,
  );

export const IconLock = (p: IconProps) =>
  base(
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>,
    p,
  );

export const IconEye = (p: IconProps) =>
  base(
    <>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>,
    p,
  );

export const IconLogout = (p: IconProps) =>
  base(
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>,
    p,
  );

export const IconLogin = (p: IconProps) =>
  base(
    <>
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="M10 17l-5-5 5-5" />
      <path d="M15 12H3" />
    </>,
    p,
  );

export const IconChevronDown = (p: IconProps) => base(<path d="M6 9l6 6 6-6" />, p);

export const IconChevronUp = (p: IconProps) => base(<path d="M18 15l-6-6-6 6" />, p);

export const IconExternal = (p: IconProps) =>
  base(
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 10 14" />
      <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </>,
    p,
  );

export const IconPlus = (p: IconProps) => base(<path d="M12 5v14M5 12h14" />, p);

export const IconCheck = (p: IconProps) => base(<path d="M4 12l5 5L20 6" />, p);

export const IconX = (p: IconProps) => base(<path d="M18 6 6 18M6 6l12 12" />, p);

export const IconBan = (p: IconProps) =>
  base(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M6 6l12 12" />
    </>,
    p,
  );
