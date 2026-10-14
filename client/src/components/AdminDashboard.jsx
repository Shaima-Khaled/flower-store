import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Flower2, 
  ArrowRight, 
  RefreshCw,
  AlertCircle,
  Truck,
  Heart,
  DollarSign
} from 'lucide-react';

export default function AdminDashboard({ onBackToStore }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Orders Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Products State
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Adding / Editing Product
  const [productForm, setProductForm] = useState({
    name: '',
    subtitle: '',
    price: '',
    originalPrice: '',
    category: 'romantic',
    categoryName: 'باقات الحب والرومانسية',
    image: '',
    stock: 15,
    featured: false,
    description: '',
    flowerTypes: '',
    careTips: ''
  });

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes, statsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/stats')
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update order status handler
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(orders.map(o => o.id === orderId ? updated : o));
        if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
          setSelectedOrderDetails(updated);
        }
        // Refresh stats
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  // Add / Edit Product Submit
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      alert('يرجى تعبئة اسم المنتج والسعر');
      return;
    }

    try {
      const categoryMap = {
        romantic: 'باقات الحب والرومانسية',
        graduation: 'مناسبات التخرج والنجاح',
        newborn: 'استقبال المواليد',
        luxury: 'فازات وتنسيقات فاخرة',
        gifts: 'ورود وهدايا وشوكولاتة'
      };

      const payload = {
        ...productForm,
        categoryName: categoryMap[productForm.category] || 'باقات زهور',
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : null,
        stock: Number(productForm.stock),
        flowerTypes: productForm.flowerTypes ? productForm.flowerTypes.split(',').map(s => s.trim()) : ['ورد جوري طبيعي']
      };

      if (editingProduct) {
        // PUT update
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          setProducts(products.map(p => p.id === updated.id ? updated : p));
          setEditingProduct(null);
          setIsAddModalOpen(false);
        }
      } else {
        // POST create
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const created = await res.json();
          setProducts([created, ...products]);
          setIsAddModalOpen(false);
        }
      }

      // Reset form
      setProductForm({
        name: '',
        subtitle: '',
        price: '',
        originalPrice: '',
        category: 'romantic',
        categoryName: 'باقات الحب والرومانسية',
        image: '',
        stock: 15,
        featured: false,
        description: '',
        flowerTypes: '',
        careTips: ''
      });
      // Refresh stats
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ المنتج');
    }
  };

  // Open Edit Modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      subtitle: product.subtitle || '',
      price: product.price,
      originalPrice: product.originalPrice || '',
      category: product.category,
      categoryName: product.categoryName || '',
      image: product.image,
      stock: product.stock,
      featured: product.featured,
      description: product.description,
      flowerTypes: product.flowerTypes ? product.flowerTypes.join(', ') : '',
      careTips: product.careTips || ''
    });
    setIsAddModalOpen(true);
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;

    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== productId));
        // Refresh stats
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حذف المنتج');
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = !orderSearch || 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.recipient?.name && o.recipient.name.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.customer?.phone && o.customer.phone.includes(orderSearch));
    return matchesStatus && matchesSearch;
  });

  // Filtered Products
  const filteredProducts = products.filter(p => 
    !productSearch ||
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.subtitle && p.subtitle.toLowerCase().includes(productSearch.toLowerCase()))
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'received':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-bold">جديد قيد الاستلام</span>;
      case 'in_preparation':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-bold">جاري التنسيق والتجهيز</span>;
      case 'out_for_delivery':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full text-xs font-bold">خرج مع المندوب</span>;
      case 'delivered':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">تم التسليم بنجاح ✓</span>;
      case 'cancelled':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-bold">ملغي ✕</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 pb-16">
      
      {/* Top Banner */}
      <div className="bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-600 flex items-center justify-center text-white font-bold shadow-lg shadow-rose-900/40">
              <Flower2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black">لوحة تحكم إدارة المتجر</h1>
                <span className="text-xs bg-rose-900/80 text-rose-300 font-semibold px-2.5 py-0.5 rounded-full border border-rose-700">
                  مدير النظام
                </span>
              </div>
              <p className="text-xs text-stone-400">إدارة الباقات، تعديل الأسعار، ومتابعة الطلبات اللحظية</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-stone-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تحديث البيانات</span>
            </button>
            <button
              onClick={onBackToStore}
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <span>الذهاب للمتجر</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* KPI Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium block">إجمالي المبيعات</span>
                <span className="text-2xl font-black text-rose-700 mt-1 block">
                  {stats.totalSales} <span className="text-xs font-normal">ر.س</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium block">إجمالي الطلبات</span>
                <span className="text-2xl font-black text-stone-900 mt-1 block">
                  {stats.totalOrders}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium block">طلبات قيد التجهيز</span>
                <span className="text-2xl font-black text-amber-600 mt-1 block">
                  {stats.pendingOrders}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium block">الطلبات المكتملة</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">
                  {stats.deliveredOrders}
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

          </div>
        )}

        {/* Tab Switcher & Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 bg-stone-200/60 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>إدارة ومتابعة الطلبات ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'products'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Flower2 className="w-4 h-4" />
              <span>إدارة باقات الورد ({products.length})</span>
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  subtitle: '',
                  price: '',
                  originalPrice: '',
                  category: 'romantic',
                  categoryName: 'باقات الحب والرومانسية',
                  image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
                  stock: 15,
                  featured: false,
                  description: '',
                  flowerTypes: 'ورد جوري طبيعي، أغصان خضراء',
                  careTips: 'قص أطراف السيقان وضعها بماء نظيف وبارد.'
                });
                setIsAddModalOpen(true);
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة باقة ورد جديدة</span>
            </button>
          )}
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
              
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'received', label: 'قيد الاستلام' },
                  { id: 'in_preparation', label: 'جاري التنسيق' },
                  { id: 'out_for_delivery', label: 'خرج للتوصيل' },
                  { id: 'delivered', label: 'تم التسليم' }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setOrderStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      orderStatusFilter === st.id
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Search Orders */}
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  placeholder="ابحث برقم الطلب أو اسم العميل..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
              </div>

            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-50/80 text-stone-500 font-bold border-b border-stone-200">
                    <tr>
                      <th className="p-4">رقم الطلب</th>
                      <th className="p-4">صاحب الطلب</th>
                      <th className="p-4">المستلم والمدينة</th>
                      <th className="p-4">موعد التوصيل</th>
                      <th className="p-4">الإجمالي</th>
                      <th className="p-4">حالة الطلب</th>
                      <th className="p-4 text-center">تحديث الحالة</th>
                      <th className="p-4 text-center">التفاصيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-stone-400 font-medium">
                          لا توجد طلبات تطابق معايير البحث
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.id} className="hover:bg-rose-50/30 transition-colors">
                          <td className="p-4 font-mono font-bold text-rose-700">
                            {order.id}
                          </td>
                          <td className="p-4">
                            <span className="font-bold block">{order.customer?.name}</span>
                            <span className="text-[11px] text-stone-400 font-mono" dir="ltr">{order.customer?.phone}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold block">{order.recipient?.name}</span>
                            <span className="text-[11px] text-stone-500">{order.recipient?.city}</span>
                          </td>
                          <td className="p-4">
                            <span className="block font-semibold">{order.recipient?.deliveryDate}</span>
                            <span className="text-[10px] text-stone-400">{order.recipient?.deliveryTimeSlot}</span>
                          </td>
                          <td className="p-4 font-bold text-stone-900">
                            {order.total} ر.س
                          </td>
                          <td className="p-4">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="p-4 text-center">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="bg-stone-50 border border-stone-300 rounded-lg px-2 py-1 text-[11px] font-semibold text-stone-700 focus:ring-2 focus:ring-rose-500"
                            >
                              <option value="received">قيد الاستلام</option>
                              <option value="in_preparation">جاري التنسيق</option>
                              <option value="out_for_delivery">خرج للتوصيل</option>
                              <option value="delivered">تم التسليم ✓</option>
                              <option value="cancelled">إلغاء ✕</option>
                            </select>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedOrderDetails(order)}
                              className="bg-stone-100 hover:bg-stone-200 text-stone-700 p-2 rounded-xl transition-colors"
                              title="عرض التفاصيل والكرت"
                            >
                              <Eye className="w-4 h-4 text-rose-600" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Products Search & Stats */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="relative min-w-[280px]">
                <input
                  type="text"
                  placeholder="ابحث عن باقة بالاسم..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5" />
              </div>
              <span className="text-xs text-stone-500">
                إجمالي المعروض: <strong className="text-stone-800">{filteredProducts.length}</strong> باقة
              </span>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <div 
                  key={product.id}
                  className="bg-white rounded-3xl border border-stone-200/80 p-4 shadow-sm flex gap-4 hover:border-rose-200 transition-all"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium truncate">
                          {product.categoryName}
                        </span>
                        <span className="text-xs font-bold text-rose-700">
                          {product.price} ر.س
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-stone-900 mt-1 truncate">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                        {product.subtitle}
                      </p>
                      <div className="text-[11px] text-stone-400 mt-1">
                        المخزون المتوفر: <strong className="text-stone-700">{product.stock}</strong> باقة
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100 mt-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold py-1.5 rounded-xl flex items-center justify-center gap-1 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-600" />
                        <span>تعديل</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-xl transition-colors"
                        title="حذف الباقة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* MODAL 1: ORDER DETAILS & CARD MESSAGE PREVIEW */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-fade-in space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-black text-base text-stone-900">تفاصيل الطلب: {selectedOrderDetails.id}</h3>
                <span className="text-xs text-stone-400">
                  {new Date(selectedOrderDetails.createdAt).toLocaleString('ar-SA')}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                ✕
              </button>
            </div>

            {/* Recipient and Timing */}
            <div className="bg-stone-50 p-3.5 rounded-2xl text-xs space-y-1.5 border border-stone-200">
              <p>👤 <strong>المرسل:</strong> {selectedOrderDetails.customer?.name} ({selectedOrderDetails.customer?.phone})</p>
              <p>📍 <strong>المستلم:</strong> {selectedOrderDetails.recipient?.name} - {selectedOrderDetails.recipient?.city} ({selectedOrderDetails.recipient?.addressDetails})</p>
              <p>📅 <strong>موعد التوصيل:</strong> {selectedOrderDetails.recipient?.deliveryDate} - {selectedOrderDetails.recipient?.deliveryTimeSlot}</p>
              <p>💳 <strong>وسيلة الدفع:</strong> {selectedOrderDetails.paymentMethod}</p>
            </div>

            {/* Gift Card Message */}
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block mb-1">💌 رسالة كرت الإهداء المرفق:</span>
              <p className="italic text-stone-700 bg-white p-2.5 rounded-xl border border-amber-100 leading-relaxed">
                "{selectedOrderDetails.recipient?.cardMessage}"
              </p>
            </div>

            {/* Order Items */}
            <div>
              <h5 className="font-bold text-xs text-stone-800 mb-2">الباقات المشمولة:</h5>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedOrderDetails.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 bg-stone-50 rounded-xl">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-bold text-rose-700">{item.price * item.quantity} ر.س</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-stone-200 font-black text-sm mt-2">
                <span>المجموع الكلي:</span>
                <span className="text-rose-700">{selectedOrderDetails.total} ر.س</span>
              </div>
            </div>

            {/* Update status inline */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-600">تغيير الحالة:</span>
              <select
                value={selectedOrderDetails.status}
                onChange={(e) => handleUpdateOrderStatus(selectedOrderDetails.id, e.target.value)}
                className="bg-stone-100 border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-bold text-stone-800"
              >
                <option value="received">قيد الاستلام</option>
                <option value="in_preparation">جاري التنسيق</option>
                <option value="out_for_delivery">خرج للتوصيل</option>
                <option value="delivered">تم التسليم ✓</option>
                <option value="cancelled">ملغي ✕</option>
              </select>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT PRODUCT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 relative animate-fade-in max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
              <h3 className="font-black text-lg text-stone-900">
                {editingProduct ? 'تعديل بيانات الباقة' : 'إضافة باقة ورد جديدة'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="font-bold text-stone-700 block mb-1">اسم الباقة *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: باقة شغف الجوري المخملي"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">الوصف المختصر</label>
                <input
                  type="text"
                  placeholder="مثال: 30 وردة هولندية مع غلاف أنيق"
                  value={productForm.subtitle}
                  onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">السعر (ر.س) *</label>
                  <input
                    type="number"
                    required
                    placeholder="250"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">السعر قبل الخصم (اختياري)</label>
                  <input
                    type="number"
                    placeholder="300"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">التصنيف</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold"
                  >
                    <option value="romantic">حب ورومانسية</option>
                    <option value="graduation">تخرج وإنجاز</option>
                    <option value="newborn">استقبال مواليد</option>
                    <option value="luxury">فازات وتنسيقات فاخرة</option>
                    <option value="gifts">ورود وهدايا</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">المخزون المتوفر</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">رابط الصورة (URL)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none text-left"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">أنواع الزهور (افصل بفاصلة)</label>
                <input
                  type="text"
                  placeholder="جوري أحمر, بيبي روز, لافندر"
                  value={productForm.flowerTypes}
                  onChange={(e) => setProductForm({ ...productForm, flowerTypes: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">الوصف الكامل للباقة</label>
                <textarea
                  rows="3"
                  placeholder="اكتب تفاصيل تنسيق الباقة ومناسبتها..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={productForm.featured}
                  onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <label htmlFor="featuredCheck" className="font-bold text-stone-800">
                  عرض كباقة مميزة في الصفحة الرئيسية
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-2xl shadow-md transition-all text-xs"
              >
                {editingProduct ? 'حفظ التعديلات' : 'إضافة الباقة للمتجر'}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
