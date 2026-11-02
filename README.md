# YUOSSEF LAB

A bilingual (Arabic / English) portfolio website with a private project dashboard.

## Stack
- Next.js + TypeScript
- Tailwind CSS
- Supabase Auth + Postgres + Row Level Security

## 1. Requirements
Install Node.js 20.9 or newer. You will also need a free Supabase project.

## 2. Install
```bash
npm install
```

## 3. Configure Supabase
1. Create a project at https://supabase.com.
2. Open **Project Settings → API** and copy the Project URL and anon/public key.
3. Copy `.env.example` to `.env.local`.
4. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. In Supabase, open **SQL Editor**, paste all of `supabase/schema.sql`, and run it.
6. In **Authentication → Users**, create your own admin user with your email and a strong password.
7. Copy that user's UUID, then run this in SQL Editor:
```sql
insert into public.admins (user_id) values ('PASTE-YOUR-USER-UUID-HERE');
```
This step is important: only user IDs in `public.admins` can add, edit or delete projects. Do not put a service-role key in this app.

## 4. Run locally
```bash
npm run dev
```
Open http://localhost:3000 for the portfolio and http://localhost:3000/admin for the dashboard.

## 5. Add projects
Sign in at `/admin`. Fill in the project title and description in both languages, category, image URL, and optional live demo / GitHub links. Uncheck Published to save a draft that visitors cannot see.

## 6. Deploy
Push the project to GitHub and import it into Vercel. Add the same two environment variables in Vercel's project settings, then deploy.

## Notes
- Images are currently added using public image URLs. Supabase Storage can be added later for direct uploads.
- Replace `hello@yuosseflab.com` in `app/page.tsx` with your real contact email.
- The site is a starter implementation. Configure your Supabase project and admin user before expecting dashboard data to work.
