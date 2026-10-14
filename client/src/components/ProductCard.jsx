import React from 'react';
import { Star, Plus, Eye, Check, Sparkles } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onViewDetails,
  isAdded 
}) {
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      
      {/* Product Image Container */}
      <div className="relative overflow-hidden aspect-[4/3] bg-stone-100 cursor-pointer" onClick={() => onViewDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {discountPercent && (
            <span className="bg-rose-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md">
              خصم {discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="bg-amber-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              مميز
            </span>
          )}
        </div>

        {/* Category Tag bottom left */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
            {product.categoryName}
          </span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="bg-white text-stone-900 font-bold text-xs px-4 py-2 rounded-xl shadow-lg hover:bg-rose-50 hover:text-rose-600 transition-colors flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 duration-300"
          >
            <Eye className="w-4 h-4 text-rose-500" />
            <span>عرض التفاصيل</span>
          </button>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Rating & Stock */}
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
              <span className="text-stone-400 font-normal">({product.reviewsCount || 25})</span>
            </div>
            <div>
              {product.stock > 0 ? (
                <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                  متاح للتوصيل اليوم
                </span>
              ) : (
                <span className="text-[11px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-semibold">
                  نفذت الكمية
                </span>
              )}
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onViewDetails(product)}
            className="font-bold text-base sm:text-lg text-stone-900 hover:text-rose-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Short subtitle / excerpt */}
          <p className="text-stone-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {product.subtitle || product.description}
          </p>

          {/* Flower types pills */}
          {product.flowerTypes && product.flowerTypes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {product.flowerTypes.slice(0, 2).map((type, idx) => (
                <span key={idx} className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md font-medium">
                  {type}
                </span>
              ))}
              {product.flowerTypes.length > 2 && (
                <span className="text-[10px] text-stone-400 px-1 py-0.5 font-medium">
                  +{product.flowerTypes.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-xl text-rose-700">
                {product.price} <span className="text-xs font-semibold">ر.س</span>
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {product.originalPrice} ر.س
                </span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 block">شامل الضريبة والكرت</span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                : product.stock <= 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 hover:border-transparent shadow-sm'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>تمت الإضافة</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>إضافة</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
