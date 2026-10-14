import React, { useState } from 'react';
import { X, Star, Plus, Minus, Heart, ShieldCheck, Sparkles, Check, Droplets, Sun, Calendar } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-stone-200 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Image Side */}
          <div className="relative aspect-square md:aspect-auto bg-stone-100 min-h-[300px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-medium">
              {product.categoryName}
            </div>
          </div>

          {/* Details Side */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Rating & Stock */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-stone-400 font-normal">({product.reviewsCount} تقييم حقيقي)</span>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                  متوفر جاهز للشحن
                </span>
              </div>

              {/* Title & Price */}
              <div>
                <h2 className="text-2xl font-black text-stone-900 leading-snug">
                  {product.name}
                </h2>
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-3xl font-black text-rose-700">
                    {product.price} <span className="text-sm font-semibold">ر.س</span>
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-stone-400 line-through">
                      {product.originalPrice} ر.س
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-stone-600 text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Flower types list */}
              {product.flowerTypes && (
                <div>
                  <h4 className="text-xs font-bold text-stone-800 mb-1.5">مكونات التنسيق:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.flowerTypes.map((flower, idx) => (
                      <span key={idx} className="bg-rose-50 text-rose-800 text-xs px-2.5 py-1 rounded-lg font-medium border border-rose-100">
                        🌸 {flower}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Care Tips Box */}
              {product.careTips && (
                <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-3.5 text-xs text-stone-700 space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-amber-600" />
                    <span>نصيحة خبير العناية بالورد:</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed pr-5">
                    {product.careTips}
                  </p>
                </div>
              )}

            </div>

            {/* Actions: Quantity & Add to Cart */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              
              <div className="flex items-center justify-between gap-4">
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 shadow-sm transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-extrabold text-sm w-6 text-center text-stone-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-xl bg-white hover:bg-stone-200 flex items-center justify-center text-stone-700 shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Total for quantity */}
                <div className="text-left">
                  <span className="text-xs text-stone-400 block">الإجمالي</span>
                  <span className="font-bold text-base text-stone-900">
                    {product.price * quantity} ر.س
                  </span>
                </div>

              </div>

              {/* Add Button */}
              <button
                onClick={handleAdd}
                disabled={addedSuccess}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                  addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 active:scale-98'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>تمت الإضافة إلى سلتك بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>إضافة إلى سلة المشتريات</span>
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
