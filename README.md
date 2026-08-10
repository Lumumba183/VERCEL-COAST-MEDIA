# The Coast Media Group — Vercel + Supabase + Clerk

Kenya's leading coastal news, radio and TV platform, rebuilt as a full-stack
**Next.js 15 (App Router) + TypeScript + Tailwind CSS** application with
**Clerk** authentication and a **Supabase** (PostgreSQL) database, ready for
one-click deployment on **Vercel**.

## Features

- **News platform** — articles with categories, featured homepage hero, related stories, search
- **Radio Coast** — persistent bottom audio player + dedicated Listen page (stream URL set in Admin → Settings)
- **Coast TV** — YouTube live-stream embed (channel ID set in Admin → Settings)
- **Programme Schedule** — weekly line-up, managed from the admin panel
- **Submit a Story** — public tips land in the admin Reports inbox
- **Advertise** — packages page with enquiry form
- **Brief Slider** — breaking-news ticker on the homepage (auto-fill from latest articles or manual items)
- **Admin Panel** — Clerk sign-in, role-based access (admin / editor), articles CRUD, schedule CRUD, reports inbox, user management, brief slider, settings
- **Legal pages** — Privacy, Terms, Cookies

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Icons | Lucide React |

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com) (region close to Kenya, e.g. South Africa).
2. Open **SQL Editor → New Query**, paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and **Run**.
   This creates `articles`, `schedule`, `reports`, `settings`, `app_users`, `brief_items` with RLS policies.
3. From **Project Settings → API** copy the Project URL, anon key and service_role key.

### 2. Clerk

1. Create an application at [clerk.com](https://clerk.com) (Email + Password recommended).
2. From **API Keys** copy the publishable key and secret key.

### 3. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_EMAIL=you@example.com
```

`ADMIN_EMAIL` bootstraps the first administrator automatically on first sign-in
(alternatively, insert a row into `app_users` with `role = 'admin'` manually).

### 4. Run locally

```bash
npm install --legacy-peer-deps
npm run dev
```

### 5. Deploy to Vercel

1. Push this repo to GitHub.
2. Vercel → **Add New → Project → Import** the repo (Next.js is auto-detected — no build settings needed).
3. Add **all** environment variables from step 3 in **Settings → Environment Variables**.
4. Deploy.

### 6. Make yourself admin & finish setup

- Sign in on the deployed site; if your email matches `ADMIN_EMAIL` you become admin automatically.
- Otherwise insert your Clerk user id into `app_users` (see `supabase/schema.sql` comments or the deployment guide).
- In **Admin → Settings**: paste your radio stream URL and YouTube channel ID.

## File Structure

```
├── app/
│   ├── admin/              # Admin dashboard (articles, schedule, reports, users, brief, settings)
│   ├── api/                # API routes: articles, schedule, reports, settings, users, brief
│   ├── article/[id]/       # Article detail page
│   ├── news/               # News listing + category filter + search
│   ├── listen/             # Radio Coast live page
│   ├── tv/                 # Coast TV page
│   ├── schedule/           # Programme schedule
│   ├── advertise/          # Advertising packages + enquiry form
│   ├── report/             # Public story submission
│   ├── about/              # About, team, contact
│   ├── privacy|terms|cookies/
│   ├── sign-in|sign-up/    # Clerk auth pages
│   ├── layout.tsx          # Root layout (ClerkProvider, header, footer, player, ticker)
│   ├── page.tsx            # Homepage
│   └── globals.css
├── components/             # Header, Footer, PlayerBar, BriefSlider, admin tabs
├── lib/                    # supabase clients, data helpers, admin identity, utils
├── types/                  # Shared TypeScript types
├── supabase/schema.sql     # Database schema (run in Supabase SQL Editor)
├── middleware.ts           # Clerk route protection for /admin
└── .env.local.example      # Environment template
```

## Security notes

- Never commit `.env.local` — it is gitignored.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only; never expose it client-side.
- Public reads use the anon key under Row Level Security; all admin mutations go through
  API routes that verify the Clerk session and the caller's role in `app_users`.

---

**The Coast Media Group** — Phone: +254 106 216 699 · Email: support@wedialai.com ·
WhatsApp: [Click to Chat](https://wa.me/254106216699) · Built by NexaFlow Digital
