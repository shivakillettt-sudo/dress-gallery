import React, { useState, useEffect, useMemo, useRef } from 'react';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import ProductOrderModal from './components/ProductOrderModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import TrackOrderModal from './components/TrackOrderModal';
import ResellerModal from './components/ResellerModal';
import SizeChartModal from './components/SizeChartModal';
import CustomerReviews from './components/CustomerReviews';
import InstagramLookbook from './components/InstagramLookbook';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { api } from './utils/api';
import { 
  Filter, 
  Sparkles, 
  ArrowUpDown, 
  Heart, 
  X, 
  ShoppingBag
} from 'lucide-react';

export default function App() {
  // 1. Session-based First Opening Landing Page State (Rule 1)
  const [hasEnteredStore, setHasEnteredStore] = useState(() => {
    try {
      return sessionStorage.getItem('dg_entered') === 'true';
    } catch {
      return false;
    }
  });

  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState('All');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderModalProduct, setOrderModalProduct] = useState(null);
  const [orderModalSize, setOrderModalSize] = useState('');
  const [orderModalColor, setOrderModalColor] = useState('');

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderPricing, setOrderPricing] = useState({ subtotal: 0, discount: 0, shippingFee: 0, total: 0 });
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [trackInitialId, setTrackInitialId] = useState('');
  const [isResellerOpen, setIsResellerOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Cart & Wishlist persistence
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dg_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('dg_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const catalogRef = useRef(null);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('dg_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('dg_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load products & settings
  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, sets] = await Promise.all([
        api.getProducts(),
        api.getSettings()
      ]);
      setProducts(prods || []);
      setSettings(sets || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEnterStore = () => {
    setHasEnteredStore(true);
    try {
      sessionStorage.setItem('dg_entered', 'true');
    } catch (err) {
      console.warn(err);
    }
  };

  // Cart Actions
  const handleAddToCart = (productWithSelection) => {
    setCartItems(prev => {
      const index = prev.findIndex(
        item => item.id === productWithSelection.id && 
                item.selectedSize === productWithSelection.selectedSize &&
                item.selectedColor === productWithSelection.selectedColor
      );

      if (index > -1) {
        const updated = [...prev];
        updated[index].quantity += (productWithSelection.quantity || 1);
        return updated;
      } else {
        return [...prev, { ...productWithSelection, quantity: productWithSelection.quantity || 1 }];
      }
    });
  };

  const handleQuickAddToCart = (product) => {
    handleAddToCart({
      ...product,
      selectedSize: product.sizes?.[0] || 'Free Size',
      selectedColor: product.colors?.[0] || 'Default',
      quantity: 1
    });
    setIsCartOpen(true);
  };

  const handleOpenOrderModalForProduct = (product, size, color) => {
    setOrderModalProduct(product);
    setOrderModalSize(size || product.sizes?.[0] || 'Free Size');
    setOrderModalColor(color || product.colors?.[0] || '');
  };

  const handleUpdateQuantity = (id, size, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id, size);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  // Wishlist Actions
  const handleToggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isWishlisted = (productId) => wishlist.some(item => item.id === productId);

  // Cart Total calculation
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (activeCategory === 'Under 499') {
        if (p.price > 499) return false;
      } else if (activeCategory !== 'All') {
        if (p.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesSku = p.sku && p.sku.toLowerCase().includes(q);
        const matchesDesc = p.description && p.description.toLowerCase().includes(q);
        const matchesBadge = p.badge && p.badge.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesSku && !matchesDesc && !matchesBadge) return false;
      }

      // Size Filter
      if (selectedSizeFilter !== 'All') {
        if (!p.sizes || !p.sizes.includes(selectedSizeFilter)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'discount') {
        const discA = a.mrp ? (a.mrp - a.price) / a.mrp : 0;
        const discB = b.mrp ? (b.mrp - b.price) / b.mrp : 0;
        return discB - discA;
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, activeCategory, searchQuery, selectedSizeFilter, sortBy]);

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleProceedToCheckout = (pricing) => {
    setOrderPricing(pricing);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = async (orderPayload) => {
    const placed = await api.createOrder(orderPayload);
    setCartItems([]);
    return placed;
  };

  // --- RULE 1: FIRST OPENING PAGE / LANDING PAGE ---
  if (!hasEnteredStore) {
    return <LandingPage onEnter={handleEnterStore} />;
  }

  // --- MAIN SHOPPING WEBSITE ---
  return (
    <div className="min-h-screen bg-brand-cream flex flex-col selection:bg-brand-pink selection:text-brand-dark animate-fadeIn">
      
      {/* 1. Header & Navigation */}
      <Navbar
        settings={settings}
        cartCount={cartItemCount}
        cartTotal={cartSubtotal}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistModalOpen(true)}
        onOpenTrack={() => {
          setTrackInitialId('');
          setIsTrackOpen(true);
        }}
        onOpenReseller={() => setIsResellerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalog();
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Hero Section (NO green WhatsApp button, as requested in Rule 3) */}
      <Hero
        settings={settings}
        onExplore={scrollToCatalog}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalog();
        }}
        activeCategory={activeCategory}
      />

      {/* 3. Catalog Section */}
      <main ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        
        {/* Section Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-brand-deep text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span>Handpicked Wardrobe</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
              {activeCategory === 'All' ? 'Complete Collection' : activeCategory}
              <span className="text-sm font-normal text-brand-muted ml-2 font-sans">
                ({filteredProducts.length} {filteredProducts.length === 1 ? 'outfit' : 'outfits'})
              </span>
            </h2>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Size Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-brand-pink/30 rounded-xl px-3 py-1.5 text-xs text-brand-dark shadow-xs">
              <span className="text-brand-muted font-medium">Size:</span>
              <select
                value={selectedSizeFilter}
                onChange={(e) => setSelectedSizeFilter(e.target.value)}
                className="bg-transparent font-bold focus:outline-none cursor-pointer"
              >
                <option value="All">All Sizes</option>
                <option value="Free Size">Free Size</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-brand-pink/30 rounded-xl px-3 py-1.5 text-xs text-brand-dark shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-muted" />
              <span className="text-brand-muted font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-bold focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="discount">Biggest Discounts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-brand-pink/20 animate-pulse space-y-3">
                <div className="aspect-[3/4] bg-brand-soft/40 rounded-xl w-full" />
                <div className="h-4 bg-brand-soft/40 rounded w-3/4" />
                <div className="h-3 bg-brand-soft/30 rounded w-1/2" />
                <div className="h-6 bg-brand-soft/40 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-brand-pink/30 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-soft flex items-center justify-center text-brand-deep mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-dark">No Outfits Found</h3>
            <p className="text-xs text-brand-muted">
              We couldn't find any dresses matching your current search or size filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                setSelectedSizeFilter('All');
              }}
              className="bg-brand-deep text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={isWishlisted(product.id)}
                onToggleWishlist={handleToggleWishlist}
                onOpenDetail={setSelectedProduct}
                onQuickAddToCart={handleQuickAddToCart}
                onOpenOrderModal={(p) => handleOpenOrderModalForProduct(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* 4. Customer Reviews Section */}
      <CustomerReviews />

      {/* 5. Instagram Lookbook Section */}
      <InstagramLookbook
        settings={settings}
        onExplore={scrollToCatalog}
      />

      {/* 6. Footer */}
      <Footer
        settings={settings}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCatalog();
        }}
        onOpenTrack={() => {
          setTrackInitialId('');
          setIsTrackOpen(true);
        }}
        onOpenReseller={() => setIsResellerOpen(true)}
        onOpenSizeChart={() => setIsSizeChartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* NO FLOATING GREEN WHATSAPP BUTTON (Removed per Rule 4) */}

      {/* --- ALL MODALS & DRAWERS --- */}

      {/* REQUIRED: ORDER DETAILS MODAL (RULES 5, 6, 7 & 12) */}
      <ProductOrderModal
        product={orderModalProduct}
        isOpen={Boolean(orderModalProduct)}
        onClose={() => setOrderModalProduct(null)}
        settings={settings}
        defaultSize={orderModalSize}
        defaultColor={orderModalColor}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? isWishlisted(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        whatsappNumber={settings.whatsappNumber}
        onOpenSizeChart={() => setIsSizeChartOpen(true)}
        onOpenOrderForm={(prod, sz, clr) => {
          setSelectedProduct(null);
          handleOpenOrderModalForProduct(prod, sz, clr);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
        settings={settings}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        orderPricing={orderPricing}
        onOrderSuccess={handleOrderSuccess}
        settings={settings}
        onOpenTrack={(orderId) => {
          setTrackInitialId(orderId);
          setIsTrackOpen(true);
        }}
      />

      {/* Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        initialQuery={trackInitialId}
        settings={settings}
      />

      {/* Reseller Inquiry Modal */}
      <ResellerModal
        isOpen={isResellerOpen}
        onClose={() => setIsResellerOpen(false)}
        settings={settings}
      />

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
      />

      {/* Wishlist Drawer/Modal */}
      {isWishlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-dark/50 backdrop-blur-xs" onClick={() => setIsWishlistModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 z-10 border border-brand-pink/30 animate-scaleIn max-h-[85vh] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-brand-pink/20 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="font-serif font-bold text-lg text-brand-dark">Your Wishlist ({wishlist.length})</h3>
              </div>
              <button onClick={() => setIsWishlistModalOpen(false)} className="p-1 rounded text-brand-dark">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {wishlist.length === 0 ? (
                <div className="text-center py-8 text-brand-muted text-xs space-y-2">
                  <Heart className="w-10 h-10 text-brand-pink mx-auto stroke-1" />
                  <p>Your wishlist is empty. Tap the heart on dresses you love!</p>
                </div>
              ) : (
                wishlist.map(p => (
                  <div key={p.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-brand-cream/50 border border-brand-pink/20">
                    <img src={p.images?.[0]} alt="" className="w-12 h-14 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-serif font-bold text-xs text-brand-dark line-clamp-1">{p.title}</p>
                      <p className="text-xs font-bold text-brand-deep">₹{p.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          handleQuickAddToCart(p);
                          setIsWishlistModalOpen(false);
                        }}
                        className="bg-brand-deep text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs"
                      >
                        Add to Bag
                      </button>
                      <button
                        onClick={() => handleToggleWishlist(p)}
                        className="p-1 text-brand-muted hover:text-rose-500"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-brand-pink/20 text-center">
              <button
                onClick={() => setIsWishlistModalOpen(false)}
                className="text-xs font-semibold text-brand-muted hover:text-brand-dark"
              >
                Close Wishlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard (Full Screen Overlay) */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          onProductChange={loadData}
        />
      )}

    </div>
  );
}
