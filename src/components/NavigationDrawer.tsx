import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  ShoppingBag,
  PackageCheck,
  User as UserIcon,
  Shield,
  BarChart3,
  Truck,
  MessageCircle,
  LogOut,
  ChevronRight,
  Heart,
  Mail,
  Lock,
  Package,
} from 'lucide-react';

export const NavigationDrawer: React.FC = () => {
  const {
    isNavigationDrawerOpen,
    setIsNavigationDrawerOpen,
    currentUser,
    currentTab,
    setCurrentTab,
    cart,
    setIsCartOpen,
    setIsAuthOpen,
    setIsAdminAuthOpen,
    logout,
  } = useApp();

  if (!isNavigationDrawerOpen) return null;

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavigate = (tab: 'catalog' | 'orders' | 'profile' | 'admin' | 'analytics') => {
    setCurrentTab(tab);
    setIsNavigationDrawerOpen(false);
  };

  const openCart = () => {
    setIsNavigationDrawerOpen(false);
    setIsCartOpen(true);
  };

  const handleOpenAuth = () => {
    setIsNavigationDrawerOpen(false);
    setIsAuthOpen(true);
  };

  const handleOpenAdminAuth = () => {
    setIsNavigationDrawerOpen(false);
    setIsAdminAuthOpen(true);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent('Hola Imperio Florigan, deseo realizar una cotización y conocer los productos disponibles.');
    window.open(`https://wa.me/520000000000?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={() => setIsNavigationDrawerOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer (Right side) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-[#141211] text-white border-l border-[#b3925d]/40 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div>
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#1c1917] to-[#141211]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#b3925d] via-[#ecd08c] to-[#d4145a] p-0.5 flex items-center justify-center shadow-md">
                  <div className="w-full h-full bg-[#141211] rounded-full flex items-center justify-center">
                    <span className="font-cinzel font-bold text-sm text-[#ecd08c]">F</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-cinzel text-sm font-bold text-[#ecd08c] tracking-wider leading-none">
                    IMPERIO FLORIGAN
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase">
                    Menú Principal
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsNavigationDrawerOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Summary Card inside Drawer */}
            <div className="p-4 bg-white/5 border-b border-white/10">
              {currentUser.email ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4145a] to-[#b3925d] flex items-center justify-center font-cinzel font-bold text-white text-sm shadow">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate max-w-[150px]">
                          {currentUser.name}
                        </span>
                        {currentUser.role === 'admin' ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#b3925d] text-[#141211]">
                            Admin
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#d4145a]/30 text-rose-200 border border-[#d4145a]/50">
                            Clienta
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 truncate block max-w-[180px]">
                        {currentUser.email}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNavigate('profile')}
                    className="p-2 text-[#ecd08c] hover:text-white hover:bg-white/10 rounded-xl text-xs font-semibold"
                    title="Ver Mi Perfil"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#ecd08c] block">
                      ¡Bienvenida a Florigan!
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Inicia sesión para guardar tu carrito
                    </span>
                  </div>
                  <button
                    onClick={handleOpenAuth}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#d4145a] to-[#a10e43] text-white text-xs font-bold shadow-md hover:brightness-110"
                  >
                    Ingresar
                  </button>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <nav className="p-4 space-y-1 text-xs">
              <button
                onClick={() => handleNavigate('catalog')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                  currentTab === 'catalog'
                    ? 'bg-[#d4145a] text-white font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#ecd08c]" />
                  <span>Catálogo de Productos</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              <button
                onClick={openCart}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-[#ecd08c]" />
                  <span>Mi Carrito de Compra</span>
                </div>
                {cartItemsCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#d4145a] text-white font-bold text-[10px]">
                    {cartItemsCount} pzas
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-500">Vacío</span>
                )}
              </button>

              <button
                onClick={() => handleNavigate('orders')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                  currentTab === 'orders'
                    ? 'bg-[#d4145a] text-white font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PackageCheck className="w-4 h-4 text-[#ecd08c]" />
                  <span>Mis Pedidos y Números de Guía</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              <button
                onClick={() => handleNavigate('profile')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                  currentTab === 'profile'
                    ? 'bg-[#d4145a] text-white font-bold shadow-md'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-[#ecd08c]" />
                  <span>Mi Panel de Cliente</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-emerald-400 hover:bg-emerald-950/30 transition-all font-semibold"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4" />
                  <span>Cotización por WhatsApp</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">
                  En vivo
                </span>
              </button>

            </nav>
          </div>

          {/* Drawer Footer with Socials, Contact, and Discreet Admin Access at the very end */}
          <div className="p-4 border-t border-white/10 bg-[#0d0c0b] text-[11px] space-y-3">
            
            {/* If currently logged in as admin, show management panel links at the end of the menu */}
            {currentUser.role === 'admin' && currentUser.email === 'ventas@imperioflorigan.com' && (
              <div className="p-2.5 rounded-xl bg-[#b3925d]/10 border border-[#b3925d]/30 space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ecd08c] flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#ecd08c]" />
                    Modo Administrador
                  </span>
                  <span className="text-[9px] text-zinc-400 font-mono">ventas@</span>
                </div>

                <button
                  onClick={() => handleNavigate('admin')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    currentTab === 'admin'
                      ? 'bg-[#b3925d] text-[#141211] font-bold'
                      : 'text-zinc-200 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-3.5 h-3.5 text-[#ecd08c]" />
                    <span>Inventario, Productos & Envíos</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>

                <button
                  onClick={() => handleNavigate('analytics')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    currentTab === 'analytics'
                      ? 'bg-[#d4145a] text-white font-bold'
                      : 'text-zinc-200 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-rose-300" />
                    <span>Reportes de Ventas & PDF</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>
            )}

            {/* Social links */}
            <div className="flex items-center justify-center gap-4 text-zinc-400">
              <a
                href="https://www.instagram.com/imperioflorigan/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-rose-400 transition-colors"
                title="Instagram"
              >
                Instagram
              </a>
              <span>•</span>
              <a
                href="https://www.tiktok.com/@imperiofloriganmx"
                target="_blank"
                rel="noreferrer"
                className="hover:text-pink-400 transition-colors"
                title="TikTok"
              >
                TikTok
              </a>
              <span>•</span>
              <a
                href="https://www.facebook.com/imperioflorigan"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-400 transition-colors"
                title="Facebook"
              >
                Facebook
              </a>
            </div>

            {/* Email contacts & Location */}
            <div className="text-center text-zinc-400 text-[10px] space-y-0.5">
              <div>contacto@imperioflorigan.com</div>
              <div className="text-zinc-500">ventas@imperioflorigan.com</div>
              <div className="text-zinc-500 font-mono">Tel: 000 000 0000 • Irapuato, Gto.</div>
            </div>

            {/* Logout button if authenticated */}
            {currentUser.email && (
              <button
                onClick={() => {
                  logout();
                  setIsNavigationDrawerOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-rose-950/40 border border-white/10 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            )}

            {/* Discreet Admin Access at the very end of the menu */}
            {currentUser.role !== 'admin' && (
              <div className="pt-2 border-t border-white/5 text-center">
                <button
                  onClick={handleOpenAdminAuth}
                  className="inline-flex items-center gap-1.5 text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors py-1 px-2.5 rounded opacity-75 hover:opacity-100"
                  title="Acceso administrativo"
                >
                  <Lock className="w-2.5 h-2.5 text-zinc-600" />
                  <span>Acceso administrativo</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
