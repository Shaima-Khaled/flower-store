import React from 'react';
import { Flower2, Phone, Mail, MapPin, Heart, ShieldCheck, Clock } from 'lucide-react';

export default function Footer({ onCategoryClick, onOpenTracker }) {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white">
                <Flower2 className="w-6 h-6" />
              </div>
              <span className="font-black text-xl text-white">زُهور ريفـان</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              بوتيك إلكتروني سعودي رائد متخصص في أرقى باقات الزهور الطبيعية الهولندية وتنسيقات الهدايا الملكية لجميع مناسباتكم السعيدة.
            </p>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>ننسق كل باقة بحب وعناية متناهية</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">التصنيفات السريعة</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onCategoryClick('romantic')} className="hover:text-rose-400 transition-colors">
                  • باقات الحب والرومانسية
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('graduation')} className="hover:text-rose-400 transition-colors">
                  • باقات التخرج والنجاح
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('luxury')} className="hover:text-rose-400 transition-colors">
                  • فازات وتنسيقات ملكية
                </button>
              </li>
              <li>
                <button onClick={() => onCategoryClick('gifts')} className="hover:text-rose-400 transition-colors">
                  • ورود مع شوكولاتة باتشي
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-rose-400 transition-colors">
                  • تتبع شحنة طلبك
                </button>
              </li>
            </ul>
          </div>

          {/* Delivery & Assurance */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">خدمة التوصيل</h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>توصيل سريع في نفس اليوم (الرياض، جدة، الدمام، الخبر)</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>سيارات مجهزة بنظام تبريد لحفظ نضارة الورد أثناء النقل</span>
              </div>
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>كرت إهداء مجاني مطبوع بخط فاخر مع كل طلب</span>
              </div>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">تواصل معنا</h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500" />
                <span dir="ltr">+966 55 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500" />
                <span>care@rivanflowers.sa</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>المملكة العربية السعودية - الرياض</span>
              </li>
            </ul>
            <div className="pt-2">
              <span className="text-[11px] text-stone-500 block mb-1">طرق الدفع المعتمدة:</span>
              <div className="flex items-center gap-2 text-stone-300 font-bold text-xs">
                <span className="bg-stone-800 px-2 py-1 rounded">مدى</span>
                <span className="bg-stone-800 px-2 py-1 rounded">Apple Pay</span>
                <span className="bg-stone-800 px-2 py-1 rounded">Visa</span>
                <span className="bg-stone-800 px-2 py-1 rounded">دفع عند الاستلام</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} زهور ريفان (Rivan Flowers). جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1">
            صنع بكل شغف لمحبي الورد الطبيعي 🌹
          </p>
        </div>

      </div>
    </footer>
  );
}
