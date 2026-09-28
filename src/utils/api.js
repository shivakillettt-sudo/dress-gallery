// API helper with LocalStorage persistence fallback for offline or standalone resilience

const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      localStorage.setItem('dg_cached_products', JSON.stringify(data));
      return data;
    } catch (err) {
      console.warn('Backend unavailable, reading from cache/fallback', err);
      const cached = localStorage.getItem('dg_cached_products');
      if (cached) return JSON.parse(cached);
      return [];
    }
  },

  async createProduct(productData) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error('Failed to create');
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async updateProduct(id, productData) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error('Failed to update');
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async deleteProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // Orders
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (err) {
      return JSON.parse(localStorage.getItem('dg_orders') || '[]');
    }
  },

  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Failed to place order');
      return await res.json();
    } catch (err) {
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
    }
  },

  async updateOrderStatus(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update order status');
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async trackOrder(query) {
    try {
      const res = await fetch(`${API_BASE}/orders/track?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Failed to track');
      return await res.json();
    } catch (err) {
      const localOrders = JSON.parse(localStorage.getItem('dg_orders') || '[]');
      const q = query.trim().toLowerCase();
      return localOrders.filter(o => o.id.toLowerCase() === q || (o.customer && o.customer.phone && o.customer.phone.includes(q)));
    }
  },

  // Inquiries
  async getInquiries() {
    try {
      const res = await fetch(`${API_BASE}/inquiries`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (err) {
      return JSON.parse(localStorage.getItem('dg_inquiries') || '[]');
    }
  },

  async createInquiry(inquiryData) {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData)
      });
      if (!res.ok) throw new Error('Failed to submit inquiry');
      return await res.json();
    } catch (err) {
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
    }
  },

  async updateInquiryStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/inquiries/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  },

  // Direct Product Image Upload
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to upload image');
    return await res.json();
  },

  // Settings
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch (err) {
      return {
        storeName: "Dress Gallery",
        tagline: "Trendy Fashion • Quality • Comfort • Affordable Prices",
        whatsappNumber: "6369099224",
        whatsappInternal: "919636909224",
        announcement: "🌸 Welcome to Dress Gallery! Flat 10% OFF with code WELCOME100 • Free Delivery above ₹799 • WhatsApp: 6369099224 🌸",
        freeShippingThreshold: 799,
        standardShippingFee: 70,
        upiId: "dressgallery@okaxis",
        supportEmail: "contact@dressgallery.in"
      };
    }
  },

  async updateSettings(settingsData) {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });
      return await res.json();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // Admin Auth - Strictly Server-side
  async loginAdmin(pin) {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: String(pin).trim() })
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, error: 'Could not connect to authentication server.' };
    }
  }
};
