import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  Users, 
  Settings as SettingsIcon, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  ArrowLeft, 
  Printer, 
  MessageCircle, 
  Search, 
  Check, 
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Tag,
  AlertCircle,
  Loader2
} from 'lucide-react';
import ASLogo from './ASLogo';
import { api } from '../utils/api';

export default function AdminDashboard({ onClose, onProductChange }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Modals & form states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Product Form State
  const [productForm, setProductForm] = useState({
    title: '',
    sku: '',
    category: 'Casual & Everyday',
    price: 499,
    mrp: 999,
    sizes: ['M', 'L', 'XL'],
    colors: ['Pink'],
    stockCount: 15,
    inStock: true,
    featured: false,
    newArrival: true,
    badge: 'New Arrival',
    fabric: 'Pure Cotton',
    description: '',
    images: []
  });

  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [settingsForm, setSettingsForm] = useState({});
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [orderFilter, setOrderFilter] = useState('All');
  const [productSearch, setProductSearch] = useState('');

  // Check existing session
  useEffect(() => {
    const session = sessionStorage.getItem('dg_admin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
      fetchAdminData();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await api.loginAdmin(pinInput);
      if (res && res.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('dg_admin_session', 'true');
        fetchAdminData();
      } else {
        setLoginError(res.error || 'Incorrect Admin PIN. Please try again.');
      }
    } catch (err) {
      setLoginError('Error connecting to authentication server');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dg_admin_session');
    setIsAuthenticated(false);
    setPinInput('');
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [prods, ords, inqs, sets] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getInquiries(),
        api.getSettings()
      ]);
      setProducts(prods || []);
      setOrders(ords || []);
      setInquiries(inqs || []);
      setSettings(sets || {});
      setSettingsForm(sets || {});
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  // --- DIRECT PRODUCT IMAGE UPLOAD FROM COMPUTER ---
  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await api.uploadImage(file);
      if (result && result.url) {
        setProductForm(prev => ({
          ...prev,
          images: [result.url, ...(prev.images || []).filter(img => img !== result.url)]
        }));
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Failed to upload image. Please ensure the file is an image under 15MB.');
    } finally {
      setUploadingImage(false);
    }
  };

  // --- PRODUCT MANAGEMENT ---
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    const newSku = `AS-${Math.floor(100 + Math.random() * 900)}`;
    setProductForm({
      title: '',
      sku: newSku,
      category: 'Casual & Everyday',
      price: 499,
      mrp: 999,
      sizes: ['M', 'L', 'XL'],
      colors: ['Pink'],
      stockCount: 15,
      inStock: true,
      featured: false,
      newArrival: true,
      badge: 'New Arrival',
      fabric: 'Pure Cotton',
      description: 'Comfortable and stylish outfit for women.',
      images: []
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p) => {
    setEditingProduct(p);
    setProductForm({
      ...p,
      sku: p.sku || `AS-${Math.floor(100 + Math.random() * 900)}`,
      newArrival: p.newArrival !== undefined ? p.newArrival : true,
      sizes: p.sizes || ['Free Size'],
      colors: p.colors || ['Default'],
      images: p.images || []
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title.trim()) {
      alert('Please enter a product title');
      return;
    }

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productForm);
      } else {
        await api.createProduct(productForm);
      }
      setIsProductModalOpen(false);
      fetchAdminData();
      if (onProductChange) onProductChange();
    } catch (err) {
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      fetchAdminData();
      if (onProductChange) onProductChange();
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const handleToggleStock = async (p) => {
    try {
      await api.updateProduct(p.id, { inStock: !p.inStock });
      fetchAdminData();
      if (onProductChange) onProductChange();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (p) => {
    try {
      await api.updateProduct(p.id, { featured: !p.featured });
      fetchAdminData();
      if (onProductChange) onProductChange();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleNewArrival = async (p) => {
    try {
      await api.updateProduct(p.id, { newArrival: !p.newArrival });
      fetchAdminData();
      if (onProductChange) onProductChange();
    } catch (err) {
      console.error(err);
    }
  };

  // --- ORDER MANAGEMENT ---
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, { orderStatus: status });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateInquiryStatus = async (id, status) => {
    try {
      await api.updateInquiryStatus(id, status);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // --- SETTINGS MANAGEMENT ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.updateSettings(settingsForm);
      setSettings(settingsForm);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } catch (err) {
      alert('Error saving settings');
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'Confirmed' || o.orderStatus === 'Pending').length;
  const newInquiriesCount = inquiries.filter(i => i.status === 'New').length;

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'All') return true;
    return o.orderStatus?.toLowerCase() === orderFilter.toLowerCase();
  });

  const filteredProducts = products.filter(p => {
    const q = productSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || 
           p.category.toLowerCase().includes(q) ||
           (p.sku && p.sku.toLowerCase().includes(q));
  });

  // --- PIN LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-brand-dark/85 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-brand-pink/30 text-center animate-scaleIn">
          
          {/* AS Monogram Logo */}
          <div className="mb-4 flex justify-center">
            <ASLogo size="lg" showText={false} />
          </div>

          <h2 className="font-serif text-2xl font-bold text-brand-dark">Dress Gallery</h2>
          <p className="text-xs text-brand-muted mt-0.5">Secure Store Owner Admin Portal</p>
          <p className="text-[11px] text-brand-deep font-semibold mt-1">Enter your Admin PIN</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              maxLength="8"
              autoFocus
              placeholder="••••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full text-center text-2xl tracking-[0.5em] font-mono py-3 bg-brand-cream border border-brand-pink/40 rounded-2xl focus:outline-none focus:border-brand-deep"
            />

            {loginError && (
              <p className="text-xs text-rose-600 font-semibold">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-brand-deep hover:bg-brand-deep/90 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition"
            >
              Unlock Admin Portal
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-brand-pink/20">
            <button
              onClick={onClose}
              className="text-xs text-brand-muted hover:text-brand-dark underline"
            >
              ← Back to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- AUTHENTICATED DASHBOARD ---
  return (
    <div className="fixed inset-0 z-50 bg-brand-cream overflow-hidden flex flex-col">
      
      {/* Top Header */}
      <header className="bg-white border-b border-brand-pink/20 px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <ASLogo size="sm" />
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Admin Active
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand-dark hover:text-brand-deep bg-brand-soft/70 px-3.5 py-1.5 rounded-xl transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Storefront</span>
          </button>

          <button
            onClick={handleLogout}
            className="text-xs text-brand-muted hover:text-rose-600 font-semibold px-2 py-1 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Nav */}
        <aside className="w-64 bg-white border-r border-brand-pink/20 p-4 flex flex-col justify-between hidden md:flex">
          <div className="space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-brand-deep text-white shadow-xs'
                  : 'text-brand-dark hover:bg-brand-soft/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'products'
                  ? 'bg-brand-deep text-white shadow-xs'
                  : 'text-brand-dark hover:bg-brand-soft/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>Manage Products</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === 'products' ? 'bg-white/30 text-white' : 'bg-brand-cream text-brand-muted'
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'orders'
                  ? 'bg-brand-deep text-white shadow-xs'
                  : 'text-brand-dark hover:bg-brand-soft/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ClipboardList className="w-4 h-4" />
                <span>Customer Orders</span>
              </div>
              {pendingOrders > 0 && (
                <span className="text-[10px] bg-amber-400 text-brand-dark font-extrabold px-1.5 py-0.5 rounded-full">
                  {pendingOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'inquiries'
                  ? 'bg-brand-deep text-white shadow-xs'
                  : 'text-brand-dark hover:bg-brand-soft/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Reseller Inquiries</span>
              </div>
              {newInquiriesCount > 0 && (
                <span className="text-[10px] bg-brand-pink text-brand-dark font-extrabold px-1.5 py-0.5 rounded-full">
                  {newInquiriesCount}
                </span>
              )}
            </button>

            {/* REQUIRED CLEARLY VISIBLE ADMIN SETTINGS SECTION */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'settings'
                  ? 'bg-brand-deep text-white shadow-xs'
                  : 'text-brand-dark bg-brand-soft/30 hover:bg-brand-soft border border-brand-pink/30'
              }`}
            >
              <SettingsIcon className="w-4 h-4 text-brand-gold" />
              <span>Admin Settings</span>
            </button>
          </div>

          <div className="p-3 bg-brand-cream rounded-2xl border border-brand-pink/20 text-xs text-brand-muted">
            <p className="font-bold text-brand-dark">Business WhatsApp:</p>
            <p className="font-mono text-[11px] text-brand-deep font-semibold mt-0.5">
              +91 {settings.whatsappNumber || '6369099224'}
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* Mobile Tab Selector */}
          <div className="flex md:hidden items-center gap-1 overflow-x-auto pb-3 mb-4 no-scrollbar">
            {['overview', 'products', 'orders', 'inquiries', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition ${
                  activeTab === tab ? 'bg-brand-deep text-white' : 'bg-white text-brand-dark'
                }`}
              >
                {tab === 'settings' ? 'Admin Settings' : tab}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-brand-pink/25 shadow-xs">
                  <div className="flex items-center justify-between text-brand-muted mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-brand-dark">₹{totalRevenue}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">Across all orders</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-brand-pink/25 shadow-xs">
                  <div className="flex items-center justify-between text-brand-muted mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                    <ClipboardList className="w-4 h-4 text-brand-deep" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-brand-dark">{orders.length}</p>
                  <p className="text-[10px] text-amber-600 font-semibold mt-1">{pendingOrders} awaiting delivery</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-brand-pink/25 shadow-xs">
                  <div className="flex items-center justify-between text-brand-muted mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Active Catalog</span>
                    <ShoppingBag className="w-4 h-4 text-brand-pink" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-brand-dark">{products.length}</p>
                  <p className="text-[10px] text-brand-muted mt-1">{products.filter(p => p.inStock).length} in stock</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-brand-pink/25 shadow-xs">
                  <div className="flex items-center justify-between text-brand-muted mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Reseller Leads</span>
                    <Users className="w-4 h-4 text-brand-gold" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-brand-dark">{inquiries.length}</p>
                  <p className="text-[10px] text-brand-deep font-semibold mt-1">{newInquiriesCount} new inquiries</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleOpenNewProduct}
                  className="bg-brand-deep hover:bg-brand-deep/90 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Product</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="bg-white hover:bg-brand-soft text-brand-dark border border-brand-pink/30 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2"
                >
                  <SettingsIcon className="w-4 h-4 text-brand-deep" />
                  <span>Open Admin Settings</span>
                </button>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl border border-brand-pink/25 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-brand-pink/15 flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-brand-dark">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-brand-deep hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-brand-cream/60 text-brand-muted uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-4">Order ID</th>
                        <th className="py-2.5 px-4">Customer</th>
                        <th className="py-2.5 px-4">Items</th>
                        <th className="py-2.5 px-4">Total</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-pink/10">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-brand-cream/30 transition">
                          <td className="py-3 px-4 font-mono font-bold text-brand-deep">{o.id}</td>
                          <td className="py-3 px-4">
                            <p className="font-bold text-brand-dark">{o.customer?.name}</p>
                            <p className="text-[10px] text-brand-muted">{o.customer?.phone}</p>
                          </td>
                          <td className="py-3 px-4 text-brand-muted">{o.items?.length || 0} dress(es)</td>
                          <td className="py-3 px-4 font-bold text-brand-dark">₹{o.total}</td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-soft text-brand-deep">
                              {o.orderStatus || 'Confirmed'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setSelectedOrderForInvoice(o)}
                              className="p-1 rounded text-brand-muted hover:text-brand-dark"
                              title="Print Slip"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGER (RULES 10 & 11) */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Search dress title, SKU, or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-white border border-brand-pink/30 rounded-xl py-2 pl-9 pr-3 text-xs text-brand-dark focus:outline-none focus:border-brand-deep"
                  />
                  <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
                </div>

                {/* REQUIRED PROMINENT '+ Add Product' BUTTON */}
                <button
                  onClick={handleOpenNewProduct}
                  className="bg-brand-deep hover:bg-brand-deep/90 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-brand-pink/25 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-brand-cream/60 text-brand-muted uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Dress & SKU</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price / MRP</th>
                        <th className="py-3 px-4">Availability</th>
                        <th className="py-3 px-4">Featured</th>
                        <th className="py-3 px-4">New Arrival</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-pink/10">
                      {filteredProducts.map(p => (
                        <tr key={p.id} className="hover:bg-brand-cream/20 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images?.[0] || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80'}
                                alt=""
                                className="w-10 h-12 object-cover rounded-lg bg-brand-cream border border-brand-pink/20"
                              />
                              <div>
                                <p className="font-bold text-brand-dark">{p.title}</p>
                                <span className="font-mono text-[10px] text-brand-deep bg-brand-soft/60 px-1.5 py-0.5 rounded">
                                  {p.sku || p.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-brand-cream text-brand-dark font-medium px-2 py-0.5 rounded text-[10px] border border-brand-pink/20">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-brand-dark">₹{p.price}</span>
                            <span className="text-[10px] text-brand-muted line-through ml-1.5">₹{p.mrp}</span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleStock(p)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition ${
                                p.inStock
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              }`}
                            >
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleFeatured(p)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                                p.featured
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {p.featured ? '★ Featured' : 'Normal'}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleNewArrival(p)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                                p.newArrival
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-500'
                              }`}
                            >
                              {p.newArrival ? 'New Arrival' : 'Standard'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 text-brand-dark hover:text-brand-deep hover:bg-brand-soft rounded-lg transition"
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-brand-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      orderFilter === st
                        ? 'bg-brand-deep text-white'
                        : 'bg-white text-brand-dark border border-brand-pink/30 hover:bg-brand-soft'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-brand-pink/25 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-pink/15 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-brand-deep bg-brand-soft/70 px-2 py-0.5 rounded-md">
                            {order.id}
                          </span>
                          <span className="text-xs text-brand-muted">
                            {new Date(order.createdAt).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] bg-brand-cream text-brand-dark px-2 py-0.5 rounded-full border border-brand-pink/20">
                            {order.source || 'Order Form'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={order.orderStatus || 'Confirmed'}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="bg-brand-cream border border-brand-pink/30 text-brand-dark font-bold text-xs rounded-xl px-2.5 py-1.5 focus:outline-none"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="p-1.5 bg-brand-soft hover:bg-brand-pink text-brand-dark rounded-xl transition"
                          title="Print Packing Slip"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <a
                          href={`https://wa.me/${order.customer?.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.customer?.name}! 🌸 Regarding your Dress Gallery order ${order.id}: Status is ${order.orderStatus}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-[#25D366]/20 hover:bg-[#25D366] text-emerald-800 hover:text-white rounded-xl transition"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="bg-brand-cream/40 p-3 rounded-xl border border-brand-pink/15 space-y-1">
                        <p className="font-bold text-brand-dark">Customer Delivery Details:</p>
                        <p className="text-brand-dark font-semibold">{order.customer?.name}</p>
                        <p className="text-brand-muted">{order.customer?.phone}</p>
                        <p className="text-brand-muted">{order.customer?.address}</p>
                        {order.location && (
                          <p className="text-[10px] text-emerald-700 font-mono mt-1">
                            📍 GPS: {order.location}
                          </p>
                        )}
                        {order.notes && (
                          <p className="text-[10px] italic text-brand-dark bg-white p-1 rounded border border-brand-pink/20 mt-1">
                            Note: "{order.notes}"
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <p className="font-bold text-brand-dark">Ordered Outfits:</p>
                        {order.items?.map((it, i) => (
                          <div key={i} className="flex items-center justify-between text-xs bg-brand-cream/30 p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              {it.image && <img src={it.image} alt="" className="w-8 h-10 object-cover rounded" />}
                              <div>
                                <p className="font-semibold text-brand-dark">{it.title}</p>
                                <p className="text-[10px] text-brand-muted">
                                  {it.sku ? `SKU: ${it.sku} | ` : ''}Size: {it.size || 'Free'} | Qty: {it.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-brand-dark">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-brand-pink/15 flex justify-between font-bold text-sm text-brand-dark">
                          <span>Total Amount:</span>
                          <span className="text-brand-deep">₹{order.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RESELLER LEADS */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-brand-dark">Wholesale & Reseller Inquiries</h3>
              <div className="space-y-3">
                {inquiries.length === 0 ? (
                  <p className="text-xs text-brand-muted">No wholesale inquiries yet.</p>
                ) : (
                  inquiries.map(inq => (
                    <div key={inq.id} className="bg-white p-5 rounded-2xl border border-brand-pink/25 shadow-xs space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-brand-pink/15 pb-2">
                        <div>
                          <span className="font-bold text-sm text-brand-dark">{inq.name}</span>
                          <span className="text-brand-muted ml-2">({inq.city})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={inq.status || 'New'}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                            className="bg-brand-cream border border-brand-pink/30 rounded-lg px-2 py-1 text-xs font-bold"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                          </select>
                          <a
                            href={`https://wa.me/${inq.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}! 🌸 Thank you for reaching out to Dress Gallery regarding wholesale reselling. Here is our catalogue.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>WhatsApp Reseller</span>
                          </a>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-brand-dark font-medium">
                        <p><strong>Phone:</strong> {inq.phone}</p>
                        <p><strong>Type:</strong> {inq.businessType}</p>
                        <p><strong>Volume:</strong> {inq.monthlyVolume}</p>
                        <p><strong>Date:</strong> {new Date(inq.createdAt).toLocaleDateString()}</p>
                      </div>

                      {inq.message && (
                        <div className="bg-brand-cream/50 p-2.5 rounded-xl border border-brand-pink/15 italic text-brand-dark">
                          "{inq.message}"
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ADMIN SETTINGS (RULE 9) */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              
              <div className="bg-white rounded-2xl border border-brand-pink/25 p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4 border-b border-brand-pink/15 pb-3">
                  <SettingsIcon className="w-5 h-5 text-brand-deep" />
                  <h3 className="font-serif font-bold text-lg text-brand-dark">Admin Settings</h3>
                </div>

                {settingsSaved && (
                  <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Settings saved successfully!
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  
                  {/* WhatsApp Business Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-brand-dark mb-1">
                        Business WhatsApp Display Number *
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber || '6369099224'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full bg-brand-cream/70 border border-brand-pink/30 rounded-xl p-2.5 font-bold"
                        placeholder="6369099224"
                      />
                      <p className="text-[10px] text-brand-muted mt-0.5">Displayed on website & order modals</p>
                    </div>

                    <div>
                      <label className="block font-bold text-brand-dark mb-1">
                        Internal WhatsApp Destination Number *
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappInternal || '919636909224'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappInternal: e.target.value })}
                        className="w-full bg-brand-cream/70 border border-brand-pink/30 rounded-xl p-2.5 font-mono"
                        placeholder="919636909224"
                      />
                      <p className="text-[10px] text-brand-muted mt-0.5">Used for wa.me/ destination</p>
                    </div>
                  </div>

                  {/* Announcement Bar Message */}
                  <div>
                    <label className="block font-bold text-brand-dark mb-1">Announcement Bar Message</label>
                    <textarea
                      rows="2"
                      value={settingsForm.announcement || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                      className="w-full bg-brand-cream/70 border border-brand-pink/30 rounded-xl p-2.5"
                    />
                  </div>

                  {/* Pricing Thresholds */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-brand-dark mb-1">Free Shipping Threshold (₹)</label>
                      <input
                        type="number"
                        value={settingsForm.freeShippingThreshold || 799}
                        onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                        className="w-full bg-brand-cream/70 border border-brand-pink/30 rounded-xl p-2.5 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-brand-dark mb-1">Standard Shipping Fee (₹)</label>
                      <input
                        type="number"
                        value={settingsForm.standardShippingFee || 70}
                        onChange={(e) => setSettingsForm({ ...settingsForm, standardShippingFee: Number(e.target.value) })}
                        className="w-full bg-brand-cream/70 border border-brand-pink/30 rounded-xl p-2.5"
                      />
                    </div>
                  </div>

                  {/* Store UPI ID */}
                  <div>
                    <label className="block font-bold text-brand-dark mb-1">Store UPI ID (For Instant QR Payments)</label>
                    <input
                      type="text"
                      value={settingsForm.upiId || 'dressgallery@okaxis'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                      className="w-full bg-brand-cream/70 border border-brand-pink/30 rounded-xl p-2.5"
                      placeholder="e.g. dressgallery@okaxis"
                    />
                  </div>

                  {/* Change Admin PIN (Secure Server-side Hashing) */}
                  <div className="pt-2 border-t border-brand-pink/15">
                    <label className="block font-bold text-brand-dark mb-1">
                      Change Admin PIN (Server-side Secure Hash)
                    </label>
                    <input
                      type="password"
                      maxLength="8"
                      value={settingsForm.newAdminPin || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, newAdminPin: e.target.value })}
                      className="w-full bg-brand-cream/70 border border-brand-pink/30 rounded-xl p-2.5 font-mono"
                      placeholder="Leave blank to keep existing PIN"
                    />
                    <p className="text-[10px] text-brand-muted mt-0.5">
                      New PIN will be securely hashed with SHA-256 on the backend.
                    </p>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="bg-brand-deep hover:bg-brand-deep/90 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-xs transition"
                    >
                      Save Admin Settings
                    </button>
                  </div>
                </form>
              </div>

              {/* Quick Catalog Overview inside Admin Settings */}
              <div className="bg-white rounded-2xl border border-brand-pink/25 p-5 shadow-xs">
                <h4 className="font-serif font-bold text-sm text-brand-dark mb-2">Category & Catalog Overview</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-brand-cream border border-brand-pink/20">
                    <p className="font-bold text-brand-deep">{products.filter(p => p.category === 'Trendy & Designer').length}</p>
                    <p className="text-[10px] text-brand-muted">Trendy & Designer</p>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-cream border border-brand-pink/20">
                    <p className="font-bold text-brand-deep">{products.filter(p => p.category === 'Casual & Everyday').length}</p>
                    <p className="text-[10px] text-brand-muted">Casual & Everyday</p>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-cream border border-brand-pink/20">
                    <p className="font-bold text-brand-deep">{products.filter(p => p.category === 'Nighties & Lounge').length}</p>
                    <p className="text-[10px] text-brand-muted">Nighties & Lounge</p>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-cream border border-brand-pink/20">
                    <p className="font-bold text-brand-deep">{products.filter(p => p.newArrival).length}</p>
                    <p className="text-[10px] text-brand-muted">New Arrivals</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* REQUIRED: DIRECT PRODUCT IMAGE UPLOAD FORM MODAL (RULE 10 & 11) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-xs" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden z-10 border border-brand-pink/30 my-auto p-6 max-h-[90vh] overflow-y-auto text-xs animate-scaleIn">
            
            <div className="flex items-center justify-between pb-3 border-b border-brand-pink/20">
              <h3 className="font-serif font-bold text-lg text-brand-dark">
                {editingProduct ? 'Edit Product Details' : '+ Add New Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 rounded text-brand-dark hover:bg-brand-soft">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4">
              
              {/* DIRECT IMAGE FILE UPLOAD FROM COMPUTER */}
              <div className="p-4 rounded-2xl bg-brand-cream/60 border border-brand-pink/30">
                <label className="block font-bold text-brand-dark mb-1.5">
                  Product Image — Direct File Upload from Computer <span className="text-rose-500">*</span>
                </label>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-brand-deep hover:bg-brand-deep/90 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition">
                    {uploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading from Computer...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>{productForm.images?.[0] ? 'Replace Image from Computer' : 'Select Image File'}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>

                  {productForm.images?.[0] && (
                    <div className="flex items-center gap-2.5">
                      <img
                        src={productForm.images[0]}
                        alt="Preview"
                        className="w-14 h-16 object-cover rounded-xl border border-brand-pink/30 shadow-xs"
                      />
                      <div>
                        <p className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                          ✓ Image Uploaded
                        </p>
                        <p className="text-[9px] text-brand-muted truncate max-w-[180px] mt-0.5">
                          {productForm.images[0]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-brand-muted mt-1.5">
                  Directly upload JPG, PNG, or WEBP from your local computer. Persisted safely on server.
                </p>
              </div>

              {/* Product Name */}
              <div>
                <label className="block font-bold text-brand-dark mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 font-medium"
                  placeholder="e.g. Lavender Tiered Floral Maxi Dress"
                />
              </div>

              {/* Product Code / SKU & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Product Code / SKU *</label>
                  <input
                    type="text"
                    required
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 font-mono font-bold"
                    placeholder="e.g. AS-115"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 font-medium"
                  >
                    <option>Casual & Everyday</option>
                    <option>Trendy & Designer</option>
                    <option>Nighties & Lounge</option>
                  </select>
                </div>
              </div>

              {/* Price, MRP & Stock Quantity */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: Number(e.target.value) })}
                    className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-bold text-brand-dark mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stockCount}
                    onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                    className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-brand-dark mb-1">Description</label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5"
                  placeholder="Fabric details, fit, styling tips, etc."
                />
              </div>

              {/* Fabric & Material */}
              <div>
                <label className="block font-bold text-brand-dark mb-1">Fabric & Material</label>
                <input
                  type="text"
                  value={productForm.fabric}
                  onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                  className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5"
                  placeholder="e.g. 100% Pure Combed Cotton"
                />
              </div>

              {/* Checkbox Toggles: Availability, Featured, New Arrival */}
              <div className="flex flex-wrap items-center gap-5 p-3 rounded-2xl bg-brand-cream/50 border border-brand-pink/20">
                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="rounded text-brand-deep focus:ring-brand-pink"
                  />
                  <span>Availability (In Stock)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="rounded text-brand-deep focus:ring-brand-pink"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold">
                  <input
                    type="checkbox"
                    checked={productForm.newArrival}
                    onChange={(e) => setProductForm({ 
                      ...productForm, 
                      newArrival: e.target.checked,
                      badge: e.target.checked ? 'New Arrival' : ''
                    })}
                    className="rounded text-brand-deep focus:ring-brand-pink"
                  />
                  <span>New Arrival</span>
                </label>
              </div>

              {/* Save Product Action */}
              <div className="pt-3 border-t border-brand-pink/20 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-brand-muted hover:bg-brand-cream font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-deep hover:bg-brand-deep/90 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PACKING SLIP INVOICE MODAL */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-xs" onClick={() => setSelectedOrderForInvoice(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 z-10 border border-brand-pink/30 my-auto animate-scaleIn text-xs">
            <div className="flex justify-between items-start border-b border-brand-pink/20 pb-4">
              <div>
                <ASLogo size="sm" />
                <p className="text-[10px] text-brand-muted mt-1">Packing Slip & Invoice</p>
              </div>
              <button onClick={() => setSelectedOrderForInvoice(null)} className="p-1 rounded hover:bg-brand-soft">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3 bg-brand-cream/40 p-4 rounded-2xl border border-brand-pink/20">
              <div className="flex justify-between font-bold">
                <span>Order: {selectedOrderForInvoice.id}</span>
                <span>Date: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <p className="font-bold text-brand-dark">Ship To:</p>
                <p>{selectedOrderForInvoice.customer?.name} ({selectedOrderForInvoice.customer?.phone})</p>
                <p>{selectedOrderForInvoice.customer?.address}</p>
                {selectedOrderForInvoice.location && (
                  <p className="text-[10px] text-emerald-700 font-mono">GPS: {selectedOrderForInvoice.location}</p>
                )}
              </div>
              <div className="border-t border-brand-pink/15 pt-2">
                <p className="font-bold mb-1">Items:</p>
                {selectedOrderForInvoice.items?.map((it, i) => (
                  <div key={i} className="flex justify-between text-[11px] py-0.5">
                    <span>{it.title} ({it.size || 'Free'}) x{it.quantity}</span>
                    <span className="font-bold">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-brand-pink/15 pt-2 flex justify-between font-bold text-sm">
                <span>Grand Total:</span>
                <span className="text-brand-deep">₹{selectedOrderForInvoice.total} ({selectedOrderForInvoice.paymentMethod})</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-brand-dark hover:bg-brand-deep text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
