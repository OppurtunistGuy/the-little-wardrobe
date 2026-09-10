# The Little Wardrobe

A production-ready, mobile-first static and dynamic product catalog for modern fashion brands, featuring a dedicated, secure **Owner Admin Panel (`/admin`)** and **Supabase PostgreSQL & Storage** backend.

Designed to turn Instagram traffic into direct WhatsApp enquiries and sales through a lightweight, warm editorial experience.

---

## ✨ Features

### Public Storefront
- **Instagram-to-WhatsApp Funnel**: Deep links automatically pre-fill enquiries with product name, current price, and selected size (e.g. `Hi! I'm interested in the Floral Linen Co-ord Set priced at ₹1,599 in size S. Is this available?`).
- **Warm Editorial Aesthetic**: Muted sage accents, dusty blush secondary palette, soft beige card surfaces, and elegant Playfair Display typography.
- **Mobile-First Experience**: 2-column mobile catalog grid, touch-friendly image gallery, slide-over navigation drawer, and sticky bottom WhatsApp enquiry bar.
- **Dynamic Category Filtering**: Live client-side filtering across Co-ords, Dresses, Tops, and Bottoms.
- **Custom Credit**: *"Design & Built by Thinkable & Co — Vikas Patil"*.

### Owner Admin Panel (`/admin`)
- **Utilitarian & Work-Focused**: Clean dashboard with stat cards (Total Products, Published, Drafts, Sold Out).
- **Product Management**: Add, edit, duplicate, preview, and archive/restore silhouettes.
- **Single Source of Truth**: Updating a price or marking an item Sold Out automatically syncs across Home, Collection, Product Detail, and WhatsApp URLs.
- **Image Manager**: File upload with automatic client-side compression, direct URL support, primary image selection, and reordering.
- **Backup & Restore**: Export full catalog JSON snapshots and restore via safe schema validation with diff preview.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Vanilla CSS design tokens, Wouter routing, Lucide icons.
- **Backend / Database**: Supabase (PostgreSQL, Storage, Row Level Security, Auth).
- **Hosting**: Vercel, Netlify, or Cloudflare Pages.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/OppurtunistGuy/the-little-wardrobe.git
cd the-little-wardrobe
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` for the public catalog and `http://localhost:5173/admin` for the owner panel.

### 3. Production Build
```bash
npm run build
```

---

## 🗄️ Supabase Setup (Production Database & Storage)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the script located at:
   ```
   supabase/schema.sql
   ```
   This initializes tables (`products`, `product_images`, `settings`), indexes, RLS policies, and the `catalog-images` storage bucket.
3. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Create your owner account in **Supabase Auth → Users**.

---

## 📄 License

Private repository for The Little Wardrobe. All rights reserved.
Design & Built by Thinkable & Co — Vikas Patil.
