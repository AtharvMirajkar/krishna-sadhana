# Migration from Vite + Supabase to Next.js + MongoDB

This document outlines the changes made during the migration.

## What Changed

### Architecture
- **Before**: React + Vite with Supabase backend
- **After**: Next.js 14 with MongoDB backend

### File Structure Changes

#### New Files Created
- `app/` - Next.js App Router directory
  - `app/layout.tsx` - Root layout
  - `app/page.tsx` - Home page
  - `app/globals.css` - Global styles
  - `app/api/` - API routes
    - `app/api/mantras/route.ts` - GET mantras
    - `app/api/chanting-records/route.ts` - GET/POST chanting records
    - `app/api/stats/route.ts` - GET statistics

- `lib/` - Utilities (moved from `src/lib/`)
  - `lib/mongodb.ts` - MongoDB connection
  - `lib/models/` - TypeScript interfaces
  - `lib/utils.ts` - Helper functions

- `components/` - React components (moved from `src/components/`)
  - All components updated to use Next.js API routes

- `scripts/seed.ts` - Database seeding script

- `next.config.js` - Next.js configuration
- `next-env.d.ts` - Next.js TypeScript definitions

#### Files Updated
- `package.json` - Updated dependencies (Next.js, MongoDB, removed Supabase)
- `tsconfig.json` - Updated for Next.js
- `tailwind.config.js` - Updated content paths for Next.js
- `postcss.config.js` - Updated for Next.js

#### Old Files (Can be removed)
- `src/` - Old Vite source directory (kept for reference)
- `vite.config.ts` - Vite configuration (no longer needed)
- `index.html` - Vite entry point (Next.js uses app directory)
- `supabase/` - Supabase migrations (no longer needed)
- `tsconfig.app.json` - Vite TypeScript config (no longer needed)
- `tsconfig.node.json` - Vite TypeScript config (no longer needed)

## Database Changes

### Supabase → MongoDB
- **Tables** → **Collections**
  - `mantras` → `mantras` collection
  - `chanting_records` → `chanting_records` collection

### Schema Differences
- Supabase used UUIDs (`id: uuid`)
- MongoDB uses ObjectIds (`_id: ObjectId`)
- API responses convert `_id` to `id` string for compatibility

## API Changes

### Before (Supabase Client)
```typescript
const { data } = await supabase
  .from('mantras')
  .select('*');
```

### After (Next.js API Routes)
```typescript
const response = await fetch('/api/mantras');
const data = await response.json();
```

## Environment Variables

### Before
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### After
```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=krishna_devotee
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB connection string
```

3. Seed the database:
```bash
npm run seed
```

4. Run the development server:
```bash
npm run dev
```

## Next Steps

1. **Remove old files** (optional):
   - Delete `src/` directory
   - Delete `vite.config.ts`
   - Delete `index.html`
   - Delete `supabase/` directory
   - Delete `tsconfig.app.json` and `tsconfig.node.json`

2. **Set up MongoDB**:
   - Use local MongoDB or MongoDB Atlas
   - Update `.env.local` with your connection string

3. **Deploy**:
   - The app is now ready for deployment on Vercel, Netlify, or any Next.js-compatible platform
   - Make sure to set environment variables in your hosting platform

