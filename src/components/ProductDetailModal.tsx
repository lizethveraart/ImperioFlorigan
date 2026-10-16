import React, { useState } from 'react';
import { Product, ProductPresentation } from '../types';
import { useApp } from '../context/AppContext';
import { X, Check, ShoppingBag, Send, AlertTriangle, ShieldCheck, Sparkles, Scale } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, currentUser, setIsCartOpen } = useApp();

  if (!product) return null;

  const [selectedPres, setSelectedPres] = useState<ProductPresentation>(product.presentations[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const isLowStock = selectedPres.stock <= 5;
  const isOutOfStock = selectedPres.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedPres, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const text = `🌸 *Catálogo Florigan Desde 1975*\n\nHola, me interesa ordenar el siguiente producto:\n✨ *${product.name}*\n📦 Presentación: ${selectedPres.size}\n💰 Precio de Catálogo: $${selectedPres.price} MXN\n🌿 Línea: ${product.line}\n\n¿Tienes disponibilidad para envío nacional inmediato?`;
    const url = `https://wa.me/520000000000?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#b3925d]/30 text-[#1a1715]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Product Image & Badges */}
          <div className="relative bg-[#fcfbfa] flex items-center justify-center p-4 sm:p-6 border-b md:border-b-0 md:border-r border-[#eee]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-48 sm:max-h-72 w-auto object-contain rounded-xl shadow-md transition-transform duration-300 hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#141211] text-[#ecd08c] shadow-sm">
                {product.code}
              </span>
              {product.isFeatured && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#d4145a] text-white shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Destacado
                </span>
              )}
            </div>
          </div>

          {/* Details & Actions */}
          <div className="p-5 sm:p-6 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#b3925d]">
                {product.line}
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#141211] mt-0.5">
                {product.name}
              </h2>
              <p className="text-xs text-[#a10e43] font-medium italic mt-1">
                "{product.tagline}"
              </p>

              <p className="text-xs text-zinc-600 mt-2.5 leading-relaxed">
                {product.description}
              </p>

              {/* Key Ingredients */}
              <div className="mt-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Extractos & Activos Naturales:
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.keyIngredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[#faf8f5] text-[#8c6e3d] text-[10px] font-semibold rounded-md border border-[#ecd08c]/40"
                    >
                      🌿 {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Benefits list */}
              <div className="mt-3 space-y-1">
                {product.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-zinc-700">
                    <Check className="w-3.5 h-3.5 text-[#d4145a] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {/* Presentation Selector */}
              <div className="mt-4 pt-3 border-t border-zinc-100">
                <label className="text-xs font-bold text-zinc-700 block mb-1.5">
                  Selecciona Presentación:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.presentations.map(pres => {
                    const isSelected = selectedPres.sku === pres.sku;
                    return (
                      <button
                        key={pres.sku}
                        onClick={() => setSelectedPres(pres)}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'border-[#d4145a] bg-[#d4145a]/5 shadow-sm'
                            : 'border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="text-xs font-bold text-[#141211]">{pres.size}</div>
                        <div className="text-sm font-black text-[#d4145a]">${pres.price} MXN</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock and Weight Status */}
              <div className="mt-3 flex items-center justify-between text-xs py-2 px-3 bg-zinc-50 rounded-lg">
                <div className="flex items-center gap-1.5 text-zinc-600">
                  <Scale className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Peso: {(selectedPres.weightGrams / 1000).toFixed(2)} kg</span>
                </div>
                <div>
                  {isOutOfStock ? (
                    <span className="text-red-600 font-bold">Agotado temporalmente</span>
                  ) : isLowStock ? (
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> ¡Solo quedan {selectedPres.stock} pzas!
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> En bodega ({selectedPres.stock} pzas)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Quantity, Add to Cart, WhatsApp */}
            <div className="mt-5 pt-3 border-t border-zinc-100 space-y-2">
              <div className="flex items-center gap-3">
                
                {/* Quantity Stepper */}
                <div className="flex items-center border border-zinc-200 rounded-xl bg-white shadow-sm overflow-hidden">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-10 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-xs">{quantity}</span>
                  <button
                    disabled={quantity >= selectedPres.stock}
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-10 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#d4145a] to-[#a10e43] text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#d4145a]/25 hover:brightness-110 active:scale-98 disabled:opacity-40 transition-all uppercase"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {isOutOfStock ? 'Agotado' : `Agregar al Carrito • $${selectedPres.price * quantity}`}
                </button>
              </div>

              {addedToast && (
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
                  <span>✓ Agregado al carrito de compra</span>
                  <button
                    onClick={() => {
                      onClose();
                      setIsCartOpen(true);
                    }}
                    className="underline text-emerald-900"
                  >
                    Ver Carrito
                  </button>
                </div>
              )}

              {/* WhatsApp Share Button */}
              <button
                onClick={shareViaWhatsApp}
                className="w-full h-9 rounded-xl border border-emerald-600/30 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Atender o cotizar por WhatsApp (+52 000 000 0000)
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
