const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer for direct image upload from computer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'dress-' + uniqueSuffix + ext);
  }
});
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Direct Image Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: imageUrl, imageUrl: imageUrl, filename: req.file.filename });
});

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
      (p.sku && p.sku.toLowerCase().includes(q)) ||
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
  const rawId = `dg-${Date.now().toString().slice(-5)}`;
  const sku = req.body.sku || `AS-${Math.floor(1000 + Math.random() * 9000)}`;

  const newProduct = {
    id: rawId,
    sku: sku,
    title: req.body.title || 'Untitled Dress',
    category: req.body.category || 'Casual & Everyday',
    price: Number(req.body.price) || 499,
    mrp: Number(req.body.mrp) || (Number(req.body.price) ? Number(req.body.price) * 2 : 999),
    sizes: Array.isArray(req.body.sizes) && req.body.sizes.length ? req.body.sizes : ['Free Size'],
    colors: Array.isArray(req.body.colors) && req.body.colors.length ? req.body.colors : ['Pink'],
    inStock: req.body.inStock !== false,
    stockCount: Number(req.body.stockCount) || 10,
    featured: Boolean(req.body.featured),
    newArrival: req.body.newArrival !== undefined ? Boolean(req.body.newArrival) : true,
    badge: req.body.badge || (req.body.newArrival ? 'New Arrival' : ''),
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

  products[index] = { 
    ...products[index], 
    ...req.body, 
    id: req.params.id,
    price: req.body.price !== undefined ? Number(req.body.price) : products[index].price,
    mrp: req.body.mrp !== undefined ? Number(req.body.mrp) : products[index].mrp,
    stockCount: req.body.stockCount !== undefined ? Number(req.body.stockCount) : products[index].stockCount
  };
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
    id: `AS-${Math.floor(1000 + Math.random() * 9000)}`,
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
    source: req.body.source || 'Product Order Form',
    location: req.body.location || null,
    notes: req.body.notes || ''
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
  // Never expose admin password hash or secrets to public response
  const { adminPin, adminPinHash, ...safeSettings } = settings;
  res.json(safeSettings);
});

app.put('/api/settings', (req, res) => {
  const current = readData('settings.json', {});
  const { newAdminPin, adminPin, adminPinHash, ...updates } = req.body;

  if (newAdminPin && String(newAdminPin).trim().length >= 4) {
    updates.adminPinHash = crypto.createHash('sha256').update(String(newAdminPin).trim()).digest('hex');
  }

  const updated = { ...current, ...updates };
  writeData('settings.json', updated);
  const { adminPin: p, adminPinHash: h, ...safeSettings } = updated;
  res.json(safeSettings);
});

// --- ADMIN AUTH (SECURE SERVER-SIDE HASH VERIFICATION) ---
// Secure default hash for 112233:
const DEFAULT_PIN_HASH = 'e0bc60c82713f64ef8a57c0c40d02ce24fd0141d5cc3086259c19b1e62a62bea';

app.post('/api/admin/login', (req, res) => {
  const { pin } = req.body;
  if (!pin) {
    return res.status(400).json({ success: false, error: 'Please enter your Admin PIN' });
  }

  const settings = readData('settings.json', {});
  const expectedHash = settings.adminPinHash || DEFAULT_PIN_HASH;
  const inputHash = crypto.createHash('sha256').update(String(pin).trim()).digest('hex');

  if (inputHash === expectedHash) {
    const token = 'dg-adm-' + crypto.randomBytes(16).toString('hex');
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, error: 'Incorrect Admin PIN. Please try again.' });
  }
});

// --- SERVE PRODUCTION BUILD IF EXISTS ---
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Dress Gallery Backend Server running on port ${PORT}`);
});
