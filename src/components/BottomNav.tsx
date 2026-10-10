import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Users, ShoppingBag, PackageCheck, BarChart3, Shield } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, currentUser, cart, setIsCartOpen } = useApp();
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#141211]/95 backdrop-blur-lg border-t border-[#b3925d]/30 z-40 px-2 py-1 shadow-2xl">
      <div className="flex items-center justify-around h-15">
        
        {/* Catálogo */}
        <button
          onClick={() => setCurrentTab('catalog')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'catalog' ? 'text-[#ecd08c]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Catálogo</span>
        </button>

        {/* Clientes (Vendedor) */}
        {currentUser.role === 'vendedor' && (
          <button
            onClick={() => setCurrentTab('clients')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              currentTab === 'clients' ? 'text-[#ecd08c]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Clientes</span>
          </button>
        )}

        {/* Floating Center Carrito */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center -mt-5 mx-1"
        >
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#d4145a] via-[#e8226e] to-[#b3925d] flex items-center justify-center shadow-xl shadow-[#d4145a]/40 border-3 border-[#141211] hover:scale-105 active:scale-95 transition-transform text-white">
            <ShoppingBag className="w-6 h-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-[#d4145a] font-black text-[10px] px-1.5 py-0.5 rounded-full shadow-md">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-semibold text-[#ecd08c] mt-0.5">Carrito</span>
        </button>

        {/* Pedidos */}
        <button
          onClick={() => setCurrentTab('orders')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'orders' ? 'text-[#ecd08c]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <PackageCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Pedidos</span>
        </button>

        {/* Reportes (Solo Admin) */}
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setCurrentTab('analytics')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              currentTab === 'analytics' ? 'text-[#ecd08c]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Reportes</span>
          </button>
        )}

        {/* Admin (if admin) */}
        {currentUser.role === 'admin' && (
          <button
            onClick={() => setCurrentTab('admin')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              currentTab === 'admin' ? 'text-[#ecd08c]' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shield className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Admin</span>
          </button>
        )}

      </div>
    </nav>
  );
};
