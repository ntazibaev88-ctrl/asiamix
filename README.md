# CodeOrda — Қазақша IT Білім Платформасы

Kazakh-language online education platform for IT courses. Built with Next.js 16, TypeScript, Tailwind CSS v4, and Supabase.

## Tech Stack

- **Framework**: Next.js 16.2.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (dark theme, CSS variables)
- **Backend**: Supabase (Auth, Database, Storage)
- **Notifications**: Sonner
- **Icons**: Lucide React

## Features

- Dark-only premium design (black + blue)
- Kazakh language UI throughout
- Course catalog: HTML, CSS, JavaScript
- Kaspi payment flow (screenshot upload + admin review)
- User dashboard with enrollment tracking
- Admin panel: users, courses, lessons, payments management
- Row Level Security (RLS) on all tables
- Mobile responsive

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Database Setup

1. Go to your Supabase project's SQL Editor
2. Run the contents of `supabase/schema.sql`
3. This will create all tables, RLS policies, and seed data (3 courses with 15 lessons each)

## Storage Setup

Create a Supabase Storage bucket named `payment-screenshots` with public access enabled.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Access

To make a user an admin, run in Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

Then visit `/admin` after logging in.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/courses` | Course listing |
| `/courses/[slug]` | Course detail + payment |
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | Password reset |
| `/dashboard` | User dashboard |
| `/admin` | Admin dashboard |
| `/admin/users` | User management |
| `/admin/courses` | Course management |
| `/admin/lessons` | Lesson management |
| `/admin/payments` | Payment approval |

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

Set environment variables in Vercel dashboard.
