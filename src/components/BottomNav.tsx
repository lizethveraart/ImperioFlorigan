import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShoppingBag, PackageCheck, User as UserIcon, Menu } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, cart, setIsCartOpen, setIsNavigationDrawerOpen, currentUser, setIsAuthOpen } = useApp();
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleProfileClick = () => {
    if (!currentUser.email) {
      setIsAuthOpen(true);
    } else {
      setCurrentTab('profile');
    }
  };

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

        {/* Mis Pedidos y Guías */}
        <button
          onClick={() => setCurrentTab('orders')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'orders' ? 'text-[#ecd08c]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <PackageCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Mis Guías</span>
        </button>

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

        {/* Mi Panel / Mi Cuenta */}
        <button
          onClick={handleProfileClick}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            currentTab === 'profile' ? 'text-[#ecd08c]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <UserIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Mi Cuenta</span>
        </button>

        {/* Menú Desplegable */}
        <button
          onClick={() => setIsNavigationDrawerOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-zinc-400 hover:text-[#ecd08c] transition-colors"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Menú</span>
        </button>

      </div>
    </nav>
  );
};
