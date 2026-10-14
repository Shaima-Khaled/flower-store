import React from 'react';
import { 
  Sparkles, 
  Heart, 
  GraduationCap, 
  Baby, 
  Crown, 
  Gift, 
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  priceFilter,
  onPriceFilterChange
}) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-4 h-4" />;
      case 'Heart': return <Heart className="w-4 h-4 text-rose-500" />;
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-amber-500" />;
      case 'Baby': return <Baby className="w-4 h-4 text-cyan-500" />;
      case 'Crown': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'Gift': return <Gift className="w-4 h-4 text-purple-500" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 mb-8 space-y-5">
      
      {/* Category Pills */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-stone-800 text-sm flex items-center gap-2">
            <span>التصنيفات والمناسبات</span>
            <span className="text-xs text-stone-400 font-normal">اختر المناسبة التي تناسبك</span>
          </h3>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-200 scale-102'
                    : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700 hover:text-stone-900 border border-stone-200/60'
                }`}
              >
                {getIcon(cat.icon)}
                <span>{cat.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-stone-200 text-stone-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sorting & Filter controls */}
      <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
        
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-stone-400" />
          <span className="text-xs text-stone-500 font-medium">ترتيب حسب:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="featured">المميزة والأكثر طلباً</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
            <option value="rating">الأعلى تقييماً ★</option>
          </select>
        </div>

        {/* Max Price Filter */}
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-stone-400" />
          <span className="text-xs text-stone-500 font-medium">السعر الأقصى:</span>
          <input
            type="range"
            min="150"
            max="600"
            step="20"
            value={priceFilter}
            onChange={(e) => onPriceFilterChange(Number(e.target.value))}
            className="w-28 sm:w-36 accent-rose-600 cursor-pointer"
          />
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">
            {priceFilter} ر.س
          </span>
        </div>

      </div>

    </div>
  );
}
