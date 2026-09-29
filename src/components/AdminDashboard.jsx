import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
  Palette,
  RefreshCw,
  Type,
  Sliders,
  ShieldCheck,
  Eye,
  Heart
} from 'lucide-react';
import ASLogo from './ASLogo';
import { api } from '../utils/api';
import { getWhatsAppOrderNumber } from '../utils/whatsapp';
import { 
  applyTheme, 
  COLOR_PRESETS, 
  AVAILABLE_HEADING_FONTS, 
  AVAILABLE_BODY_FONTS 
} from '../utils/theme';

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
  const [customizationSaved, setCustomizationSaved] = useState(false);
  const [orderFilter, setOrderFilter] = useState('All');
  const [productSearch, setProductSearch] = useState('');

  // CAPTCHA State for Anti-Bot & Brute Force Protection
  const [captchaCode, setCaptchaCode] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const captchaCanvasRef = useRef(null);

  const defaultThemeSettings = {
    themeColorPrimary: '#c85c7a',
    themeColorSoft: '#f8dfe7',
    themeColorGold: '#c9a45c',
    themeColorBg: '#fffaf5',
    themeColorDark: '#252126',
    fontHeading: 'Playfair Display',
    fontBody: 'Plus Jakarta Sans',
    storeName: 'Dress Gallery',
    tagline: 'Trendy Fashion • Quality • Comfort • Affordable Prices',
    logoSubtitle: 'Shiva Fashion',
    monogramInitials: 'AS',
    enableLandingPage: true,
    enable3DHearts: true,
    landingHeadline: 'Celebrate Feminine Grace & Trendy Style',
    landingTagline: 'Curated collection of everyday elegance, designer dresses & comfortable loungewear crafted for you.',
    landingButtonText: 'OPEN DRESS GALLERY',
    landingBgImage: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1920&q=85',
    heroImage: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
    heroBadge: 'Shiva Fashion Collection',
    heroHeadline: '',
    heroSubtitle: 'Curated women’s dresses and everyday outfits, crafted for comfort, style, and quality.',
    heroCardTitle: 'The Blossom Edit',
    heroCardSubtitle: 'Breathable silhouettes for everyday comfort'
  };

  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
    setTimeout(() => {
      drawCaptcha(code);
    }, 20);
  };

  const drawCaptcha = (code) => {
    const canvas = captchaCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#fff5f7');
    bgGradient.addColorStop(1, '#f8dfe7');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Scratch noise lines
    const lineColors = ['#c85c7a', '#c9a45c', '#756d72', '#e8a0b5'];
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = lineColors[i % lineColors.length];
      ctx.lineWidth = Math.random() * 1.5 + 0.8;
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.bezierCurveTo(
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height,
        Math.random() * width, Math.random() * height
      );
      ctx.stroke();
    }

    // Noise dots
    for (let i = 0; i < 28; i++) {
      ctx.fillStyle = lineColors[Math.floor(Math.random() * lineColors.length)];
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Characters with random rotation
    const charColors = ['#962846', '#7c293e', '#252126', '#872942', '#b45309'];
    const charSpacing = width / (code.length + 1);

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      ctx.save();
      const x = (i + 1) * charSpacing;
      const y = height / 2 + (Math.random() * 6 - 3);
      ctx.translate(x, y);
      const angle = (Math.random() * 32 - 16) * Math.PI / 180;
      ctx.rotate(angle);
      ctx.font = 'bold 22px "Plus Jakarta Sans", monospace';
      ctx.fillStyle = charColors[i % charColors.length];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 2;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  };

  // Generate CAPTCHA on initial modal open
  useEffect(() => {
    if (!isAuthenticated) {
      setTimeout(() => {
        generateCaptcha();
      }, 60);
    }
  }, [isAuthenticated]);

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

    // 1. CAPTCHA Security Validation
    if (!captchaInput.trim() || captchaInput.trim().toUpperCase() !== captchaCode.toUpperCase()) {
      setLoginError('Incorrect CAPTCHA. Please enter the characters shown.');
      generateCaptcha();
      return;
    }

    // 2. Admin PIN Authentication
    try {
      const res = await api.loginAdmin(pinInput);
      if (res && res.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('dg_admin_session', 'true');
        fetchAdminData();
      } else {
        setLoginError(res.error || 'Incorrect Admin PIN. Please try again.');
        generateCaptcha();
      }
    } catch (err) {
      setLoginError('Error connecting to authentication server');
      generateCaptcha();
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
      const merged = { ...defaultThemeSettings, ...(sets || {}) };
      setSettings(merged);
      setSettingsForm(merged);
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
      const orderNum = (settingsForm.orderWhatsAppNumber || settingsForm.whatsappNumber || '6369099224').trim();
      const formattedInternal = getWhatsAppOrderNumber({ orderWhatsAppNumber: orderNum });

      const payload = {
        ...settingsForm,
        orderWhatsAppNumber: orderNum,
        whatsappNumber: orderNum,
        whatsappInternal: formattedInternal
      };

      const updated = await api.updateSettings(payload);
      setSettings(updated || payload);
      setSettingsForm(updated || payload);
      applyTheme(updated || payload);
      setSettingsSaved(true);
      if (onProductChange) onProductChange();
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      alert('Error saving settings');
    }
  };

  const handleApplyPreset = (preset) => {
    setSettingsForm(prev => ({
      ...prev,
      themeColorPrimary: preset.primary,
      themeColorSoft: preset.soft,
      themeColorGold: preset.gold,
      themeColorBg: preset.bg,
      themeColorDark: preset.dark
    }));
  };

  const handleCustomizationImageUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const result = await api.uploadImage(file);
      if (result && result.url) {
        setSettingsForm(prev => ({
          ...prev,
          [field]: result.url
        }));
      }
    } catch (err) {
      console.error('Customization image upload error', err);
      alert('Failed to upload image. Please try an image under 15MB.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveCustomization = async (e) => {
    if (e) e.preventDefault();
    try {
      const orderNum = (settingsForm.orderWhatsAppNumber || settingsForm.whatsappNumber || '6369099224').trim();
      const formattedInternal = getWhatsAppOrderNumber({ orderWhatsAppNumber: orderNum });

      const payload = {
        ...settingsForm,
        orderWhatsAppNumber: orderNum,
        whatsappNumber: orderNum,
        whatsappInternal: formattedInternal
      };

      const updated = await api.updateSettings(payload);
      setSettings(updated || payload);
      setSettingsForm(updated || payload);

      // Immediately apply theme and fonts across the live site
      applyTheme(updated || payload);

      setCustomizationSaved(true);
      if (onProductChange) onProductChange();
      setTimeout(() => setCustomizationSaved(false), 3500);
    } catch (err) {
      alert('Error saving customization settings');
    }
  };

  const handleResetCustomizationDefaults = () => {
    if (window.confirm('Reset all website design, colors, and fonts back to default?')) {
      setSettingsForm(prev => ({
        ...prev,
        ...defaultThemeSettings
      }));
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
        <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-brand-pink/30 text-center animate-scaleIn">
          
          {/* AS Monogram Logo */}
          <div className="mb-3 flex justify-center">
            <ASLogo size="lg" showText={false} />
          </div>

          <h2 className="font-serif text-2xl font-bold text-brand-dark">Dress Gallery</h2>
          <p className="text-xs text-brand-muted mt-0.5">Secure Store Owner Admin Portal</p>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-soft/80 border border-brand-pink/40 text-[11px] font-bold text-brand-deep mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-deep" />
            <span>PIN & CAPTCHA Protected</span>
          </div>

          <form onSubmit={handleLogin} className="mt-5 space-y-3.5 text-left">
            <div>
              <label className="block text-[11px] font-bold text-brand-dark mb-1">
                Admin PIN
              </label>
              <input
                type="password"
                maxLength="8"
                autoFocus
                placeholder="••••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono py-2.5 bg-brand-cream border border-brand-pink/40 rounded-2xl focus:outline-none focus:border-brand-deep"
              />
            </div>

            {/* CAPTCHA Security Verification */}
            <div className="bg-brand-cream/60 border border-brand-pink/30 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-dark flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-deep" />
                  Security CAPTCHA
                </span>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-[10px] text-brand-deep font-semibold flex items-center gap-1 hover:underline"
                  title="Refresh CAPTCHA"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reload</span>
                </button>
              </div>

              {/* Canvas Display with Reload Button */}
              <div className="flex items-center justify-center gap-2">
                <div className="rounded-xl overflow-hidden border border-brand-pink/40 shadow-inner bg-white">
                  <canvas
                    ref={captchaCanvasRef}
                    width={160}
                    height={44}
                    className="block cursor-pointer"
                    onClick={generateCaptcha}
                    title="Click to refresh CAPTCHA"
                  />
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-2.5 bg-white border border-brand-pink/30 hover:border-brand-deep text-brand-dark rounded-xl shadow-2xs transition"
                  title="Get new CAPTCHA"
                >
                  <RefreshCw className="w-4 h-4 text-brand-muted hover:text-brand-deep" />
                </button>
              </div>

              {/* CAPTCHA Text Input */}
              <input
                type="text"
                required
                maxLength="6"
                placeholder="ENTER CAPTCHA"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                className="w-full text-center text-sm font-mono font-bold tracking-widest py-2 bg-white border border-brand-pink/40 rounded-xl focus:outline-none focus:border-brand-deep uppercase"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-600 font-semibold bg-rose-50 border border-rose-200 py-1.5 px-3 rounded-xl text-center">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-brand-deep hover:bg-brand-deep/90 text-white font-bold text-xs py-3.5 rounded-2xl shadow-md transition"
            >
              Unlock Admin Portal
            </button>
          </form>

          <div className="mt-5 pt-3 border-t border-brand-pink/20">
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

            {/* WEBSITE CUSTOMIZATION SETTINGS SECTION */}
            <button
              onClick={() => setActiveTab('customization')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'customization'
                  ? 'bg-brand-deep text-white shadow-xs'
                  : 'text-brand-dark bg-brand-soft/40 hover:bg-brand-soft border border-brand-pink/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-brand-gold" />
                <span>Customization Settings</span>
              </div>
              <span className="text-[9px] bg-brand-gold/20 text-brand-gold font-bold px-1.5 py-0.5 rounded-full">
                LIVE
              </span>
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
            <p className="font-bold text-brand-dark">WhatsApp Ordering:</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Connected & Active
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* Mobile Tab Selector */}
          <div className="flex md:hidden items-center gap-1 overflow-x-auto pb-3 mb-4 no-scrollbar">
            {['overview', 'products', 'orders', 'inquiries', 'customization', 'settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition ${
                  activeTab === tab ? 'bg-brand-deep text-white' : 'bg-white text-brand-dark'
                }`}
              >
                {tab === 'customization' ? 'Customization' : tab === 'settings' ? 'Admin Settings' : tab}
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

          {/* TAB 4.5: WEBSITE CUSTOMIZATION SETTINGS */}
          {activeTab === 'customization' && (
            <div className="space-y-6 max-w-4xl pb-12">
              
              {/* Top Banner & Quick Save Bar */}
              <div className="bg-white rounded-3xl border border-brand-pink/25 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-soft/80 flex items-center justify-center text-brand-deep border border-brand-pink/40">
                      <Palette className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-brand-dark">Website Customization Settings</h3>
                  </div>
                  <p className="text-xs text-brand-muted mt-1 max-w-xl">
                    Customize your store’s colors, typography, brand logo, hero images, and 3D landing page. Changes apply immediately upon saving.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetCustomizationDefaults}
                    className="text-xs font-semibold text-brand-muted hover:text-brand-dark bg-brand-cream border border-brand-pink/25 px-3.5 py-2.5 rounded-xl transition"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomization}
                    className="bg-brand-deep hover:bg-brand-deep/90 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save & Apply</span>
                  </button>
                </div>
              </div>

              {customizationSaved && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-2xl flex items-center gap-2.5 shadow-xs animate-fadeIn">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>Website customization saved! All colors, fonts, logos, and landing content have been applied live.</span>
                </div>
              )}

              {/* CARD 1: COLOUR PALETTE & THEMES */}
              <div className="bg-white rounded-3xl border border-brand-pink/25 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-brand-pink/15 pb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-brand-deep" />
                    <h4 className="font-serif font-bold text-base text-brand-dark">1. Brand Colour Palette</h4>
                  </div>
                  <span className="text-[10px] font-bold text-brand-deep bg-brand-soft/80 px-2 py-0.5 rounded-full">
                    Instant Live Theming
                  </span>
                </div>

                {/* 1-Click Color Presets */}
                <div>
                  <label className="block font-bold text-xs text-brand-dark mb-2">Quick 1-Click Color Presets</label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-pink/30 hover:border-brand-deep bg-brand-cream/50 text-xs font-semibold text-brand-dark transition hover:bg-white"
                      >
                        <div className="flex items-center -space-x-1">
                          <span className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs" style={{ backgroundColor: preset.primary }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs" style={{ backgroundColor: preset.gold }} />
                          <span className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs" style={{ backgroundColor: preset.soft }} />
                        </div>
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5 Custom Color Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {/* Primary Color */}
                  <div className="p-3.5 rounded-2xl bg-brand-cream/50 border border-brand-pink/25 space-y-2">
                    <label className="block text-[11px] font-bold text-brand-dark">Primary Brand Color</label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={settingsForm.themeColorPrimary || '#c85c7a'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, themeColorPrimary: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-brand-pink/30 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={settingsForm.themeColorPrimary || '#c85c7a'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, themeColorPrimary: e.target.value })}
                        className="flex-1 bg-white border border-brand-pink/30 rounded-xl p-2 text-xs font-mono font-bold uppercase"
                      />
                    </div>
                    <p className="text-[10px] text-brand-muted">Used for buttons, active tabs & accents</p>
                  </div>

                  {/* Soft Accent Color */}
                  <div className="p-3.5 rounded-2xl bg-brand-cream/50 border border-brand-pink/25 space-y-2">
                    <label className="block text-[11px] font-bold text-brand-dark">Soft Accent Color</label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={settingsForm.themeColorSoft || '#f8dfe7'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, themeColorSoft: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-brand-pink/30 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={settingsForm.themeColorSoft || '#f8dfe7'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, themeColorSoft: e.target.value })}
                        className="flex-1 bg-white border border-brand-pink/30 rounded-xl p-2 text-xs font-mono font-bold uppercase"
                      />
                    </div>
                    <p className="text-[10px] text-brand-muted">Used for badges, pills & soft cards</p>
                  </div>

                  {/* Gold Luxury Accent */}
                  <div className="p-3.5 rounded-2xl bg-brand-cream/50 border border-brand-pink/25 space-y-2">
                    <label className="block text-[11px] font-bold text-brand-dark">Subtle Gold Accent</label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={settingsForm.themeColorGold || '#c9a45c'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, themeColorGold: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-brand-pink/30 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={settingsForm.themeColorGold || '#c9a45c'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, themeColorGold: e.target.value })}
                        className="flex-1 bg-white border border-brand-pink/30 rounded-xl p-2 text-xs font-mono font-bold uppercase"
                      />
                    </div>
                    <p className="text-[10px] text-brand-muted">Used for sparkles, monogram & luxury icons</p>
                  </div>

                  {/* Page Background */}
                  <div className="p-3.5 rounded-2xl bg-brand-cream/50 border border-brand-pink/25 space-y-2">
                    <label className="block text-[11px] font-bold text-brand-dark">Background Color</label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={settingsForm.themeColorBg || '#fffaf5'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, themeColorBg: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-brand-pink/30 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={settingsForm.themeColorBg || '#fffaf5'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, themeColorBg: e.target.value })}
                        className="flex-1 bg-white border border-brand-pink/30 rounded-xl p-2 text-xs font-mono font-bold uppercase"
                      />
                    </div>
                    <p className="text-[10px] text-brand-muted">Main page body background</p>
                  </div>

                  {/* Dark Text Color */}
                  <div className="p-3.5 rounded-2xl bg-brand-cream/50 border border-brand-pink/25 space-y-2">
                    <label className="block text-[11px] font-bold text-brand-dark">Dark Charcoal Text</label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={settingsForm.themeColorDark || '#252126'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, themeColorDark: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-brand-pink/30 bg-transparent p-0.5"
                      />
                      <input
                        type="text"
                        value={settingsForm.themeColorDark || '#252126'}
                        onChange={(e) => setSettingsForm({ ...settingsForm, themeColorDark: e.target.value })}
                        className="flex-1 bg-white border border-brand-pink/30 rounded-xl p-2 text-xs font-mono font-bold uppercase"
                      />
                    </div>
                    <p className="text-[10px] text-brand-muted">Primary headings and body text</p>
                  </div>
                </div>

                {/* Live Color Swatch Strip */}
                <div 
                  className="p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3"
                  style={{
                    backgroundColor: settingsForm.themeColorBg || '#fffaf5',
                    borderColor: settingsForm.themeColorSoft || '#f8dfe7',
                    color: settingsForm.themeColorDark || '#252126'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: settingsForm.themeColorSoft || '#f8dfe7',
                        color: settingsForm.themeColorPrimary || '#c85c7a'
                      }}
                    >
                      Sample Badge
                    </span>
                    <span className="text-xs font-bold">Theme Preview Sample</span>
                  </div>

                  <button 
                    type="button"
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs"
                    style={{ backgroundColor: settingsForm.themeColorPrimary || '#c85c7a' }}
                  >
                    Sample Button
                  </button>
                </div>
              </div>

              {/* CARD 2: TYPOGRAPHY & FONTS */}
              <div className="bg-white rounded-3xl border border-brand-pink/25 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-brand-pink/15 pb-3">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-brand-deep" />
                    <h4 className="font-serif font-bold text-base text-brand-dark">2. Typography & Fonts</h4>
                  </div>
                  <span className="text-[10px] font-bold text-brand-deep bg-brand-soft/80 px-2 py-0.5 rounded-full">
                    Google Fonts Library
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Heading Font */}
                  <div>
                    <label className="block font-bold text-xs text-brand-dark mb-1">
                      Heading / Serif Font Family
                    </label>
                    <select
                      value={settingsForm.fontHeading || 'Playfair Display'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, fontHeading: e.target.value })}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs font-semibold"
                    >
                      {AVAILABLE_HEADING_FONTS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-brand-muted mt-1">Used for main titles, product names & headers</p>
                  </div>

                  {/* Body Font */}
                  <div>
                    <label className="block font-bold text-xs text-brand-dark mb-1">
                      Body / Sans Font Family
                    </label>
                    <select
                      value={settingsForm.fontBody || 'Plus Jakarta Sans'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, fontBody: e.target.value })}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs font-semibold"
                    >
                      {AVAILABLE_BODY_FONTS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-brand-muted mt-1">Used for descriptions, prices, buttons & tabs</p>
                  </div>
                </div>

                {/* Live Typography Preview Box */}
                <div className="p-4 rounded-2xl bg-brand-cream/40 border border-brand-pink/20 space-y-1">
                  <p 
                    className="text-lg font-bold text-brand-dark"
                    style={{ fontFamily: settingsForm.fontHeading || 'Playfair Display' }}
                  >
                    The Blossom Edit — Exclusive Women’s Dresses
                  </p>
                  <p 
                    className="text-xs text-brand-muted"
                    style={{ fontFamily: settingsForm.fontBody || 'Plus Jakarta Sans' }}
                  >
                    Experience luxurious comfort and trendy fashion crafted with meticulous attention to detail.
                  </p>
                </div>
              </div>

              {/* CARD 3: BRAND IDENTITY, LOGO & WEBSITE NAME */}
              <div className="bg-white rounded-3xl border border-brand-pink/25 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-brand-pink/15 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-gold" />
                    <h4 className="font-serif font-bold text-base text-brand-dark">3. Logo & Website Name</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Website / Store Name */}
                  <div>
                    <label className="block font-bold text-xs text-brand-dark mb-1">Website / Brand Name *</label>
                    <input
                      type="text"
                      value={settingsForm.storeName || 'Dress Gallery'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs font-bold text-brand-dark"
                      placeholder="Dress Gallery"
                    />
                  </div>

                  {/* Tagline */}
                  <div>
                    <label className="block font-bold text-xs text-brand-dark mb-1">Official Brand Tagline *</label>
                    <input
                      type="text"
                      value={settingsForm.tagline || 'Trendy Fashion • Quality • Comfort • Affordable Prices'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark"
                      placeholder="Trendy Fashion • Quality • Comfort"
                    />
                  </div>

                  {/* Monogram Subtitle */}
                  <div>
                    <label className="block font-bold text-xs text-brand-dark mb-1">Logo Subtitle *</label>
                    <input
                      type="text"
                      value={settingsForm.logoSubtitle || settingsForm.subtitle || 'Shiva Fashion'}
                      onChange={(e) => setSettingsForm({ 
                        ...settingsForm, 
                        logoSubtitle: e.target.value,
                        subtitle: e.target.value
                      })}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs font-semibold text-brand-dark"
                      placeholder="Shiva Fashion"
                    />
                    <p className="text-[10px] text-brand-muted mt-1">Displays underneath the logo</p>
                  </div>

                  {/* Monogram Initials */}
                  <div>
                    <label className="block font-bold text-xs text-brand-dark mb-1">Monogram Initials (1-3 Letters)</label>
                    <input
                      type="text"
                      maxLength="3"
                      value={settingsForm.monogramInitials || 'AS'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, monogramInitials: e.target.value.toUpperCase() })}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs font-mono font-bold uppercase tracking-widest text-brand-dark"
                      placeholder="AS"
                    />
                    <p className="text-[10px] text-brand-muted mt-1">Emblem center letters (e.g. AS or DG)</p>
                  </div>
                </div>

                {/* Custom Logo Image Option */}
                <div className="p-4 rounded-2xl bg-brand-cream/50 border border-brand-pink/25 space-y-3">
                  <label className="block font-bold text-xs text-brand-dark">
                    Custom Logo Image (Optional File Upload or URL)
                  </label>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-soft border border-brand-pink/40 text-brand-dark font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xs transition">
                      <Upload className="w-3.5 h-3.5 text-brand-deep" />
                      <span>Upload Logo from Computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCustomizationImageUpload(e, 'customLogoUrl')}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      value={settingsForm.customLogoUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, customLogoUrl: e.target.value })}
                      placeholder="Or paste direct logo image URL..."
                      className="flex-1 bg-white border border-brand-pink/30 rounded-xl p-2.5 text-xs"
                    />

                    {settingsForm.customLogoUrl && (
                      <div className="flex items-center gap-2">
                        <img 
                          src={settingsForm.customLogoUrl} 
                          alt="Logo Preview" 
                          className="w-10 h-10 object-cover rounded-full border border-brand-pink/30 shadow-2xs" 
                        />
                        <button
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, customLogoUrl: '' })}
                          className="text-xs text-rose-500 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-brand-muted">
                    If set, this image replaces the circular monogram emblem across the navbar and footer.
                  </p>
                </div>
              </div>

              {/* CARD 4: STORE IMAGES & HERO SHOWCASE */}
              <div className="bg-white rounded-3xl border border-brand-pink/25 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-brand-pink/15 pb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-brand-deep" />
                    <h4 className="font-serif font-bold text-base text-brand-dark">4. Store Visuals & Hero Showcase</h4>
                  </div>
                </div>

                {/* Hero Showcase Image */}
                <div className="p-4 rounded-2xl bg-brand-cream/50 border border-brand-pink/25 space-y-3">
                  <label className="block font-bold text-xs text-brand-dark">
                    Hero Showcase Image (Front Homepage Banner)
                  </label>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-soft border border-brand-pink/40 text-brand-dark font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xs transition">
                      <Upload className="w-3.5 h-3.5 text-brand-deep" />
                      <span>Upload Hero Image from Computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCustomizationImageUpload(e, 'heroImage')}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      value={settingsForm.heroImage || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroImage: e.target.value })}
                      placeholder="Or paste hero image URL..."
                      className="flex-1 bg-white border border-brand-pink/30 rounded-xl p-2.5 text-xs"
                    />

                    {settingsForm.heroImage && (
                      <img 
                        src={settingsForm.heroImage} 
                        alt="Hero Preview" 
                        className="w-12 h-14 object-cover rounded-xl border border-brand-pink/30 shadow-2xs" 
                      />
                    )}
                  </div>
                </div>

                {/* Hero Copy Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-xs text-brand-dark mb-1">Hero Badge Text</label>
                    <input
                      type="text"
                      value={settingsForm.heroBadge || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroBadge: e.target.value })}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs"
                      placeholder="e.g. Shiva Fashion Collection"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-brand-dark mb-1">Hero Main Headline (Optional Override)</label>
                    <input
                      type="text"
                      value={settingsForm.heroHeadline || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs"
                      placeholder="Leave blank for classic multi-line default"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-xs text-brand-dark mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={settingsForm.heroSubtitle || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs"
                    placeholder="Curated women’s dresses and everyday outfits, crafted for comfort, style, and quality."
                  />
                </div>
              </div>

              {/* CARD 5: 3D LOVE THEME & 1ST PAGE LANDING CONTENT */}
              <div className="bg-white rounded-3xl border border-brand-pink/25 p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-brand-pink/15 pb-3">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <h4 className="font-serif font-bold text-base text-brand-dark">5. 1st Page 3D Love Theme & Content</h4>
                  </div>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    3D Perspective & Depth
                  </span>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 p-3.5 rounded-2xl bg-brand-cream/50 border border-brand-pink/20">
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-xs text-brand-dark">
                    <input
                      type="checkbox"
                      checked={settingsForm.enableLandingPage !== false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enableLandingPage: e.target.checked })}
                      className="rounded text-brand-deep focus:ring-brand-pink w-4 h-4"
                    />
                    <span>Enable 1st Opening 3D Landing Page</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-xs text-brand-dark">
                    <input
                      type="checkbox"
                      checked={settingsForm.enable3DHearts !== false}
                      onChange={(e) => setSettingsForm({ ...settingsForm, enable3DHearts: e.target.checked })}
                      className="rounded text-brand-deep focus:ring-brand-pink w-4 h-4"
                    />
                    <span>Enable Floating 3D Love Hearts Effect</span>
                  </label>
                </div>

                {/* Landing Background Image */}
                <div className="p-4 rounded-2xl bg-brand-cream/50 border border-brand-pink/25 space-y-3">
                  <label className="block font-bold text-xs text-brand-dark">
                    Landing Page Editorial Background Image
                  </label>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-2 bg-white hover:bg-brand-soft border border-brand-pink/40 text-brand-dark font-bold text-xs px-4 py-2.5 rounded-xl shadow-2xs transition">
                      <Upload className="w-3.5 h-3.5 text-brand-deep" />
                      <span>Upload Background from Computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleCustomizationImageUpload(e, 'landingBgImage')}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      value={settingsForm.landingBgImage || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, landingBgImage: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 bg-white border border-brand-pink/30 rounded-xl p-2.5 text-xs"
                    />

                    {settingsForm.landingBgImage && (
                      <img 
                        src={settingsForm.landingBgImage} 
                        alt="Landing Preview" 
                        className="w-12 h-14 object-cover rounded-xl border border-brand-pink/30 shadow-2xs" 
                      />
                    )}
                  </div>
                </div>

                {/* Landing Headline & Tagline */}
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-xs text-brand-dark mb-1">Landing Page Headline</label>
                    <input
                      type="text"
                      value={settingsForm.landingHeadline || 'Celebrate Feminine Grace & Trendy Style'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, landingHeadline: e.target.value })}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs font-bold text-brand-dark"
                      placeholder="Celebrate Feminine Grace & Trendy Style"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-brand-dark mb-1">Landing Page Tagline / Subtitle</label>
                    <textarea
                      rows="2"
                      value={settingsForm.landingTagline || 'Curated collection of everyday elegance, designer dresses & comfortable loungewear crafted for you.'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, landingTagline: e.target.value })}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs text-brand-dark"
                      placeholder="Curated collection of everyday elegance..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-xs text-brand-dark mb-1">Entry Button Text</label>
                    <input
                      type="text"
                      value={settingsForm.landingButtonText || 'OPEN DRESS GALLERY'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, landingButtonText: e.target.value })}
                      className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs font-bold uppercase tracking-wider text-brand-dark"
                      placeholder="OPEN DRESS GALLERY"
                    />
                  </div>
                </div>
              </div>

              {/* CARD 6: ANNOUNCEMENT BAR TICKER */}
              <div className="bg-white rounded-3xl border border-brand-pink/25 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-brand-pink/15 pb-3">
                  <Tag className="w-4 h-4 text-brand-deep" />
                  <h4 className="font-serif font-bold text-base text-brand-dark">6. Announcement Bar Promotional Banner</h4>
                </div>

                <div>
                  <label className="block font-bold text-xs text-brand-dark mb-1">Top Announcement Message</label>
                  <textarea
                    rows="2"
                    value={settingsForm.announcement || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                    className="w-full bg-brand-cream/60 border border-brand-pink/30 rounded-xl p-2.5 text-xs font-medium text-brand-dark"
                    placeholder="🌸 Welcome to Dress Gallery! Flat 10% OFF with code WELCOME100 • Free Delivery above ₹799 🌸"
                  />
                  <p className="text-[10px] text-brand-muted mt-1">Displays on the very top bar across every page</p>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="bg-white rounded-2xl border border-brand-pink/30 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-brand-muted font-medium">
                  Saving will immediately update colors, typography, images, and content on your live store.
                </p>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleResetCustomizationDefaults}
                    className="flex-1 sm:flex-none text-xs font-semibold text-brand-muted hover:text-brand-dark bg-brand-cream px-4 py-2.5 rounded-xl border border-brand-pink/30 transition"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCustomization}
                    className="flex-1 sm:flex-none bg-brand-deep hover:bg-brand-deep/90 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save & Apply Customization</span>
                  </button>
                </div>
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
                  
                  {/* Order WhatsApp Number Setting */}
                  <div className="bg-brand-cream/60 border border-brand-pink/30 rounded-2xl p-4 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="font-bold text-brand-dark text-xs flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                        Order WhatsApp Number *
                      </label>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Active WhatsApp Destination: +{getWhatsAppOrderNumber(settingsForm)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-white border border-brand-pink/40 rounded-xl px-3 py-2.5 text-xs font-bold text-brand-muted">
                        🇮🇳 +91
                      </div>
                      <input
                        type="text"
                        value={settingsForm.orderWhatsAppNumber ?? settingsForm.whatsappNumber ?? '6369099224'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettingsForm(prev => ({
                            ...prev,
                            orderWhatsAppNumber: val,
                            whatsappNumber: val,
                            whatsappInternal: getWhatsAppOrderNumber({ orderWhatsAppNumber: val })
                          }));
                        }}
                        className="flex-1 bg-white border border-brand-pink/40 rounded-xl p-2.5 text-sm font-bold tracking-wider text-brand-dark focus:border-brand-deep focus:outline-none"
                        placeholder="6369099224"
                      />
                    </div>

                    <p className="text-[11px] text-brand-muted leading-relaxed">
                      All customer orders, "Order Now" modal submissions, Cart checkouts, and inquiries will automatically go to this WhatsApp number. When you change this number here, subsequent orders will immediately go to the new number.
                    </p>
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
