import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  PackageCheck, 
  Flower2, 
  AlertCircle,
  MapPin,
  Calendar,
  Heart
} from 'lucide-react';

export default function OrderTrackerModal({ isOpen, onClose, initialOrderId }) {
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!orderIdInput.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/${orderIdInput.trim().toUpperCase()}`);
      if (!res.ok) {
        throw new Error('لم يتم العثور على طلب بهذا الرقم. تأكد من إدخال الرمز بشكل صحيح (مثال: ORD-1001)');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { key: 'received', title: 'تم استلام الطلب', desc: 'تم تسجيل الطلب وتأكيد الدفع', icon: CheckCircle2 },
    { key: 'in_preparation', title: 'جاري التنسيق والتجهيز', desc: 'تنسيق الأزهار الطازجة وإعداد كرت الإهداء', icon: Flower2 },
    { key: 'out_for_delivery', title: 'خرج للتوصيل', desc: 'الطلب مع المندوب في طريقه إلى المستلم', icon: Truck },
    { key: 'delivered', title: 'تم التسليم بنجاح', desc: 'وصلت مشاعرك وباقاتك لأصحابها', icon: PackageCheck }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'received': return 0;
      case 'in_preparation': return 1;
      case 'out_for_delivery': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      
      <div 
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-stone-900">تتبع مسار طلبك</h2>
              <p className="text-xs text-stone-500">متابعة حية لحالة تنسيق وتوصيل باقة الورد</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Form */}
        <div className="p-6 border-b border-stone-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="أدخل رقم الطلب (مثال: ORD-1001)"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full bg-stone-100 border border-stone-200 rounded-2xl px-4 py-3 pr-11 text-sm font-mono uppercase focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-4 top-4" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition-all shrink-0"
            >
              {loading ? 'بحث...' : 'تتبع الآن'}
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-stone-500">
            <span>طلبات تجريبية:</span>
            <button 
              type="button" 
              onClick={() => { setOrderIdInput('ORD-1001'); }} 
              className="underline text-rose-600 hover:text-rose-800"
            >
              ORD-1001
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => { setOrderIdInput('ORD-1002'); }} 
              className="underline text-rose-600 hover:text-rose-800"
            >
              ORD-1002
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Details Body */}
        {order && (
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            
            {/* Status Header */}
            <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-500 block">رقم الطلب</span>
                <span className="font-mono font-black text-rose-800 text-base">{order.id}</span>
              </div>
              <div className="text-left">
                <span className="text-[11px] text-stone-500 block">تاريخ الإنشاء</span>
                <span className="text-xs font-semibold text-stone-700">
                  {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="py-2 space-y-6">
              {steps.map((stepItem, idx) => {
                const IconComponent = stepItem.icon;
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={stepItem.key} className="flex items-start gap-4 relative">
                    
                    {/* Vertical connecting line */}
                    {idx < steps.length - 1 && (
                      <div 
                        className={`absolute right-4.5 top-9 w-0.5 h-10 ${
                          idx < currentStepIndex ? 'bg-emerald-500' : 'bg-stone-200'
                        }`} 
                      />
                    )}

                    {/* Step Icon */}
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all ${
                      isCurrent
                        ? 'bg-rose-600 text-white ring-4 ring-rose-100 shadow-md scale-105'
                        : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-stone-100 text-stone-400'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {/* Step Texts */}
                    <div className="flex-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold ${isCurrent ? 'text-rose-700' : isPassed ? 'text-stone-900' : 'text-stone-400'}`}>
                          {stepItem.title}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-bold animate-pulse">
                            الحالة الحالية
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {stepItem.desc}
                      </p>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Delivery & Recipient Info */}
            <div className="border-t border-stone-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-800 flex items-center gap-1.5 text-stone-600">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>المستلم والتوصيل:</span>
                </span>
                <p className="font-bold text-stone-900">{order.recipient?.name}</p>
                <p className="text-stone-500">{order.recipient?.city} - {order.recipient?.district || ''} - {order.recipient?.addressDetails}</p>
              </div>

              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-800 flex items-center gap-1.5 text-stone-600">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>موعد التسليم:</span>
                </span>
                <p className="font-bold text-stone-900">{order.recipient?.deliveryDate}</p>
                <p className="text-stone-500">{order.recipient?.deliveryTimeSlot}</p>
              </div>
            </div>

            {/* Gift Card Message Box */}
            {order.recipient?.cardMessage && (
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  <span>نص بطاقة الإهداء:</span>
                </span>
                <p className="italic text-stone-700 leading-relaxed bg-white/70 p-3 rounded-xl border border-amber-100">
                  "{order.recipient?.cardMessage}"
                </p>
              </div>
            )}

            {/* Order Items */}
            <div className="border-t border-stone-200 pt-3">
              <h5 className="text-xs font-bold text-stone-800 mb-2">المنتجات المطلوبة:</h5>
              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-stone-50 p-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <img src={item.image} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-stone-800 block">{item.name}</span>
                        <span className="text-[11px] text-stone-500">الكمية: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-rose-700">{item.price * item.quantity} ر.س</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
