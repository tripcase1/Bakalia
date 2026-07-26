# Al Hera Fresh - Enterprise E-Commerce Platform

![Al Hera Fresh](https://images.unsplash.com/photo-1534483509719-3feaee7c30da?q=80&w=1200&auto=format&fit=crop)

**Al Hera Fresh** is an enterprise-grade, mobile-first e-commerce web application engineered for high-scale organic produce retailing in Bangladesh. It specialises in 100% formalin-free Padma River Hilsa fish, deep-sea pomfret, Cox's Bazar dry fish, Rajshahi Katimon mangoes, and wild Sundarban raw honey.

---

## 🚀 Key Features

### 🛒 Customer Experience & UI/UX
- **Mobile-First Apple & Shopify Aesthetic**: Clean, responsive layout with glassmorphic sticky headers and dark mode accents.
- **Micro-Animations & Micro-Interactions**: Framer Motion transitions, cart count spring animations, image zoom gallery, and video preview modals.
- **Bilingual Localization (Bangla & English)**: Real-time i18n switcher for seamless access in Bangla and English.
- **Localized Payments (Bangladesh MFS)**: Native support for **bKash**, **Nagad**, **Rocket**, and **Cash on Delivery (COD)**.
- **Bangladeshi Address Cascade**: Division, District, and Upazila selection dropdowns.
- **Product Variants & Video Showcase**: Multi-size variant selector (e.g. 500g, 1kg, 1.5kg) with instant price calculation and YouTube/Cloudinary product video modal.
- **Wishlist & Cart Drawer**: Slide-over cart drawer with live promo code validation (`ALHERAFRESH10` for 10% discount).
- **Printable Invoices**: Printable order receipts with unique order tracking numbers.

### 🛡️ Admin & Control Panel
- **Business Analytics Dashboard**: Interactive **Recharts** area charts showing daily sales revenue vs order volumes.
- **KPI Summary Cards**: Live tracking of weekly revenue, total order count, low-stock warnings, and registered customers.
- **Product Inventory Management**: CRUD data table for active product SKUs and stock counts.
- **Role-Based Access Control (RBAC)**: Support for `ADMIN`, `MANAGER`, `DELIVERY_AGENT`, and `CUSTOMER`.

### 🔍 Advanced SEO & Performance
- **Dynamic Metadata & OpenGraph**: Tailored OpenGraph and Twitter Card social media sharing cards.
- **JSON-LD Structured Data**: Embedded `OnlineStore` and `Product` schemas for rich search engine snippets.
- **Automated Sitemap & Robots**: Next.js dynamic `sitemap.ts` and `robots.ts`.
- **PWA Support**: Web App Manifest (`manifest.json`) for installation on mobile devices.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **State Management** | Zustand |
| **Analytics & Charts** | Recharts |
| **Backend API** | NestJS, TypeScript, Express |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Storage & Caching** | Cloudinary, Redis |
| **Form & Validation** | React Hook Form, Zod |
| **CI/CD & Deployment**| GitHub Actions, Vercel (Frontend), Docker / VPS (Backend) |

---

## 💻 Local Development Setup

### Prerequisites
- Node.js >= 20.x
- Docker & Docker Compose (optional, for local Postgres & Redis)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/al-hera-fresh.git
cd al-hera-fresh

# Install Frontend dependencies
cd apps/frontend
npm install

# Install Backend dependencies
cd ../backend
npm install
```

### 2. Start PostgreSQL & Redis Services
```bash
docker-compose up -d
```

### 3. Setup Database Schema & Seed Data
```bash
# Push Prisma Schema to PostgreSQL
npx prisma db push

# Seed Initial Fresh Products & Categories
npx prisma db seed
```

### 4. Run Development Servers
```bash
# Start Next.js Frontend
cd apps/frontend
npm run dev

# Start NestJS Backend API
cd apps/backend
npm run start:dev
```
- Frontend Web App: `http://localhost:3000`
- Admin Dashboard: `http://localhost:3000/admin`
- Backend API: `http://localhost:4000`

---

## 🌐 Production Deployment Guide

### Vercel Deployment (Frontend)
1. Push repository to GitHub.
2. Import `apps/frontend` project into Vercel Dashboard.
3. Configure Environment Variables:
   - `NEXT_PUBLIC_SITE_URL`: `https://alherafresh.com`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`: `G-XXXXXXXXXX`
4. Deploy.

### VPS Docker Deployment (Backend & Database)
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Google Search Console Setup
1. Claim domain `https://alherafresh.com` in Google Search Console.
2. Submit XML Sitemap link: `https://alherafresh.com/sitemap.xml`.
3. Verify rich snippets using Google's Rich Results Testing Tool.

---

## 📑 Production Release Checklist
- [x] Prisma PostgreSQL Database Schema & Migration Seeds
- [x] Next.js 15 App Router Frontend & Responsive Glassmorphic UI
- [x] Localized bKash / Nagad / Rocket / COD Payments
- [x] Product Variants, Images, & Video Preview Modal
- [x] Zustand Cart Drawer with Promo Discount Engine
- [x] Admin Control Panel with Recharts Analytics
- [x] Full SEO (JSON-LD, OpenGraph, Sitemap, Robots.txt)
- [x] PWA Manifest & Mobile Installation Readiness
- [x] GitHub Actions CI/CD Automated Build Workflow
