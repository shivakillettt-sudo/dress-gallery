# GEMINI.md — Dress Gallery Website & Admin Dashboard

## 1. Project Goal

Build a complete, production-ready **Dress Gallery** online fashion shopping website with a beautiful customer-facing storefront and a secure admin dashboard.

The website must be:
- Modern
- Elegant
- Feminine
- Premium-looking
- Mobile-first
- Fast and easy to use
- Simple enough for a non-technical business owner to manage
- Suitable for customers coming from Instagram, WhatsApp, and direct links

Do not create a generic template. Create a polished fashion-commerce experience specifically for **Dress Gallery**.

---

## 2. Business Information

### Business Name
**Dress Gallery**

### Business Description
Dress Gallery is a women’s fashion and dress business offering trendy, stylish, comfortable, and affordable dresses for everyday wear and special occasions.

The business provides a variety of fashionable designs and quality outfits for women, with a focus on:
- Modern styles
- Comfort
- Quality
- Budget-friendly prices
- Easy online ordering

### Brand Message
**“Trendy Fashion • Quality • Comfort • Affordable Prices”**

---

## 3. Products & Services

Dress Gallery offers:
- Women’s Dresses & Nighties
- Trendy & Designer Dresses
- Meesho Finds & Budget-Friendly Fashion
- Casual & Everyday Wear
- Stylish & Comfortable Outfits
- Ready-to-Order Fashion Products
- Online Dress Shopping
- Reselling & Bulk Orders

The product system is flexible so the admin can add, edit, or delete categories and products anytime.

---

## 4. Brand Guidelines

### Brand Personality
The brand feels:
- Modern
- Elegant
- Feminine
- Trendy
- Premium
- Friendly
- Trustworthy
- Affordable

### Color Direction & Design System
Primary visual palette:
- Soft Pink: `#f8dfe7`
- Deep Pink: `#c85c7a`
- Primary Rose: `#e8a0b5`
- Cream: `#fffaf5`
- Beige: `#f3e8dc`
- Subtle Gold: `#c9a45c`
- Dark Charcoal: `#252126`
- Muted Grey: `#756d72`
- Pure White: `#ffffff`

```css
:root {
  --primary-pink: #e8a0b5;
  --deep-pink: #c85c7a;
  --soft-pink: #f8dfe7;
  --cream: #fffaf5;
  --beige: #f3e8dc;
  --gold: #c9a45c;
  --dark: #252126;
  --muted: #756d72;
  --white: #ffffff;
}
```

---

## 5. Architecture & Tech Stack

- **Frontend**: React 18 with Vite, Tailwind CSS, Lucide React icons, and smooth transitions
- **Backend API**: Node.js & Express.js REST API with file-based persistent JSON/SQLite storage
- **State Management & Persistence**: Client-side synchronization with backend REST endpoints + localStorage fallback
- **Integrations**:
  - One-click WhatsApp Direct Ordering with pre-formatted product details and shipping info
  - Order tracking system by Order ID or Customer Mobile
  - Reseller / Bulk inquiry system
  - Admin authentication via secure passkey/PIN

---

## 6. Key Features

### A. Customer Storefront
1. **Header & Announcement Bar**: Promo ticker, search bar, currency (₹), wishlist counter, cart drawer trigger
2. **Hero Showcase**: High-impact feminine banners with dual CTAs ("Explore Collection" and "Order via WhatsApp")
3. **Featured Categories**: Quick filters for "Casual Wear", "Party & Designer", "Nighties & Lounge", "Meesho Specials", "Under ₹499"
4. **Product Catalog**:
   - Filter by Category, Price Range, Size (S, M, L, XL, XXL, Free Size), In-Stock status
   - Sort by Newest, Price Low-High, Price High-Low, Best Sellers
5. **Product Detail View**:
   - High-resolution image zoom & thumbnail selector
   - Discount badges (% off, MRP vs Selling Price)
   - Size & Color selection with visual feedback
   - "Order on WhatsApp" (opens WhatsApp with product photo, name, size & address prompt)
   - "Add to Cart" & "Buy Now"
6. **Cart & Checkout Drawer**:
   - Live price tally with auto-applied free shipping threshold
   - Coupon code engine (e.g. `WELCOME100`, `FASHION10`)
   - Direct WhatsApp Checkout button (sends full cart summary to store owner's WhatsApp)
   - Online Order Placement (Cash on Delivery or UPI QR code simulation)
7. **Reseller & Bulk Order Portal**:
   - Dedicated inquiry form for home resellers and boutique owners looking for wholesale lots
8. **Customer Reviews & Lookbook**:
   - Customer feedback badges, 5-star ratings, Instagram fashion lookbook gallery

### B. Admin Dashboard
1. **Protected Access**: Fast PIN/password login (Default PIN: `1234` or custom)
2. **Dashboard Overview**: Metrics on Total Sales, Total Orders, Active Catalog Items, Pending Inquiries
3. **Product Manager**:
   - Add new dress with Title, Category, Price, MRP, Sizes, Colors, Images, Description, Stock & Badges
   - Edit, delete, or toggle availability instantly
4. **Order Manager**:
   - Real-time orders list with customer phone, address, items, payment method, order total
   - Update statuses: `Pending` -> `Confirmed` -> `Shipped` -> `Delivered` -> `Cancelled`
   - Print packing slip / invoice preview
5. **Category & Banner Manager**:
   - Update homepage announcement bar text & hero promotional copy
6. **Bulk Reselling Requests**:
   - View contact details and requirement lists from potential resellers
7. **Store Settings**:
   - Set WhatsApp ordering phone number, Store address, Shipping fee threshold, UPI ID
