# Searchfunder 3.0 - Setup & Run Guide

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** or **pnpm**
- **Supabase Account** (free tier works)

## Step 1: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API** to get your credentials:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public Key

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Example:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `supabase_schema.sql`
4. Run the SQL script to create all tables, policies, and triggers

This will create:
- Profiles table
- Deals & Deal Access tables
- Posts, Comments, Likes tables
- Groups & Group Members tables
- Subscriptions table
- Row Level Security (RLS) policies
- Triggers for auto-updating timestamps

## Step 5: Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
app/
├── (auth)/          # Authentication pages (login, register)
├── api/             # API routes
├── components/      # Reusable components
├── dashboard/       # Dashboard page
├── groups/          # Groups feature
├── messages/        # Messaging feature
├── posts/           # Posts and comments
├── profile/         # User profiles
└── resources/       # Resources page

lib/
├── supabaseClient.ts    # Client-side Supabase client
└── supabaseServer.ts    # Server-side Supabase client

types/
└── database.ts          # TypeScript types for database
```

## Troubleshooting

### Error: Missing Supabase environment variables
- Make sure `.env.local` exists in the root directory
- Verify the variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the dev server after creating/modifying `.env.local`

### Database errors
- Ensure you've run the `supabase_schema.sql` script in your Supabase SQL Editor
- Check that Row Level Security (RLS) is enabled on all tables
- Verify your Supabase project is active

### Port already in use
- Change the port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

## Next Steps

1. Register a new user account
2. Complete your profile
3. Explore the dashboard, groups, and posts features
4. Check out the deals marketplace functionality


