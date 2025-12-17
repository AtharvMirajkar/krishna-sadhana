# Krishna Bhakti App

A spiritual journey app for tracking mantra chanting and deepening devotion to Lord Krishna. Built with **Next.js 15** and MongoDB.

## ✨ Features

- **Mantra Library**: Browse and chant sacred Krishna mantras
- **Chanting Tracker**: Track your daily, weekly, and monthly chanting progress
- **Statistics**: View your chanting streak and detailed statistics
- **Dark Mode**: Beautiful dark/light theme support
- **Optimized Performance**: Built with Next.js 15 App Router for optimal performance

## 🚀 Tech Stack

- **Next.js 15.1.3** - Latest stable version with App Router
- **React 19** - Latest React version
- **MongoDB** - Database for storing mantras and chanting records
- **TypeScript 5.7** - Type-safe development
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 📋 Prerequisites

- Node.js 20.9+ (required for Next.js 15)
- MongoDB instance (local or MongoDB Atlas)

## 🛠️ Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd krishna
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=krishna_devotee
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=krishna_devotee
```

4. **Seed the database:**
```bash
npm run seed
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## 📁 Project Structure

```
krishna/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── mantras/
│   │   ├── chanting-records/
│   │   └── stats/
│   ├── mantras/           # Mantras page route
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── tracker/           # Tracker page route
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navigation.tsx
│   ├── MantraLibrary.tsx
│   ├── ChantingTracker.tsx
│   └── ThemeProvider.tsx
├── lib/                   # Utilities and models
│   ├── api.ts            # API client functions
│   ├── mongodb.ts        # MongoDB connection
│   ├── utils.ts          # Helper functions
│   └── models/           # TypeScript interfaces
└── scripts/              # Utility scripts
    └── seed.ts           # Database seed script
```

## 🔌 API Routes

The app includes the following Next.js API routes:

- `GET /api/mantras` - Get all mantras
- `GET /api/chanting-records` - Get chanting records (requires `user_id` query param)
- `POST /api/chanting-records` - Create/update a chanting record
- `GET /api/stats` - Get user statistics (requires `user_id` query param)

## 🎯 Key Features

### App Router Benefits
- **Server Components**: Faster initial page loads
- **Route-based Navigation**: Proper Next.js routing with Link components
- **Loading States**: Built-in loading.tsx for better UX
- **Error Boundaries**: Dedicated error.tsx for error handling
- **Metadata API**: SEO-friendly page metadata

### Code Organization
- **Centralized API Client**: All API calls in `lib/api.ts`
- **Type Safety**: Comprehensive TypeScript types
- **Reusable Components**: Well-structured component hierarchy
- **Optimized Performance**: useCallback hooks and proper React patterns

## 🏗️ Building for Production

```bash
npm run build
npm start
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run seed` - Seed database with sample mantras

## 🔧 Configuration

- **Next.js Config**: `next.config.js`
- **TypeScript Config**: `tsconfig.json`
- **Tailwind Config**: `tailwind.config.js`
- **ESLint Config**: Uses Next.js default ESLint config

## 📚 Documentation

- See `MIGRATION.md` for migration details from Vite + Supabase
- See `OPTIMIZATION.md` for optimization details and App Router structure

## 🐛 Troubleshooting

### TypeScript Errors
If you see TypeScript errors about Next.js modules, make sure you've run:
```bash
npm install
```

### MongoDB Connection Issues
- Verify your MongoDB URI is correct in `.env.local`
- Ensure MongoDB is running (if using local instance)
- Check network connectivity (if using MongoDB Atlas)

## 📄 License

MIT

---

Built with ❤️ for spiritual growth and devotion
