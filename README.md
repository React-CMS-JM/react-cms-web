# React CMS

A role-aware content management system built with React, TypeScript, and Vite. It models the schema in `sql-scripts/react-cms-create-tables.sql` end-to-end: RBAC (roles & permissions), users, content types (posts, pages, courses), course lessons, taxonomies (categories & tags), and comments — all backed by mocked data persisted in the browser via `localStorage`.

## Features

- **Full RBAC** — six roles (`Administrator`, `Content_Editor`, `Course_Contributor`, `Premium_Member`, `Free_Member`, `Guest`) mapped to nine granular permissions (`content:create`, `content:edit_own`, `content:edit_all`, `content:publish`, `content:read_premium`, `comment:write`, `comment:moderate`, `user:ban`, `content:read`).
- **Demo sign-in** — a role switcher (top bar / `/login`) lets you experience the site as any seeded user, or as a guest, without a real backend.
- **Guest vs. admin views** — the public site adapts navigation and premium content to the signed-in role; the admin panel's sidebar, routes, and edit rights are all permission-gated.
- **Content modules** — Posts, Pages, and Courses (with nested Lessons), each mapped to a row in `content_types`.
- **Taxonomies** — Categories and Tags management, mirroring `categories`/`tags` and their join tables.
- **Comments & moderation** — public commenting gated by `comment:write`, with a moderation queue gated by `comment:moderate`.
- **User management** — ban/unban and role assignment, gated by `user:ban`.
- **Mock data layer** — `src/mocks/` seeds every table so the app is fully explorable out of the box.
- **Dark blue & gray theme** — with distinctive, harmonious accent colors per action (primary, accent, success, warning, danger, premium).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) for the public site.

Use the account switcher in the top bar (or visit `/login`) to try different roles. The admin panel becomes available once signed in with a role that has any staff permission.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── admin/        # ContentList, PostForm, LessonsManager, TaxonomyManager
│   ├── auth/          # RequirePermission guard, UserSwitcher
│   ├── content/       # PremiumGate, CommentsSection
│   ├── layout/        # AdminLayout, Sidebar, Topbar, PublicLayout
│   └── ui/            # Button, Input, Select, Textarea, Modal, Badge, Avatar, Icons
├── context/           # ContentContext (CMS data), AuthContext (session/permissions)
├── lib/               # localStorage helpers, permission resolution
├── mocks/             # Seed data for every table in the schema
├── pages/
│   ├── admin/         # Dashboard, Posts, Pages, Courses, Categories, Tags,
│   │                    Comments, Users, Roles & Permissions, Settings
│   └── public/        # Home, Blog, Courses/Lessons, static Pages, Login, Forbidden
├── types/             # Domain types mirroring the SQL schema (rbac, user, content, taxonomy, comment)
├── App.tsx            # Routes + guards
└── main.tsx           # Entry point
```

## Roles & Permissions

| Role | Key permissions |
|------|------------------|
| Administrator | Everything, including `user:ban` and role assignment |
| Content_Editor | Create/edit/publish all posts & pages, moderate comments |
| Course_Contributor | Create & edit their own courses/lessons (drafts need Editor/Admin to publish) |
| Premium_Member | Read premium content, comment |
| Free_Member | Read public content, comment |
| Guest | Read public content only |

See `/admin/roles` (Administrator) for the full permission matrix.

## Routes

| Path | Description |
|------|-------------|
| `/` | Public homepage |
| `/blog`, `/blog/:slug` | Blog listing and article view |
| `/courses`, `/courses/:slug`, `/courses/:slug/:lessonSlug` | Course catalog, course overview, lesson view |
| `/page/:slug` | Static pages (About, Contact, etc.) |
| `/login` | Demo role switcher |
| `/forbidden` | Shown when a signed-in role lacks access to a route |
| `/admin` | Dashboard (staff-only) |
| `/admin/posts`, `/admin/pages`, `/admin/courses` | Content management |
| `/admin/categories`, `/admin/tags` | Taxonomy management |
| `/admin/comments` | Comment moderation |
| `/admin/users`, `/admin/roles` | User & role management (Administrator) |
| `/admin/settings` | Site settings |

## Content Format

Post, page, and lesson bodies accept **HTML**, e.g.:

```html
<h2>My Heading</h2>
<p>A paragraph with <strong>bold</strong> text.</p>
<ul><li>List item</li></ul>
```

## Next Steps

- Connect a REST/GraphQL API backed by the MySQL schema in `sql-scripts/`
- Replace the demo role switcher with real authentication
- Add a rich text editor (TipTap, Lexical) and a media library

## License

MIT
