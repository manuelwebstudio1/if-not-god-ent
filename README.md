# IF NOT GOD ENT — Premium E-Commerce Platform

Professional construction, engineering and industrial equipment storefront for Ghana.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** · **Framer Motion** · **Lucide Icons**
- **Zustand** (cart & wishlist) · **React Hook Form** · **Zod**
- **Prisma** + **PostgreSQL** (schema ready; local JSON store for orders/quotes without DB)
- **JWT sessions** (`jose` + `bcryptjs`) — compatible with Next.js 16

## Getting started

```bash
cd if-not-god-ent
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### WhatsApp & contact (central config)

Edit `src/config/site.ts` or environment variables:

- `NEXT_PUBLIC_WHATSAPP` — WhatsApp number (country code, no +)
- `NEXT_PUBLIC_PHONE` / `NEXT_PUBLIC_EMAIL`

### Admin access

Open `/admin/login` and sign in with:

- Email: `ADMIN_EMAIL` from `.env.local` (default `ifnotgod@ent.com`)
- Password: `ADMIN_PASSWORD` from `.env.local` (default `admin12345`)

Customer registration: `/account/register`

### Database (optional)

1. Set `DATABASE_URL` in `.env.local`
2. `npx prisma migrate dev`
3. Seed products from `src/data/*` into Prisma (extend as needed)

Until PostgreSQL is connected, orders and quotes persist to `data/local-db.json`.

### Payments

Checkout collects method selection and creates orders with `paymentStatus: PENDING`.
Implement providers in `src/lib/payments/` using server-only env keys (`PAYSTACK_SECRET_KEY`, etc.).

## Project structure

- `src/app/(site)/` — storefront pages
- `src/app/admin/` — admin dashboard
- `src/components/` — UI, layout, product, forms
- `src/data/` — catalog seed data
- `src/stores/` — cart & wishlist
- `prisma/schema.prisma` — full production schema

## Coupons (demo)

- `ING10` — 10% off
- `BUILD5` — 5% off

Built for **IF NOT GOD ENT** — *Building Excellence. Delivering Quality.*
