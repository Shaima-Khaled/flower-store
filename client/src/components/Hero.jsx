import React from 'react';
import { Truck, Sparkles, Heart, ShieldCheck, Clock, Award } from 'lucide-react';

export default function Hero({ onExploreClick, onOpenTracker }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-rose-100/60 via-amber-50/40 to-stone-50 pt-10 pb-16 border-b border-rose-100">
      
      {/* Background Floral Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Text Content */}
          <div className="lg:col-span-7 text-center lg:text-right space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold shadow-sm">
              <Sparkles className="w-4 h-4 text-rose-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>تشكيلة حصرية من الزهور الهولندية الطبيعية الفاخرة</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 leading-tight">
              أصدق المشاعر تُروى{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-800 underline decoration-rose-300 decoration-wavy decoration-2">
                ببتلات الورد
              </span>
            </h1>

            <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              في متجر <strong>زُهور ريفان</strong>، نصنع من الورود الطبيعية حكايات تلامس القلوب. باقات منسقة بأيدي خبراء تنسيق محترفين لتناسب أفراحكم، تخرجكم، ومناسباتكم الغالية، مع كرت إهداء فاخر وتوصيل سريع.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-rose-200 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 text-base flex items-center gap-2"
              >
                <span>تصفح الباقات الفاخرة</span>
                <span>←</span>
              </button>

              <button
                onClick={onOpenTracker}
                className="bg-white hover:bg-stone-100 text-stone-700 font-bold px-6 py-3.5 rounded-2xl border border-stone-200 hover:border-stone-300 transition-all text-base flex items-center gap-2 shadow-sm"
              >
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>متابعة حالة طلبك</span>
              </button>
            </div>

          </div>

          {/* Featured Visual Banner Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative card frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <img
                  src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=85"
                  alt="باقة الجوري الفاخرة"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-2">
                    الأكثر طلباً هذا الأسبوع 🔥
                  </span>
                  <h3 className="text-xl font-bold">باقة شغف الجوري الملكي</h3>
                  <p className="text-stone-200 text-xs mt-1">30 وردة هولندية مع غلاف مخملي أسود فاخر</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
                    <span className="text-2xl font-black text-rose-300">249 ر.س</span>
                    <button 
                      onClick={onExploreClick}
                      className="bg-white/20 hover:bg-white text-white hover:text-stone-900 text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-sm transition-all"
                    >
                      طلب فوري
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute -bottom-6 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3 hidden sm:flex animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
                  ★ 4.9
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">+500 عميل سعيد</p>
                  <p className="text-[11px] text-stone-500">جودة وثبات يدوم طويلاً</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Perks Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-8 border-t border-rose-200/60">
          
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">توصيل في نفس اليوم</h4>
              <p className="text-xs text-stone-500">خلال 2 إلى 4 ساعات</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">ورود هولندية طازجة</h4>
              <p className="text-xs text-stone-500">ضمان نضارة لأطول فترة</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">كرت إهداء مجاني</h4>
              <p className="text-xs text-stone-500">طباعة رسالتك الخاصة</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-stone-200/80 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900">دفع آمن 100%</h4>
              <p className="text-xs text-stone-500">مدى، Apple Pay، عند الاستلام</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
