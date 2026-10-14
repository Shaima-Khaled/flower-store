import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('store'); // 'store' or 'admin'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceFilter, setPriceFilter] = useState(600);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [trackingOrderId, setTrackingOrderId] = useState('');

  // Cart State with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('rivan_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [addedProductId, setAddedProductId] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('rivan_cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch products & categories from API
  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      console.error('Error fetching store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  // Cart actions
  const handleAddToCart = (product, qty = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: qty
        }
      ];
    });

    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Checkout Success
  const handleOrderSuccess = (order) => {
    setCart([]);
    setDiscountCode('');
    setDiscountAmount(0);
    setTrackingOrderId(order.id);
    fetchProductsAndCategories(); // update stock
  };

  // Open Tracker with specific ID
  const handleOpenTrackerWithId = (id = '') => {
    setTrackingOrderId(id);
    setIsTrackerOpen(true);
  };

  // Filter & Sort Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesPrice = p.price <= priceFilter;
    const matchesSearch =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.flowerTypes &&
        p.flowerTypes.some((t) =>
          t.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    return matchesCategory && matchesPrice && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    // default featured
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((c, i) => c + i.quantity, 0);

  // If Admin View is active, render the Admin Dashboard
  if (activeView === 'admin') {
    return (
      <AdminDashboard
        onBackToStore={() => {
          setActiveView('store');
          fetchProductsAndCategories();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 selection:bg-rose-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => handleOpenTrackerWithId('')}
        activeView={activeView}
        setActiveView={setActiveView}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Hero Section */}
      <Hero
        onExploreClick={() => {
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenTracker={() => handleOpenTrackerWithId('')}
      />

      {/* Catalog & Shop Section */}
      <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>باقات منتقاة بكل حب وشغف</span>
          </div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            استكشف تشكيلاتنا العصرية
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm">
            اختر ما يروق لذوقك الرفيع، وسنتكفل بالتنسيق الإبداعي والتوصيل المتقن لمن تحب.
          </p>
        </div>

        {/* Categories & Filter Bar */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceFilter={priceFilter}
          onPriceFilterChange={setPriceFilter}
        />

        {/* Loading / Empty / Products Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-rose-600 animate-spin mx-auto" />
            <p className="text-sm text-stone-500 font-medium">جاري تجهيز باقات الورد العطرة...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-stone-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-stone-800">لم يتم العثور على باقات تطابق بحثك</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              جرب تغيير كلمات البحث أو تخفيف قيود تصفية الأسعار والتصنيفات.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
                setPriceFilter(600);
              }}
              className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={setSelectedProduct}
                isAdded={addedProductId === product.id}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer
        onCategoryClick={(catId) => {
          setSelectedCategory(catId);
          const el = document.getElementById('catalog-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenTracker={() => handleOpenTrackerWithId('')}
      />

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        discountCode={discountCode}
        setDiscountCode={setDiscountCode}
        discountAmount={discountAmount}
        setDiscountAmount={setDiscountAmount}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        discountCode={discountCode}
        discountAmount={discountAmount}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        initialOrderId={trackingOrderId}
      />

    </div>
  );
}
