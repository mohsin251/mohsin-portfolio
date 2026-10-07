# Mohsin Portfolio — Public Site + Admin CMS

A two-sided application:

1. **Public portfolio** — futuristic, animated, fully driven by live data.
2. **Admin CMS** (`/admin`) — a private dashboard where you manage every piece
   of content (projects, skills, services, experience, messages, settings)
   without touching code.

Build once. Manage forever.

---

## 1. Architecture

```
Admin logs in (Supabase Auth)
        │
        ▼
 Admin Dashboard (/admin/*) ── protected by ProtectedRoute
        │
        ▼
 Project Form ── image dropped in ──▶ Supabase Storage (project-images bucket)
        │                                   │
        │                           public URL returned
        ▼                                   │
 Project row saved ◀────────────────────────┘
 to PostgreSQL (`projects` table)
        │
        ▼
 Published = true
        │
        ▼
 Public React site queries Supabase directly
 (no hardcoded data, no rebuild needed)
        │
        ▼
 Project Card → Project Detail Page (/projects/:slug)
```

## 2. Tech stack

- **Frontend:** React 18 + Vite, Tailwind CSS, Framer Motion, Lucide icons, React Router
- **Backend:** Supabase (PostgreSQL + Auth + Storage), accessed only through the public anon key
- **No fake backend.** Every read/write in this app goes through `@supabase/supabase-js`. There is no localStorage database, no hardcoded project array, no fake auth.

## 3. Authentication & authorization architecture

- Supabase Auth issues real sessions (email/password).
- A `profiles` table maps `auth.users.id → role` (`admin` / `viewer`).
- A SQL function `is_admin()` (SECURITY DEFINER) checks the current user's role and is used inside every RLS policy — the frontend never decides who's an admin, Postgres does.
- `ProtectedRoute` checks `session` + `profile.role === 'admin'` before rendering any `/admin/*` page. Unauthenticated users are redirected to `/admin/login`; authenticated non-admins see an "ACCESS DENIED" screen.
- The Supabase **service_role** key is never used anywhere in this codebase — only `VITE_SUPABASE_ANON_KEY`, which is safe to ship to the browser because RLS does the real enforcement.

## 4. Storage architecture

- Bucket: `project-images` (public **read**, admin-only **write/delete** — enforced by storage RLS policies, not just app logic).
- Images are uploaded client-side via `supabase.storage.from('project-images').upload(...)`, the public URL is read back, and only that URL string is stored in `projects.image_url`. No binary data ever touches PostgreSQL.

## 5. Folder structure

```
src/
  components/
    admin/        ImageDropzone, TechTagInput, ConfirmModal, Sidebar
    public/        Navbar, Footer, Hero, About, Skills, Services, ...
    shared/        ProtectedRoute, LoadingScreen, CustomCursor, CommandPalette, ScrollProgress
  layouts/         PublicLayout.jsx, AdminLayout.jsx
  pages/
    public/        Home, Projects, ProjectDetail, AboutPage, ContactPage, NotFound
    admin/         Login, Dashboard, Projects, ProjectForm, Skills, Services, Experience, Messages, Settings
  services/        projectService.js, skillService.js, serviceService.js,
                   experienceService.js, messageService.js, settingsService.js
  context/         AuthContext.jsx, ToastContext.jsx
  lib/             supabase.js
  App.jsx, main.jsx, index.css
supabase/
  migrations/001_initial_schema.sql
public/
  resume.pdf (replace with your real resume), robots.txt, sitemap.xml
```

---

## 6. Supabase setup (step by step)

### STEP 1 — Create a Supabase project
Go to https://supabase.com/dashboard → New Project. Note your project URL and anon key (Settings → API).

### STEP 2 — Run the SQL migration
Open **SQL Editor** in the Supabase dashboard, paste the entire contents of
`supabase/migrations/001_initial_schema.sql`, and run it.

This single file creates:
- All 7 tables (`profiles`, `projects`, `skills`, `services`, `experience`, `messages`, `site_settings`)
- Indexes, `updated_at` triggers, the unique slug constraint
- The `is_admin()` helper function
- Row Level Security enabled + policies on every table
- The `project-images` storage bucket + its 4 storage policies (public read, admin-only insert/update/delete)

You do **not** need to manually create the storage bucket in the dashboard — the migration does it via `insert into storage.buckets`. If your Supabase plan/version doesn't allow that statement, create a bucket named exactly `project-images` manually (Storage → New Bucket → name `project-images` → toggle **Public**) and re-run just the storage policy statements at the bottom of the file.

### STEP 3 — Create your admin user
Dashboard → **Authentication → Users → Add User** → enter your email + a password (or invite yourself by email). Copy the generated **User UID**.

### STEP 4 — Assign the admin role
Back in SQL Editor:

```sql
insert into public.profiles (user_id, full_name, role)
values ('PASTE-USER-UID-HERE', 'Mohsin', 'admin');
```

### STEP 5 — Configure environment variables
```bash
cp .env.example .env
```
Fill in:
```
VITE_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```
Never put your `service_role` key here or anywhere in this repo.

### STEP 6 — Install & run
```bash
npm install
npm run dev
```

### STEP 7 — Log in
Visit `http://localhost:5173/admin/login`, sign in with the account from Step 3. You'll land on `/admin/dashboard`.

### STEP 8 — Add your first project
`/admin/projects/new` → fill the form → drag an image into the upload box →
check **Featured** if you want it on the homepage → **Publish**.
Visit `/projects` on the public site — it's there immediately. No code change, no redeploy.

### STEP 9 — Seed Skills / Services / Experience / Settings
These sections render nothing (or a graceful empty/placeholder state) until you add rows from `/admin/skills`, `/admin/services`, `/admin/experience`, and fill in `/admin/settings`. Experience is intentionally empty by default — don't invent real work history for the owner; add real entries from the admin panel when ready.

---

## 7. How Row Level Security actually protects this app

| Table | Public (anon) | Admin |
|---|---|---|
| `projects` | SELECT where `published = true` | full CRUD |
| `skills` / `services` / `experience` | SELECT where `published = true` | full CRUD |
| `messages` | INSERT only (contact form) | SELECT/UPDATE/DELETE |
| `site_settings` | SELECT (single row) | UPDATE |
| `profiles` | own row only | full CRUD |
| Storage `project-images` | SELECT (read files) | INSERT/UPDATE/DELETE |

Because these rules live in Postgres (not in React), even a malicious user who reads your frontend bundle and calls the Supabase REST API directly cannot see drafts, read messages, or write to any table — RLS rejects it at the database layer regardless of what the client sends.

## 8. Production build

```bash
npm run build
npm run preview   # sanity-check the production build locally
```
Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages). Set the same two `VITE_SUPABASE_*` environment variables in your host's dashboard — `.env` files are never deployed.

## 9. Extending later (architected for, not yet built)

The schema and service-layer pattern are intentionally reusable for:
blog posts, certificates, resume versions, case studies, project view/like counters, a newsletter, a real `testimonials` table, multiple admins (the `profiles.role` check already supports more than one admin row), and a media library. Add a table + RLS policies following the same pattern as `projects`, then a `xService.js`, then an admin CRUD page copied from `Skills.jsx` or `ProjectForm.jsx` — the rest of the app doesn't need to change.

## 10. Security checklist (verified in this codebase)

- [x] No secret/service-role key anywhere in frontend code
- [x] Every `/admin/*` route behind `ProtectedRoute` (auth + role check)
- [x] RLS enabled on all 7 tables and on `storage.objects`
- [x] Public reads are published-only; admin reads see everything
- [x] Image upload/delete restricted to admins at the storage-policy level, not just hidden in the UI
- [x] Contact form messages are insert-only for the public and never publicly listable
- [x] URLs are validated before save; empty GitHub/Live URLs simply don't render a button (nothing is invented)
- [x] Logout calls `supabase.auth.signOut()` and clears local session state
