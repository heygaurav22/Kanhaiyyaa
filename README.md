Kanhaiyya — The Divine Atelier
Kanhaiyya is a luxury devotional e-commerce platform dedicated to handcrafted poshaks and sacred shringar for Thakurji, Shri Radha Rani, and Laddu Gopal. Merging the timeless heritage of Vrindavan with a modern editorial aesthetic, the platform provides a high-end shopping experience for the global devotee community.
![Image](https://img.shields.io/badge/Pipeline-GitHub%20Actions-blueviolet)
![Image](https://img.shields.io/badge/Stack-Next.js%2015%20%7C%20Express%20%7C%20Prisma-black)
![Image](https://img.shields.io/badge/UI-Tailwind%20%2B%20Framer%20Motion-gold)
🏛 Project Architecture
Kanhaiyya uses a Decoupled Monorepo structure optimized for performance, SEO, and scalability.
code
# Text
kanhaiyya/
├── frontend/                 # Next.js 15 (App Router) - The "Atelier" UI
│   ├── src/
│   │   ├── app/              # Server Components, PPR Routes, Layouts
│   │   ├── components/       # Atomic design (UI/Features/Shared)
│   │   ├── hooks/            # Logic-reused (useCart, useSacredAuth)
│   │   ├── lib/              # SDK Initializations (Firebase, Stripe, Sanity)
│   │   └── store/            # State Management (Zustand)
│   └── public/               # High-res photography & Brand assets
├── backend/                  # Node.js + Express + Prisma - The "Engine"
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic (Order processing, Tax)
│   │   ├── middleware/       # JWT/Firebase validation, Security headers
│   │   └── repositories/     # Type-safe Prisma data access
│   └── prisma/               # Schema definitions & Migrations
└── .github/                  # CI/CD Pipeline definitions
# Tech Stack
Frontend (The Storefront)
Next.js 15 (App Router): Utilizing Partial Prerendering (PPR) for instant page loads.
React 19: Leveraging the latest Concurrent Rendering features.
Tailwind CSS: Custom theme built on a "Sacred Palette" (Gold, Crimson, Ivory).
Framer Motion: Smooth, editorial transitions for luxury feel.
Lucide Icons: Minimalist, clean iconography.
Backend (The Core)
Express.js & TypeScript: Type-safe RESTful API.
Prisma ORM: High-performance database mapping and migrations.
PostgreSQL: Relational data for complex inventory and order history.
Firebase Admin: Secure authentication via Google One Tap.
⚙️ CI/CD Pipeline
The project implements a "Golden Path" pipeline using GitHub Actions to ensure zero-downtime and high code quality.
Code Quality (Push/PR):
ESLint & Prettier for style consistency.
TypeScript type-checking.
Vitest for business logic unit tests.
Staging:
Automatic deployment to a Vercel Preview environment for every PR.
Production:
Frontend: Deployed to Vercel Edge Network.
Backend: Containerized via Docker and deployed to AWS App Runner.
Database: Prisma migrations run automatically on release.

# 📦 Getting Started
1. Prerequisites
Node.js v20+
Docker (for local DB)
Firebase Project Credentials
2. Backend Setup
code
Bash
cd backend
npm install
cp .env.example .env # Add your DATABASE_URL and FIREBASE_KEYS
npx prisma migrate dev
npm run dev
3. Frontend Setup
code
Bash
cd frontend
npm install
cp .env.local.example .env.local # Add NEXT_PUBLIC_API_URL
npm run dev
🎨 Editorial Guidelines
To maintain the Luxury Aesthetic:
Imagery: All product photos must be uploaded in .avif format with a 3:4 aspect ratio.
Typography: Headers use Cinzel (Serif), Body uses Inter (Sans-serif).
Storytelling: Every product category includes a YouTube Story component to showcase the artisan craft.
🛡 Security & Optimization
Auth: Stateless JWT verification combined with Firebase Identity Platform.
Images: Next.js Image component with Cloudinary loader for real-time resizing.
Caching: Redis-based caching for product catalogs to minimize DB load.
SEO: Dynamic JSON-LD structured data for every Poshak listing.
📜 License
© 2024 Kanhaiyya. All rights reserved. Built for the divine, crafted with precision.
Developed by the Kanhaiyya Engineering Team.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Express.js, TypeScript, Prisma ORM, PostgreSQL
- **Authentication**: JWT auth, Google One Tap & Firebase authentication
- **Media**: High-definition atelier photography and YouTube embedded storytelling

## Project Structure

```
├── frontend/             # Next.js 15 frontend application
│   ├── src/
│   │   ├── app/          # App router pages (Home, Categories, Product Detail, Cart, Checkout, Auth, Admin)
│   │   ├── components/   # Header, Footer, MegaMenu, ProductCard, GoogleOneTap
│   │   ├── lib/          # API helpers, Cart context, Auth context, Firebase config
│   │   └── types/        # TypeScript interfaces
│   └── public/           # Static assets, product photos, brand logo, favicon
├── backend/              # Node.js Express + Prisma backend
│   ├── prisma/           # Prisma schema & seed script with genuine product data
│   └── src/
│       ├── routes/       # Auth, Products, Categories, Cart, Orders, Reviews
│       └── middleware/   # JWT auth & error handling
└── asset/                # Original brand visual assets
```

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npx prisma db push
npm run db:seed
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to browse the store.
