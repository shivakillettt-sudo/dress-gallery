const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(__dirname, 'data');

// Helper to read JSON
function readData(fileName, defaultVal = []) {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), 'utf-8');
      return defaultVal;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
    return defaultVal;
  }
}

// Helper to write JSON
function writeData(fileName, data) {
  try {
    const filePath = path.join(DATA_DIR, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err);
    return false;
  }
}

// --- PRODUCTS API ---
app.get('/api/products', (req, res) => {
  let products = readData('products.json', []);
  const { category, search, minPrice, maxPrice, sort } = req.query;

  if (category && category !== 'All') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.badge && p.badge.toLowerCase().includes(q))
    );
  }

  if (minPrice) {
    products = products.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    products = products.filter(p => p.price <= Number(maxPrice));
  }

  if (sort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const products = readData('products.json', []);
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const products = readData('products.json', []);
  const newProduct = {
    id: `dg-${Date.now().toString().slice(-5)}`,
    title: req.body.title || 'Untitled Dress',
    category: req.body.category || 'Casual & Everyday',
    price: Number(req.body.price) || 499,
    mrp: Number(req.body.mrp) || (Number(req.body.price) ? Number(req.body.price) * 2 : 999),
    sizes: Array.isArray(req.body.sizes) && req.body.sizes.length ? req.body.sizes : ['Free Size'],
    colors: Array.isArray(req.body.colors) && req.body.colors.length ? req.body.colors : ['Pink'],
    inStock: req.body.inStock !== false,
    stockCount: Number(req.body.stockCount) || 10,
    featured: Boolean(req.body.featured),
    badge: req.body.badge || '',
    fabric: req.body.fabric || 'Premium Fabric',
    description: req.body.description || '',
    images: Array.isArray(req.body.images) && req.body.images.length 
      ? req.body.images 
      : ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8,
    reviewsCount: 12
  };

  products.unshift(newProduct);
  writeData('products.json', products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const products = readData('products.json', []);
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  products[index] = { ...products[index], ...req.body, id: req.params.id };
  writeData('products.json', products);
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  let products = readData('products.json', []);
  const initialLength = products.length;
  products = products.filter(p => p.id !== req.params.id);
  if (products.length === initialLength) return res.status(404).json({ error: 'Product not found' });

  writeData('products.json', products);
  res.json({ success: true, message: 'Product deleted' });
});

// --- CATEGORIES ---
app.get('/api/categories', (req, res) => {
  const products = readData('products.json', []);
  const counts = {};
  products.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  const categories = [
    { name: 'All', count: products.length },
    { name: 'Trendy & Designer', count: counts['Trendy & Designer'] || 0, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80' },
    { name: 'Casual & Everyday', count: counts['Casual & Everyday'] || 0, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80' },
    { name: 'Nighties & Lounge', count: counts['Nighties & Lounge'] || 0, image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80' }
  ];

  res.json(categories);
});

// --- ORDERS API ---
app.get('/api/orders', (req, res) => {
  const orders = readData('orders.json', []);
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const orders = readData('orders.json', []);
  const newOrder = {
    id: `DG-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    customer: req.body.customer || {},
    items: req.body.items || [],
    subtotal: req.body.subtotal || 0,
    discount: req.body.discount || 0,
    shippingFee: req.body.shippingFee || 0,
    total: req.body.total || 0,
    paymentMethod: req.body.paymentMethod || 'Cash on Delivery',
    paymentStatus: req.body.paymentStatus || 'Pending',
    orderStatus: 'Confirmed',
    source: req.body.source || 'Website Checkout'
  };

  orders.unshift(newOrder);
  writeData('orders.json', orders);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', (req, res) => {
  const orders = readData('orders.json', []);
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (req.body.orderStatus) order.orderStatus = req.body.orderStatus;
  if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;

  writeData('orders.json', orders);
  res.json(order);
});

app.get('/api/orders/track', (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: 'Tracking query required' });

  const q = query.trim().toLowerCase();
  const cleanQ = q.replace(/[^0-9]/g, '');
  const orders = readData('orders.json', []);

  const matched = orders.filter(o => {
    const idMatch = o.id.toLowerCase() === q;
    const phoneClean = o.customer && o.customer.phone ? o.customer.phone.replace(/[^0-9]/g, '') : '';
    const phoneMatch = cleanQ.length >= 6 && phoneClean.includes(cleanQ);
    return idMatch || phoneMatch;
  });

  res.json(matched);
});

// --- INQUIRIES API (RESELLER / BULK) ---
app.get('/api/inquiries', (req, res) => {
  const inquiries = readData('inquiries.json', []);
  res.json(inquiries);
});

app.post('/api/inquiries', (req, res) => {
  const inquiries = readData('inquiries.json', []);
  const newInq = {
    id: `INQ-${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toISOString(),
    name: req.body.name,
    phone: req.body.phone,
    city: req.body.city,
    businessType: req.body.businessType || 'Reseller',
    monthlyVolume: req.body.monthlyVolume || 'Under 25 pieces',
    message: req.body.message || '',
    status: 'New'
  };

  inquiries.unshift(newInq);
  writeData('inquiries.json', inquiries);
  res.status(201).json(newInq);
});

app.put('/api/inquiries/:id/status', (req, res) => {
  const inquiries = readData('inquiries.json', []);
  const inq = inquiries.find(i => i.id === req.params.id);
  if (!inq) return res.status(404).json({ error: 'Inquiry not found' });

  inq.status = req.body.status || inq.status;
  writeData('inquiries.json', inquiries);
  res.json(inq);
});

// --- SETTINGS API ---
app.get('/api/settings', (req, res) => {
  const settings = readData('settings.json', {});
  // Don't expose adminPin in public response
  const { adminPin, ...safeSettings } = settings;
  res.json(safeSettings);
});

app.put('/api/settings', (req, res) => {
  const current = readData('settings.json', {});
  const updated = { ...current, ...req.body };
  writeData('settings.json', updated);
  const { adminPin, ...safeSettings } = updated;
  res.json(safeSettings);
});

// --- ADMIN AUTH ---
app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  const settings = readData('settings.json', { adminPin: '1234' });
  const validPin = settings.adminPin || '1234';

  if (pin === validPin) {
    res.json({ success: true, token: 'dg-admin-session-active' });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect Admin PIN. Default is 1234.' });
  }
});

// --- SERVE PRODUCTION BUILD IF EXISTS ---
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Dress Gallery Backend Server running on port ${PORT}`);
});
