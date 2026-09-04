# 🦚 Kanhaiyya

**Kanhaiyya** is a luxury devotional e-commerce platform dedicated to handcrafted **poshaks and sacred shringar** for **Thakurji, Shri Radha Rani, and Laddu Gopal**.

Blending the timeless heritage of **Vrindavan** with a modern editorial aesthetic, Kanhaiyya delivers a premium shopping experience for devotees around the world.

---

## ✨ Features

* 🛍️ Luxury devotional e-commerce experience
* 👑 Handcrafted Poshaks & Shringar collections
* 🦚 Dedicated collections for Thakurji, Radha Rani & Laddu Gopal
* 🔐 Secure authentication with Firebase
* 💳 Online payment integration
* 📦 Order & inventory management
* ⚡ Fast, SEO-friendly storefront
* 🎨 Editorial luxury-focused UI
* 🎥 YouTube storytelling for product categories
* 📱 Fully responsive design
* 🚀 Automated CI/CD with GitHub Actions

---

## 🏛️ Project Architecture

Kanhaiyya follows a **decoupled monorepo architecture**, designed for performance, SEO, maintainability, and future scalability.

```text
kanhaiyya/
│
├── frontend/                     # Next.js 15 - The "Atelier"
│   ├── src/
│   │   ├── app/                  # App Router, layouts & routes
│   │   ├── components/           # UI, features & shared components
│   │   ├── hooks/                # Reusable application logic
│   │   ├── lib/                  # Firebase, Stripe, Sanity, etc.
│   │   └── store/                # Zustand state management
│   │
│   └── public/                   # Product photography & brand assets
│
├── backend/                      # Node.js + Express - The "Engine"
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   ├── services/             # Business logic
│   │   ├── middleware/           # Authentication & security
│   │   └── repositories/         # Prisma data access
│   │
│   └── prisma/                   # Database schema & migrations
│
└── .github/                      # GitHub Actions CI/CD
```

---

## 🚀 Tech Stack

### 🎨 Frontend

| Technology        | Purpose                      |
| ----------------- | ---------------------------- |
| **Next.js 15**    | React framework & App Router |
| **React 19**      | UI & concurrent rendering    |
| **Tailwind CSS**  | Styling & responsive design  |
| **Framer Motion** | Editorial animations         |
| **Lucide**        | Icon system                  |
| **Zustand**       | Client-side state management |

### ⚙️ Backend

| Technology         | Purpose                   |
| ------------------ | ------------------------- |
| **Node.js**        | Backend runtime           |
| **Express.js**     | REST API                  |
| **TypeScript**     | Type safety               |
| **Prisma**         | ORM & database access     |
| **PostgreSQL**     | Relational database       |
| **Firebase Admin** | Authentication & identity |

### ☁️ Infrastructure

| Technology         | Purpose                  |
| ------------------ | ------------------------ |
| **Vercel**         | Frontend deployment      |
| **Docker**         | Backend containerization |
| **AWS App Runner** | Backend deployment       |
| **GitHub Actions** | CI/CD automation         |
| **Redis**          | Product catalog caching  |

---

## ⚙️ CI/CD Pipeline

Kanhaiyya uses a **Golden Path CI/CD pipeline** powered by GitHub Actions.

### 1. Code Quality

Triggered on every push and pull request.

* ESLint
* Prettier
* TypeScript type checking
* Vitest unit tests

### 2. Preview Environment

Every pull request automatically creates a **Vercel Preview Deployment** for testing before production.

### 3. Production

```text
GitHub
   │
   ▼
Pull Request
   │
   ├── ESLint
   ├── TypeScript
   └── Vitest
   │
   ▼
Vercel Preview
   │
   ▼
Production
   │
   ├── Frontend → Vercel
   ├── Backend  → AWS App Runner
   └── Database → PostgreSQL
```

---

## 📦 Getting Started

### Prerequisites

Make sure you have the following installed:

* **Node.js 20+**
* **npm**
* **Docker**
* **PostgreSQL** or a PostgreSQL Docker container
* **Firebase Project**

---

### 1. Clone the Repository

```bash
git clone https://github.com/heygaurav22/Kanhaiyyaa.git

cd Kanhaiyyaa
```

---

### 2. Backend Setup

```bash
cd backend

npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Add your required environment variables:

```env
DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend

npm install
```

Create the local environment file:

```bash
cp .env.local.example .env.local
```

Add your frontend configuration:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
```

Start the development server:

```bash
npm run dev
```

The application will now be available locally.

---

## 🎨 Editorial Design System

Kanhaiyya follows a carefully designed **luxury devotional aesthetic**.

### 🖼️ Imagery

Product photography should follow:

* `.avif` format
* **3:4 aspect ratio**
* High-resolution photography
* Consistent lighting
* Clean product presentation

### ✍️ Typography

**Headings**

> Cinzel — Serif

**Body**

> Inter — Sans-serif

### 🎥 Storytelling

Every major product category can include a **YouTube Story component**, allowing customers to discover the craftsmanship and story behind the collection.

---

## 🛡️ Security & Performance

### 🔐 Authentication

* Firebase Authentication
* Secure server-side verification
* JWT-based authorization
* Protected API routes

### 🖼️ Image Optimization

Next.js `Image` is used for optimized image delivery with support for responsive image sizing and modern formats.

### ⚡ Caching

Redis can be used to cache frequently accessed product catalogs and reduce database load.

### 🔎 SEO

Product pages support dynamic:

* Metadata
* Open Graph information
* JSON-LD structured data
* Search-engine-friendly URLs

---

## 📱 Responsive Design

Kanhaiyya is designed to provide a consistent experience across:

```text
Desktop
   ↓
Laptop
   ↓
Tablet
   ↓
Mobile
```

The storefront adapts layouts, typography, imagery, navigation, and interactions based on screen size.

---

## 🗺️ Roadmap

* [x] Luxury storefront
* [x] Product catalog
* [x] Responsive UI
* [x] Authentication
* [ ] Complete payment pipeline
* [ ] Advanced inventory management
* [ ] Order tracking
* [ ] Customer dashboard
* [ ] Wishlist
* [ ] Personalized recommendations
* [ ] Admin dashboard
* [ ] Advanced analytics
* [ ] International shipping

---

## 🤝 Contributing

Contributions, ideas, and improvements are welcome.

```bash
# Fork the repository

# Create a feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -m "feat: add your feature"

# Push your branch
git push origin feature/your-feature
```

Then open a Pull Request.

---

## 📄 License

© 2026 **Kanhaiyya**. All rights reserved.

Built with devotion.
Crafted with precision.
Inspired by Vrindavan. 🦚

---

<p align="center">
  <strong>🦚 KANHAIYYA</strong>
  <br>
  <sub>Where devotion meets craftsmanship.</sub>
</p>
