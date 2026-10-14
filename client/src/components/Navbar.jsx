import React from 'react';
import { ShoppingBag, Search, Compass, ShieldCheck, HeartHandshake, Flower2, LayoutDashboard, Truck } from 'lucide-react';

export default function Navbar({ 
  cartCount, 
  onOpenCart, 
  onOpenTracker, 
  activeView, 
  setActiveView, 
  searchTerm, 
  setSearchTerm,
  cartTotal 
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block animate-pulse">🌸</span>
        <span>توصيل مجاني لجميع الطلبات فوق 350 ر.س | استخدم الكوبون <strong className="bg-white/20 px-1.5 py-0.5 rounded font-mono text-yellow-200">WARD10</strong> لخصم 10% فوري</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveView('store')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <Flower2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-2xl tracking-tight text-stone-900 group-hover:text-rose-700 transition-colors">
                  زُهور ريفـان
                </span>
                <span className="text-xs bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
                  بوتيك فاخر
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block">RIVAN FLOWERS & GIFTS</p>
            </div>
          </div>

          {/* Search Bar (Only on store view) */}
          {activeView === 'store' && (
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن باقة، نوع ورد (جوري، توليب، لافندر)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-stone-100/80 border border-stone-200 rounded-full py-2.5 pr-11 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all"
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-4 top-3.5" />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute left-3 top-2.5 text-xs text-stone-400 hover:text-stone-600 bg-stone-200 hover:bg-stone-300 rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Store / Admin toggle button */}
            {activeView === 'store' ? (
              <button
                onClick={() => setActiveView('admin')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:text-rose-700 hover:bg-rose-50 transition-all border border-stone-200 hover:border-rose-200"
                title="لوحة التحكم بالإدارة"
              >
                <LayoutDashboard className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">لوحة الإدارة</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('store')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-all border border-rose-200"
              >
                <Flower2 className="w-4 h-4" />
                <span>العودة للمتجر</span>
              </button>
            )}

            {/* Track Order Button */}
            <button
              onClick={onOpenTracker}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-stone-700 hover:text-rose-700 hover:bg-rose-50 transition-all border border-stone-200 hover:border-rose-200"
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">تتبع طلبك</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-rose-200 hover:shadow-lg transition-all active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline">السلة</span>
              {cartCount > 0 && (
                <span className="bg-white text-rose-700 font-extrabold text-xs px-2 py-0.5 rounded-full shadow-inner animate-fade-in">
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="hidden lg:inline text-xs text-rose-100 font-normal border-r border-rose-400 pr-2">
                  {cartTotal} ر.س
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search Bar */}
        {activeView === 'store' && (
          <div className="pb-3 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن باقة أو نوع ورد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-stone-100 border border-stone-200 rounded-full py-2 pr-10 pl-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
