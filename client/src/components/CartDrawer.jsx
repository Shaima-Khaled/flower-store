import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  discountCode,
  setDiscountCode,
  discountAmount,
  setDiscountAmount
}) {
  const [couponInput, setCouponInput] = useState(discountCode || '');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(discountCode === 'WARD10');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeShippingThreshold = 350;
  const isFreeDelivery = subtotal >= freeShippingThreshold;
  const deliveryFee = isFreeDelivery || items.length === 0 ? 0 : 25;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim().toUpperCase() === 'WARD10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setDiscountCode('WARD10');
      setCouponSuccess(true);
      setCouponError('');
    } else {
      setCouponError('رمز الكوبون غير صحيح. جرب WARD10');
      setCouponSuccess(false);
      setDiscountAmount(0);
      setDiscountCode('');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponInput('');
    setDiscountAmount(0);
    setDiscountCode('');
    setCouponSuccess(false);
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-sm flex justify-start">
      
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div 
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-stone-900">سلة المشتريات</h2>
              <span className="text-xs text-stone-500">
                {items.length === 0 ? 'السلة فارغة' : `${items.reduce((c, i) => c + i.quantity, 0)} باقات منتقاة`}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        {items.length > 0 && (
          <div className="bg-rose-50 px-5 py-2.5 border-b border-rose-100 text-xs">
            {isFreeDelivery ? (
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>تهانينا! لقد حصلت على توصيل مجاني لباقاتك 🎉</span>
              </div>
            ) : (
              <div>
                <p className="text-stone-600 mb-1">
                  أضف بـ <strong className="text-rose-700">{freeShippingThreshold - subtotal} ر.س</strong> إضافية لتستمتع بالتوصيل المجاني!
                </p>
                <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-lg text-stone-800">سلتك بانتظار عطرك!</h3>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                لم تقم بإضافة أي باقات بعد. استكشف تشكيلتنا الفاخرة واختر ما يناسب مناسبتك الجميلة.
              </p>
              <button
                onClick={onClose}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-md shadow-rose-200 transition-all"
              >
                تصفح ورود البوتيك
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl border border-stone-200 bg-white hover:border-rose-200 transition-all shadow-sm"
              >
                {/* Thumbnail */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-stone-900 truncate">
                    {item.name}
                  </h4>
                  <div className="text-xs font-bold text-rose-700 mt-0.5">
                    {item.price} ر.س
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-400 hover:text-red-500 p-1 transition-colors"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subtotal for item */}
                <div className="text-left shrink-0">
                  <span className="font-extrabold text-sm text-stone-900">
                    {item.price * item.quantity} ر.س
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50/70 space-y-4">
            
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="كوبون الخصم (جرب WARD10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    disabled={couponSuccess}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 pr-8 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5" />
                </div>
                {couponSuccess ? (
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-3 py-2 rounded-xl border border-red-200"
                  >
                    إلغاء
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                  >
                    تطبيق
                  </button>
                )}
              </div>
              {couponSuccess && (
                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  تم تطبيق خصم 10% بنجاح!
                </p>
              )}
              {couponError && (
                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {couponError}
                </p>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
              <div className="flex justify-between">
                <span>مجموع المنتجات:</span>
                <span className="font-semibold text-stone-900">{subtotal} ر.س</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>خصم الكوبون:</span>
                  <span>- {discountAmount} ر.س</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>رسوم التوصيل:</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-600 font-bold">مجاني 🚀</strong>
                  ) : (
                    `${deliveryFee} ر.س`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-300 font-black text-base text-stone-900">
                <span>الإجمالي النهائي:</span>
                <span className="text-rose-700 text-lg">{finalTotal} ر.س</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-rose-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm active:scale-98"
            >
              <span>المتابعة لإتمام الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>

    </div>
  );
}
