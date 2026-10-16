import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Package, AlertTriangle, Truck, Bell, X, ArrowRight } from 'lucide-react';

export const PushToastBanner: React.FC = () => {
  const { activePushToast, dismissPushToast, setCurrentTab } = useApp();

  if (!activePushToast) return null;

  const isNewProduct = activePushToast.type === 'new_product';
  const isInventoryUpdate = activePushToast.type === 'inventory_update';
  const isStockAlert = activePushToast.type === 'stock_alert';
  const isOrder = activePushToast.type === 'order_update';

  const handleAction = () => {
    dismissPushToast();
    if (isNewProduct || isInventoryUpdate) {
      setCurrentTab('catalog');
    } else if (isOrder) {
      setCurrentTab('orders');
    }
  };

  return (
    <div className="fixed top-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-full z-50 sm:max-w-md animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto">
      <div className="bg-[#141211] border-2 border-[#b3925d] text-white p-4 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-xl">
        
        {/* Glow accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b3925d] via-[#ecd08c] to-[#d4145a] animate-pulse" />

        <div className="flex items-start gap-3">
          
          {/* Icon Badge */}
          <div className="mt-0.5 shrink-0">
            {isNewProduct ? (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d4145a] to-[#ecd08c] p-0.5 shadow-lg shadow-[#d4145a]/30">
                <div className="w-full h-full bg-[#141211] rounded-full flex items-center justify-center text-[#ecd08c]">
                  <Sparkles className="w-5 h-5 text-[#ecd08c]" />
                </div>
              </div>
            ) : isInventoryUpdate ? (
              <div className="w-10 h-10 rounded-full bg-[#b3925d]/20 border border-[#b3925d] flex items-center justify-center text-[#ecd08c] shadow-lg">
                <Package className="w-5 h-5" />
              </div>
            ) : isStockAlert ? (
              <div className="w-10 h-10 rounded-full bg-red-900/40 border border-red-500 flex items-center justify-center text-red-400 shadow-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-900/40 border border-emerald-500 flex items-center justify-center text-emerald-400 shadow-lg">
                <Truck className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pr-6">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9px] font-bold tracking-widest uppercase text-[#ecd08c] bg-[#b3925d]/20 px-2 py-0.5 rounded-full border border-[#b3925d]/30">
                {isNewProduct
                  ? '✨ NUEVO PRODUCTO'
                  : isInventoryUpdate
                  ? '📦 RESURTIDO ADMIN'
                  : 'NOTIFICACIÓN PUSH'}
              </span>
              <span className="text-[10px] text-zinc-400">• Ahora</span>
            </div>

            <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white tracking-wide">
              {activePushToast.title}
            </h4>

            <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed line-clamp-2">
              {activePushToast.message}
            </p>

            {/* Quick Action Button */}
            {(isNewProduct || isInventoryUpdate || isOrder) && (
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={handleAction}
                  className="px-3 py-1 bg-gradient-to-r from-[#d4145a] to-[#a10e43] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md hover:brightness-110 transition-all"
                >
                  <span>{isOrder ? 'Ver Mi Pedido' : 'Ver en Catálogo'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={dismissPushToast}
                  className="text-[10px] text-zinc-400 hover:text-white transition-colors"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={dismissPushToast}
            className="absolute top-3 right-3 p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>

        </div>
      </div>
    </div>
  );
};
