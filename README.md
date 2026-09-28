# 🌸 Dress Gallery — Online Fashion Shopping & Admin Dashboard

> **“Trendy Fashion • Quality • Comfort • Affordable Prices”**

A modern, elegant, feminine, and mobile-first fashion e-commerce web application specifically built for **Dress Gallery**, featuring a customer-facing storefront and a secure store-owner admin dashboard.

---

## ✨ Key Features

### 🛍️ Customer Storefront
- **E-Commerce Catalog**: Browse dresses across *Trendy & Designer*, *Casual & Everyday*, *Nighties & Lounge*, and *Meesho Budget Finds Under ₹499*.
- **Feminine Luxury Design**: Custom color palette (Soft Pink, Cream, Beige, Gold, Deep Rose), Playfair Display serif typography, and smooth transitions.
- **Product Detail Modal**: Multi-photo gallery, interactive size selector (S, M, L, XL, XXL, Free Size), color swatches, live stock availability, and garment specifications.
- **Size Chart & Measuring Guide**: Garment bust, waist, hip, and length measurements with sizing tips.
- **Direct WhatsApp Ordering**: One-click order button that generates a pre-formatted message with dress name, photo, selected size, and address prompt.
- **Shopping Cart & Coupons**: Slide-in drawer with live free-shipping progress bar (orders over ₹799) and coupon engine (e.g. `WELCOME100`, `FASHION10`).
- **Checkout Flow**: Supports Cash on Delivery (COD) and Instant UPI QR Code scanning (`dressgallery@okaxis`) with celebratory confetti.
- **Live Order Tracking**: Search orders by Order ID (e.g. `DG-9041`) or customer mobile number with a visual 4-step progress timeline.
- **Wholesale & Reseller Portal**: Dedicated inquiry intake for Instagram sellers, boutique owners, and Meesho resellers.
- **Social Proof**: 5-star customer reviews, verified buyer feedback, and Instagram lookbook feed (`@dressgallery_fashion`).
- **Floating WhatsApp Assistant**: Quick access bubble on all pages.

### 🔐 Admin Dashboard
- **Secure PIN Access**: Fast passkey authentication (Default demo PIN: `1234`).
- **Overview & Analytics**: Live revenue tally, total orders, active catalog items, and reseller leads.
- **Dress Catalog Manager**: Add, edit, delete, or toggle availability of dresses with image previews, pricing, MRP, stock count, and promo badges.
- **Order Management**: Real-time order list with status updates (`Confirmed`, `Packed`, `Shipped`, `Delivered`, `Cancelled`), payment status tracking, and printable packing slip/invoice generator.
- **Wholesale Leads Manager**: Review reseller applications with direct WhatsApp chat links.
- **Store Configuration**: Update announcement bar, WhatsApp number, free shipping threshold, and admin PIN on the fly.

---

## 🚀 Getting Started

### 1. Run Development Server (Both Frontend & Backend)
```bash
npm run dev
```
- Storefront will run on: `http://localhost:3000`
- REST API Server runs on: `http://localhost:5000`

### 2. Run Production Server
```bash
npm run build
npm start
```
- Complete full-stack application served at: `http://localhost:5000`

---

## 🔑 Default Credentials & Demo Data

- **Admin Portal Access**: Click the lock icon in the top navbar or footer
- **Default Admin PIN**: `1234`
- **Sample Order for Tracking**: `DG-9041` or `DG-9038`
- **Coupons**: `WELCOME100` (₹100 off on ₹500+), `FASHION10` (10% off)
- **Persistent Data**: Stored in `server/data/` (`products.json`, `orders.json`, `inquiries.json`, `settings.json`)
