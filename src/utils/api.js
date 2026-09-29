// API helper with LocalStorage persistence fallback for offline or standalone resilience
import defaultProducts from './defaultProducts.json';

const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      localStorage.setItem('dg_cached_products', JSON.stringify(data));
      return data;
    } catch (err) {
      console.warn('Backend unavailable, using cached/fallback products', err.message);
      const cached = localStorage.getItem('dg_cached_products');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {}
      }
      localStorage.setItem('dg_cached_products', JSON.stringify(defaultProducts));
      return defaultProducts;
    }
  },

  async createProduct(productData) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const created = await res.json();
        return created;
      }
    } catch (err) {
      console.warn('Backend unavailable for createProduct, saving locally', err.message);
    }
    // Fallback to local persistence
    const current = await this.getProducts();
    const newId = `dg-${Date.now().toString().slice(-4)}`;
    const newProduct = {
      id: newId,
      sku: `AS-${Math.floor(100 + Math.random() * 900)}`,
      rating: 4.8,
      reviewsCount: 1,
      inStock: true,
      stockCount: 15,
      ...productData
    };
    const updated = [newProduct, ...current];
    localStorage.setItem('dg_cached_products', JSON.stringify(updated));
    return newProduct;
  },

  async updateProduct(id, productData) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend unavailable for updateProduct, saving locally', err.message);
    }
    const current = await this.getProducts();
    const index = current.findIndex(p => p.id === id);
    if (index !== -1) {
      current[index] = { ...current[index], ...productData };
      localStorage.setItem('dg_cached_products', JSON.stringify(current));
      return current[index];
    }
    return productData;
  },

  async deleteProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { 
        method: 'DELETE',
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend unavailable for deleteProduct, deleting locally', err.message);
    }
    const current = await this.getProducts();
    const filtered = current.filter(p => p.id !== id);
    localStorage.setItem('dg_cached_products', JSON.stringify(filtered));
    return { success: true };
  },

  // Orders
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (err) {}
    return JSON.parse(localStorage.getItem('dg_orders') || '[]');
  },

  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    // Local fallback
    const localOrders = JSON.parse(localStorage.getItem('dg_orders') || '[]');
    const newOrder = {
      id: `DG-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      ...orderData,
      orderStatus: 'Confirmed'
    };
    localOrders.unshift(newOrder);
    localStorage.setItem('dg_orders', JSON.stringify(localOrders));
    return newOrder;
  },

  async updateOrderStatus(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    const localOrders = JSON.parse(localStorage.getItem('dg_orders') || '[]');
    const idx = localOrders.findIndex(o => o.id === id);
    if (idx !== -1) {
      localOrders[idx] = { ...localOrders[idx], ...updates };
      localStorage.setItem('dg_orders', JSON.stringify(localOrders));
      return localOrders[idx];
    }
    return { success: true };
  },

  async trackOrder(query) {
    try {
      const res = await fetch(`${API_BASE}/orders/track?query=${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (err) {}
    const localOrders = JSON.parse(localStorage.getItem('dg_orders') || '[]');
    const q = query.trim().toLowerCase();
    return localOrders.filter(o => o.id.toLowerCase() === q || (o.customer && o.customer.phone && o.customer.phone.includes(q)));
  },

  // Inquiries
  async getInquiries() {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (err) {}
    return JSON.parse(localStorage.getItem('dg_inquiries') || '[]');
  },

  async createInquiry(inquiryData) {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    const localInq = JSON.parse(localStorage.getItem('dg_inquiries') || '[]');
    const newInq = {
      id: `INQ-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      ...inquiryData,
      status: 'New'
    };
    localInq.unshift(newInq);
    localStorage.setItem('dg_inquiries', JSON.stringify(localInq));
    return newInq;
  },

  async updateInquiryStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
  },

  // Direct Product Image Upload with Data URL fallback
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Backend upload unavailable, using base64 data url fallback', err.message);
    }
    // Client-side fallback: Convert file to base64 Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({ success: true, url: reader.result, imageUrl: reader.result, filename: file.name });
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  },

  // Settings
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/settings`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (err) {}
    const saved = localStorage.getItem('dg_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      storeName: "Dress Gallery",
      tagline: "Trendy Fashion • Quality • Comfort • Affordable Prices",
      subtitle: "Shiva Fashion",
      logoSubtitle: "Shiva Fashion",
      monogramInitials: "AS",
      customLogoUrl: "",
      themeColorPrimary: "#c85c7a",
      themeColorSoft: "#f8dfe7",
      themeColorGold: "#c9a45c",
      themeColorBg: "#fffaf5",
      themeColorDark: "#252126",
      fontHeading: "Playfair Display",
      fontBody: "Plus Jakarta Sans",
      orderWhatsAppNumber: "6369099224",
      whatsappNumber: "6369099224",
      whatsappInternal: "916369099224",
      announcement: "🌸 Welcome to Dress Gallery! Flat 10% OFF with code WELCOME100 • Free Delivery above ₹799 • Easy Direct WhatsApp Orders 🌸",
      freeShippingThreshold: 799,
      standardShippingFee: 70,
      upiId: "dressgallery@okaxis",
      supportEmail: "contact@dressgallery.in",
      enableLandingPage: true,
      enable3DHearts: true,
      landingHeadline: "Celebrate Feminine Grace & Trendy Style",
      landingTagline: "Curated collection of everyday elegance, designer dresses & comfortable loungewear crafted for you.",
      landingButtonText: "OPEN DRESS GALLERY",
      landingBgImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1920&q=85",
      heroImage: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80",
      heroBadge: "Shiva Fashion Collection",
      heroHeadline: "",
      heroSubtitle: "Curated women’s dresses and everyday outfits, crafted for comfort, style, and quality.",
      heroCardTitle: "The Blossom Edit",
      heroCardSubtitle: "Breathable silhouettes for everyday comfort"
    };
  },

  async updateSettings(settingsData) {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    const current = await this.getSettings();
    const updated = { ...current, ...settingsData };
    localStorage.setItem('dg_settings', JSON.stringify(updated));
    return updated;
  },

  // Admin Auth - Server first, offline PIN fallback (112233)
  async loginAdmin(pin) {
    const cleanPin = String(pin).trim();
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: cleanPin }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
      const data = await res.json().catch(() => ({}));
      if (data.error) return data;
    } catch (err) {
      console.warn('Backend auth unreachable, checking PIN locally', err.message);
    }
    // Fallback: Check default PIN 112233 or stored PIN
    const savedPin = localStorage.getItem('dg_admin_pin') || '112233';
    if (cleanPin === savedPin || cleanPin === '112233') {
      return { success: true, token: 'dg-adm-offline-' + Date.now() };
    }
    return { success: false, error: 'Incorrect Admin PIN. Please try again.' };
  }
};
