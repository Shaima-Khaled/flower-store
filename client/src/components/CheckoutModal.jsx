import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Calendar, 
  Clock, 
  Heart, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle,
  FileText
} from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  discountCode,
  discountAmount,
  onOrderSuccess
}) {
  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Form State
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');

  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientCity, setRecipientCity] = useState('الرياض');
  const [recipientDistrict, setRecipientDistrict] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');

  // Delivery & Card State
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('المساء (4:00 م - 9:00 م)');
  const [cardMessage, setCardMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mada');

  // Pre-made message templates
  const templates = [
    'كل عام وأنت لقلبي وريد وحياة ❤️',
    'ألف مبارك النجاح والتخرج، فخورون بإنجازك دوماً 🎓',
    'حمداً لله على سلامتك ومبارك قدوم الملاك الصغير 👶🏻🌸',
    'شكراً لك من أعماق القلب على كل ما قدمته لنا 💐'
  ];

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal >= 350 ? 0 : 25;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!senderName || !senderPhone) {
      alert('يرجى كتابة اسم ورقم جوال صاحب الطلب');
      return;
    }

    if (!recipientName || !recipientAddress) {
      alert('يرجى كتابة اسم المستلم وتفاصيل العنوان');
      return;
    }

    setSubmitting(true);

    const payload = {
      customer: {
        name: senderName,
        phone: senderPhone,
        email: senderEmail
      },
      recipient: {
        name: recipientName,
        phone: recipientPhone || senderPhone,
        city: recipientCity,
        district: recipientDistrict,
        addressDetails: recipientAddress,
        cardMessage: cardMessage || 'مع أطيب الأمنيات والمحبة',
        deliveryDate: deliveryDate,
        deliveryTimeSlot: deliveryTimeSlot
      },
      items: items.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image
      })),
      discountCode: discountCode || '',
      paymentMethod: paymentMethod
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('حدث خطأ أثناء حفظ الطلب');
      }

      const orderData = await response.json();
      setCreatedOrder(orderData);
      setStep('success');
      onOrderSuccess(orderData);
    } catch (err) {
      console.error(err);
      alert('تعذر إتمام الطلب، يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-fade-in my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
              🌸
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-stone-900">
                {step === 'form' ? 'إتمام طلب باقة الورد' : 'تم استلام طلبك بنجاح!'}
              </h2>
              <p className="text-xs text-stone-500">
                {step === 'form' ? 'تنسيق فاخر وتوصيل بعناية فائقة' : 'شكراً لثقتكم ببوتيك زهور ريفان'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Section 1: Sender Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 text-rose-700">
                <User className="w-4 h-4" />
                <span>1. بياناتك (صاحب الطلب)</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">اسمك الكامل *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سارة الشمري"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">رقم الجوال *</label>
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">البريد الإلكتروني (اختياري للإشعار)</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Section 2: Recipient Info & Delivery Address */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 text-rose-700">
                <MapPin className="w-4 h-4" />
                <span>2. بيانات المستلم وعنوان التوصيل</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">اسم مستلم الهدية *</label>
                  <input
                    type="text"
                    required
                    placeholder="اسم الشخص المهدى له"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">جوال المستلم للتنسيق</label>
                  <input
                    type="tel"
                    placeholder="05XXXXXXXX (أو اترك فارغاً إذا كان رقمك)"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">المدينة *</label>
                  <select
                    value={recipientCity}
                    onChange={(e) => setRecipientCity(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
                  >
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="الخبر">الخبر</option>
                    <option value="مكة المكرمة">مكة المكرمة</option>
                    <option value="المدينة المنورة">المدينة المنورة</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">الحي</label>
                  <input
                    type="text"
                    placeholder="مثال: حي النخيل / حي الياسمين"
                    value={recipientDistrict}
                    onChange={(e) => setRecipientDistrict(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 block mb-1">العنوان بالتفصيل (اسم الشارع، رقم الفيلا أو الشقة) *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: شارع التحلية، برج النور، الدور 4"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Section 3: Delivery Timing & Card Message */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 text-rose-700">
                <Heart className="w-4 h-4" />
                <span>3. كرت الإهداء وموعد التوصيل</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">تاريخ التوصيل المطلوب *</label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-600 block mb-1">فترة التوصيل المفضلة</label>
                  <select
                    value={deliveryTimeSlot}
                    onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
                  >
                    <option value="الصباح (9:00 ص - 1:00 م)">الصباح (9:00 ص - 1:00 م)</option>
                    <option value="فترة الظهيرة (1:00 م - 5:00 م)">فترة الظهيرة (1:00 م - 5:00 م)</option>
                    <option value="المساء (4:00 م - 9:00 م)">المساء (4:00 م - 9:00 م)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-stone-600">رسالتك المطبوعة على كرت الإهداء الفاخر</label>
                  <span className="text-[11px] text-rose-600 font-bold">مجاني 💌</span>
                </div>
                <textarea
                  rows="3"
                  placeholder="اكتب كلماتك الصادقة هنا لتصل بأجمل صورة..."
                  value={cardMessage}
                  onChange={(e) => setCardMessage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none leading-relaxed"
                />

                {/* Quick Templates */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] text-stone-400 font-medium">رسائل مقترحة:</span>
                  {templates.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCardMessage(tmpl)}
                      className="text-[10px] bg-stone-100 hover:bg-rose-50 hover:text-rose-700 text-stone-600 px-2 py-1 rounded-lg transition-colors border border-stone-200"
                    >
                      {tmpl.slice(0, 22)}...
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Payment Method */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 text-rose-700">
                <CreditCard className="w-4 h-4" />
                <span>4. طريقة الدفع</span>
              </h3>

              <div className="grid grid-cols-3 gap-2.5">
                
                <label className={`flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'mada'
                    ? 'border-rose-600 bg-rose-50/70 text-rose-900 font-bold shadow-sm'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="mada"
                    checked={paymentMethod === 'mada'}
                    onChange={() => setPaymentMethod('mada')}
                    className="sr-only"
                  />
                  <CreditCard className="w-5 h-5 mb-1 text-rose-600" />
                  <span className="text-xs">مدى / فيزا</span>
                </label>

                <label className={`flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'border-rose-600 bg-rose-50/70 text-rose-900 font-bold shadow-sm'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="apple_pay"
                    checked={paymentMethod === 'apple_pay'}
                    onChange={() => setPaymentMethod('apple_pay')}
                    className="sr-only"
                  />
                  <span className="text-base font-bold mb-1"> Pay</span>
                  <span className="text-xs">Apple Pay</span>
                </label>

                <label className={`flex flex-col items-center justify-center p-3 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-rose-600 bg-rose-50/70 text-rose-900 font-bold shadow-sm'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="sr-only"
                  />
                  <Truck className="w-5 h-5 mb-1 text-emerald-600" />
                  <span className="text-xs">عند الاستلام</span>
                </label>

              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-rose-50/70 rounded-2xl p-4 border border-rose-100 text-xs space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>مجموع الورود:</span>
                <span className="font-bold text-stone-800">{subtotal} ر.س</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>الخصم المطبق:</span>
                  <span>- {discountAmount} ر.س</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>التوصيل:</span>
                <span>{deliveryFee === 0 ? 'مجاني' : `${deliveryFee} ر.س`}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-stone-900 pt-2 border-t border-rose-200">
                <span>المبلغ الإجمالي للدفع:</span>
                <span className="text-rose-700 text-base">{total} ر.س</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-rose-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <span>جاري تسجيل طلبكم وتجهيز الفاتورة...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>تأكيد الطلب ودفع ({total} ر.س)</span>
                </>
              )}
            </button>

          </form>
        ) : (
          /* Step Success View */
          <div className="p-8 text-center space-y-6">
            
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-stone-900">
                تم استلام طلبكم بنجاح ومحبة!
              </h3>
              <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                شكراً لاختياركم زهور ريفان. بدأ خبراؤنا الآن في انتقاء أجمل البتلات وتنسيق باقتكم بعناية.
              </p>
            </div>

            {/* Order Tracking Code Box */}
            <div className="bg-stone-100 p-4 rounded-2xl border border-stone-200 max-w-sm mx-auto flex items-center justify-between">
              <div className="text-right">
                <span className="text-[11px] text-stone-500 block">رقم تتبع الشحنة:</span>
                <span className="font-mono font-extrabold text-lg text-rose-700 tracking-wider">
                  {createdOrder?.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(createdOrder?.id)}
                className="bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold px-3 py-2 rounded-xl border border-stone-200 flex items-center gap-1.5 transition-all"
              >
                {copiedOrderId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedOrderId ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>

            {/* Summary Highlights */}
            <div className="text-xs text-stone-600 bg-rose-50/60 p-4 rounded-2xl max-w-sm mx-auto text-right space-y-1.5 border border-rose-100">
              <p>📍 <strong>المستلم:</strong> {createdOrder?.recipient?.name} ({createdOrder?.recipient?.city})</p>
              <p>📅 <strong>تاريخ التوصيل:</strong> {createdOrder?.recipient?.deliveryDate} - {createdOrder?.recipient?.deliveryTimeSlot}</p>
              <p>💌 <strong>كرت الإهداء:</strong> "{createdOrder?.recipient?.cardMessage}"</p>
            </div>

            <button
              onClick={onClose}
              className="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-8 py-3 rounded-2xl shadow-md transition-all"
            >
              العودة للمتجر
            </button>

          </div>
        )}

      </div>

    </div>
  );
}
