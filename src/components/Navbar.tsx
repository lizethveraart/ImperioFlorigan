import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Bell, User as UserIcon, Shield, Sparkles, ChevronDown, LogOut, Check } from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const {
    currentUser,
    switchRole,
    cart,
    setIsCartOpen,
    unreadNotificationsCount,
    currentTab,
    setCurrentTab,
    setIsAuthOpen,
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#141211]/95 backdrop-blur-md border-b border-[#b3925d]/30 text-white shadow-xl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#8c6e3d] via-[#b3925d] to-[#d4145a] py-1 px-4 text-center text-[11px] font-medium tracking-wider text-white shadow-sm flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200" />
        <span>FLORIGAN 50 AÑOS (1975 - 2025) • ENVÍOS A TODO MÉXICO • CATÁLOGO IMPERIAL OFICIAL</span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-200" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentTab('catalog')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#b3925d] to-[#ecd08c] p-0.5 flex items-center justify-center shadow-lg shadow-[#b3925d]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#141211] rounded-full flex items-center justify-center">
                <span className="font-cinzel font-bold text-lg text-[#ecd08c]">F</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-[#ecd08c]">
                  IMPERIO
                </span>
                <span className="font-cinzel text-lg sm:text-xl font-medium tracking-wider text-white">
                  FLORIGAN
                </span>
              </div>
              <p className="text-[10px] tracking-[0.2em] text-[#b3925d] uppercase -mt-1 font-medium">
                Cosmética & Herbolaria 1975
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setCurrentTab('catalog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                currentTab === 'catalog'
                  ? 'bg-[#d4145a] text-white shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              CATÁLOGO
            </button>

            {currentUser.role === 'vendedor' && (
              <button
                onClick={() => setCurrentTab('clients')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                  currentTab === 'clients'
                    ? 'bg-[#d4145a] text-white shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                MIS CLIENTES
              </button>
            )}

            <button
              onClick={() => setCurrentTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all ${
                currentTab === 'orders'
                  ? 'bg-[#d4145a] text-white shadow-md'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              PEDIDOS
            </button>

            {currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => setCurrentTab('analytics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all flex items-center gap-1 ${
                    currentTab === 'analytics'
                      ? 'bg-[#d4145a] text-white shadow-md'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  REPORTES & PDF
                </button>

                <button
                  onClick={() => setCurrentTab('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all flex items-center gap-1 ${
                    currentTab === 'admin'
                      ? 'bg-[#b3925d] text-[#141211] shadow-md font-bold'
                      : 'text-[#ecd08c] hover:bg-white/5'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  ADMIN INVENTARIO
                </button>
              </>
            )}
          </nav>

          {/* Right Action Icons: Role Switcher, Notifications, Cart, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 border border-[#b3925d]/40 text-xs text-[#ecd08c] font-medium transition-colors"
                title="Cambiar perspectiva de usuario"
              >
                <span className="w-2 h-2 rounded-full bg-[#d4145a] animate-ping" />
                <span className="hidden sm:inline capitalize">
                  {currentUser.role === 'vendedor' ? '👑 Vendedora' : currentUser.role === 'admin' ? '🛡️ Administrador' : '🛍️ Cliente'}
                </span>
                <span className="sm:hidden capitalize">
                  {currentUser.role === 'vendedor' ? '👑' : currentUser.role === 'admin' ? '🛡️' : '🛍️'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#b3925d]" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#1e1b19] border border-[#b3925d]/40 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-white/10 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                    Cambiar Modo de Vista:
                  </div>

                  <button
                    onClick={() => {
                      switchRole('vendedor');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-white/5 transition-colors ${
                      currentUser.role === 'vendedor' ? 'text-[#ecd08c] font-bold bg-white/5' : 'text-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>👑 Emperatriz (Vendedora)</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">Mayoreo 35% ganancia + Clientes</span>
                    </div>
                    {currentUser.role === 'vendedor' && <Check className="w-4 h-4 text-[#ecd08c]" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('cliente');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-white/5 transition-colors ${
                      currentUser.role === 'cliente' ? 'text-[#ecd08c] font-bold bg-white/5' : 'text-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>🛍️ Cliente Final</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">Precios catálogo + Compras</span>
                    </div>
                    {currentUser.role === 'cliente' && <Check className="w-4 h-4 text-[#ecd08c]" />}
                  </button>

                  <button
                    onClick={() => {
                      switchRole('admin');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-white/5 transition-colors ${
                      currentUser.role === 'admin' ? 'text-[#ecd08c] font-bold bg-white/5' : 'text-zinc-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>🛡️ Administrador Florigan</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">Control inventario & Stock bajo</span>
                    </div>
                    {currentUser.role === 'admin' && <Check className="w-4 h-4 text-[#ecd08c]" />}
                  </button>

                  <div className="mt-1 pt-1 border-t border-white/10 px-3">
                    <button
                      onClick={() => {
                        setIsRoleDropdownOpen(false);
                        setIsAuthOpen(true);
                      }}
                      className="w-full py-1.5 text-center text-[11px] text-[#d4145a] hover:underline font-semibold"
                    >
                      Crear usuario o Iniciar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              title="Notificaciones y Alertas"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#d4145a] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#d4145a] to-[#a10e43] text-white hover:brightness-110 shadow-lg shadow-[#d4145a]/25 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold">{cartItemsCount}</span>
            </button>

            {/* User Profile avatar */}
            <button
              onClick={() => setCurrentTab('profile')}
              className="p-1 rounded-full border border-[#b3925d]/50 hover:border-[#ecd08c] transition-colors"
              title={currentUser.name}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#b3925d] to-[#141211] flex items-center justify-center text-xs font-bold text-white">
                {currentUser.name.charAt(0)}
              </div>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
