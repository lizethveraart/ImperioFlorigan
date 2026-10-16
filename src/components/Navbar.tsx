import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Bell, User as UserIcon, Sparkles, Menu } from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const {
    currentUser,
    cart,
    setIsCartOpen,
    unreadNotificationsCount,
    setCurrentTab,
    setIsAuthOpen,
    setIsNavigationDrawerOpen,
  } = useApp();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleProfileClick = () => {
    if (!currentUser.email) {
      setIsAuthOpen(true);
    } else {
      setCurrentTab('profile');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#141211]/95 backdrop-blur-md border-b border-[#b3925d]/30 text-white shadow-xl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#8c6e3d] via-[#b3925d] to-[#d4145a] py-1 px-3 text-center text-[10px] sm:text-[11px] font-medium tracking-wider text-white shadow-sm flex items-center justify-center gap-1.5 overflow-hidden">
        <Sparkles className="w-3 h-3 shrink-0 animate-pulse text-amber-200" />
        <span className="font-medium tracking-wide truncate sm:whitespace-normal">
          <span className="sm:hidden">FLORIGAN 50 AÑOS • ENVÍOS A TODO MÉXICO</span>
          <span className="hidden sm:inline">FLORIGAN 50 AÑOS (1975 - 2025) • ENVÍOS NACIONALES DIRECTOS A TU HOGAR • COSMÉTICA & HERBOLARIA PURA</span>
        </span>
        <Sparkles className="w-3 h-3 shrink-0 animate-pulse text-amber-200" />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('catalog')} 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#b3925d] via-[#ecd08c] to-[#d4145a] p-0.5 flex items-center justify-center shadow-lg shadow-[#b3925d]/20 group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-[#141211] rounded-full flex items-center justify-center">
                <span className="font-cinzel font-bold text-sm sm:text-lg text-[#ecd08c]">F</span>
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-cinzel text-sm sm:text-xl font-bold tracking-wider sm:tracking-widest text-[#ecd08c]">
                  IMPERIO
                </span>
                <span className="font-cinzel text-sm sm:text-xl font-medium tracking-wide sm:tracking-wider text-white">
                  FLORIGAN
                </span>
              </div>
              <p className="text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] text-[#b3925d] uppercase -mt-0.5 sm:-mt-1 font-medium truncate">
                Venta Directa Oficial 1975
              </p>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 sm:p-2 text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              title="Notificaciones y Novedades"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#d4145a] text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-gradient-to-r from-[#d4145a] to-[#a10e43] text-white hover:brightness-110 shadow-md shadow-[#d4145a]/25 transition-all"
              title="Mi Carrito de Compra"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[11px] sm:text-xs font-bold">{cartItemsCount}</span>
            </button>

            {/* Customer Profile / Mi Cuenta Button (Desktop/Tablet) */}
            <button
              onClick={handleProfileClick}
              className="hidden sm:flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-full border border-[#b3925d]/50 hover:border-[#ecd08c] bg-white/5 hover:bg-white/10 transition-colors"
              title={currentUser.email ? `Panel de ${currentUser.name}` : 'Iniciar Sesión'}
            >
              {currentUser.email ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#d4145a] to-[#b3925d] flex items-center justify-center text-[11px] font-bold text-white">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-[#ecd08c] max-w-[90px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </>
              ) : (
                <>
                  <UserIcon className="w-4 h-4 text-[#ecd08c]" />
                  <span className="text-xs font-semibold text-white">
                    Ingresar
                  </span>
                </>
              )}
            </button>

            {/* Menú Desplegable Hamburger Button */}
            <button
              onClick={() => setIsNavigationDrawerOpen(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-[#b3925d]/40 transition-colors flex items-center gap-1 sm:gap-1.5 group"
              title="Abrir Menú Principal"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-[#ecd08c] group-hover:scale-105 transition-transform" />
              <span className="hidden md:inline text-xs font-bold text-[#ecd08c] tracking-wider uppercase">
                Menú
              </span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
