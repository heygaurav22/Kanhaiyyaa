# Kanhaiyya

Luxury devotional e-commerce platform dedicated to handcrafted poshaks and sacred shringar for Thakurji, Shri Radha Rani, and Laddu Gopal. Inspired by Vrindavan heritage with modern editorial aesthetics.

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
