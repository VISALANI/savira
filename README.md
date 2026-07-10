# SAVIRA ATTIRES — Full Stack Ecommerce Platform

> Premium Indian Ethnic Women's Clothing Brand

 vercel -https://savira.vercel.app/

## Project Structure

```
savira-attires/
├── savira-frontend/     # Next.js 14 + Tailwind CSS
└── savira-backend/      # Node.js + Express + MongoDB
```

---

## Frontend Setup

```bash
cd savira-frontend
npm install
cp .env.local.example .env.local   # fill in your keys
npm run dev
```

### Environment Variables (`.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number with country code |

---

## Backend Setup

```bash
cd savira-backend
npm install
cp .env.example .env   # fill in your keys
npm run dev
```

### Environment Variables (`.env`)
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLIENT_URL` | Frontend URL (for CORS) |

---

## Deployment

### Frontend → Vercel
1. Push `savira-frontend` to GitHub
2. Import in Vercel, set environment variables
3. Deploy

### Backend → Render
1. Push `savira-backend` to GitHub
2. Create Web Service on Render
3. Set environment variables from `render.yaml`
4. Deploy

---

## Features

- **Homepage** — Hero banner, categories, new arrivals, festive collection, testimonials
- **Shop** — Filters (size, color, fabric, price, category), sorting, search
- **Product Page** — Image zoom, size/color selection, add to cart, wishlist, WhatsApp inquiry
- **Cart & Checkout** — Coupon codes, Razorpay + COD, address management
- **Auth** — JWT register/login, profile, order history, wishlist
- **Order Tracking** — Real-time status steps
- **Admin Panel** — Dashboard analytics, product CRUD, order management, coupon system
- **Mobile-First** — Sticky bottom nav, WhatsApp button, swipeable galleries
- **SEO** — Meta tags, OpenGraph, image optimization

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, React, Tailwind CSS, Zustand |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT |
| Payments | Razorpay (UPI, Cards, Netbanking, COD) |
| Images | Cloudinary |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## Admin Access

Create an admin user by setting `isAdmin: true` in MongoDB, or seed via:

```js
// In MongoDB Atlas or mongosh
db.users.updateOne({ email: "admin@savira.com" }, { $set: { isAdmin: true } })
```

Then login at `/login` and you'll be redirected to `/admin`.

---

*SAVIRA ATTIRES — Grace Woven Beautifully* 🌸
