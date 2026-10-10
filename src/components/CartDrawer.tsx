import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckoutModal } from './CheckoutModal';
import { X, Trash2, ShoppingBag, ArrowRight, Scale, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    totalCartWeightGrams,
    cartSubtotalCatalog,
    cartSubtotalWholesale,
    cartPotentialCommission,
    currentUser,
  } = useApp();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const isVendor = currentUser.role === 'vendedor';
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const weightKg = (totalCartWeightGrams / 1000).toFixed(2);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white border-l border-[#b3925d]/30 text-[#1a1715] flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-[#141211] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#d4145a] flex items-center justify-center text-white">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-cinzel font-bold text-sm text-[#ecd08c]">
                    Bolsa de Pedido ({totalItems})
                  </h3>
                  <p className="text-[10px] text-zinc-300">
                    Imperio Florigan • Catálogo Oficial
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Weight Banner */}
            {cart.length > 0 && (
              <div className="px-4 py-2 bg-[#faf8f5] border-b border-zinc-200 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-zinc-600 font-medium">
                  <Scale className="w-3.5 h-3.5 text-[#b3925d]" /> Peso del Paquete:
                </span>
                <span className="font-bold text-[#141211] bg-white px-2 py-0.5 rounded border border-zinc-200">
                  {weightKg} kg ({totalCartWeightGrams} g)
                </span>
              </div>
            )}

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-zinc-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-25" />
                  <p className="text-sm font-cinzel text-zinc-600">Tu bolsa está vacía</p>
                  <p className="text-xs text-zinc-400 mt-1">Explora las colecciones y agrega productos para cotizar envío.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-4 py-2 bg-[#141211] text-[#ecd08c] rounded-xl text-xs font-bold hover:bg-[#25201d]"
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.presentation.sku}
                    className="p-3 bg-zinc-50 hover:bg-zinc-100/70 rounded-2xl border border-zinc-200 flex gap-3 transition-colors"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-16 object-contain bg-white rounded-xl p-1 border border-zinc-200 shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-[#b3925d] font-semibold">
                            {item.line}
                          </span>
                          <h4 className="text-xs font-bold text-[#141211] line-clamp-1">
                            {item.productName}
                          </h4>
                          <span className="text-[10px] text-zinc-500 font-medium">
                            {item.presentation.size} • {item.presentation.weightGrams}g
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.presentation.sku)}
                          className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-200">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-zinc-300 rounded-lg bg-white overflow-hidden text-xs">
                          <button
                            onClick={() => updateCartQuantity(item.presentation.sku, -1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-zinc-100 text-zinc-600"
                          >
                            -
                          </button>
                          <span className="w-7 text-center font-bold text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.presentation.sku, 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-zinc-100 text-zinc-600"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-xs font-black text-[#d4145a]">
                            ${item.presentation.price * item.quantity} MXN
                          </div>
                          {isVendor && (
                            <div className="text-[9px] text-[#b3925d] font-bold">
                              Mayoreo: ${ (item.presentation.wholesalePrice || Math.round(item.presentation.price * 0.65)) * item.quantity }
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-zinc-200 bg-[#faf8f5] space-y-3">
                
                {/* Vendor Profit Ribbon */}
                {isVendor && cartPotentialCommission > 0 && (
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#b3925d]/20 to-[#ecd08c]/20 border border-[#b3925d]/40 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 font-bold text-[#8c6e3d]">
                      <Sparkles className="w-3.5 h-3.5 text-[#b3925d]" /> Ganancia Vendedora:
                    </span>
                    <span className="font-black text-[#8c6e3d] text-sm">
                      +${cartPotentialCommission.toLocaleString('es-MX')} MXN
                    </span>
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Subtotal Catálogo:</span>
                    <span className="font-bold">${cartSubtotalCatalog.toLocaleString('es-MX')} MXN</span>
                  </div>
                  {isVendor && (
                    <div className="flex justify-between text-[#8c6e3d] font-bold">
                      <span>Costo Vendedora a Liquidar:</span>
                      <span>${cartSubtotalWholesale.toLocaleString('es-MX')} MXN</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Flete Nacional:</span>
                    <span>Se calcula en el siguiente paso</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={clearCart}
                    className="p-2 text-zinc-400 hover:text-red-600 rounded-xl hover:bg-zinc-100 transition-colors"
                    title="Vaciar Carrito"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#d4145a] via-[#e8226e] to-[#b3925d] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#d4145a]/25 hover:brightness-110 active:scale-98 transition-all"
                  >
                    <span>Cotizar Envío y Pagar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};
