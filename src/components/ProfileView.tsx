import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Award, Shield, Phone, Mail, MapPin, Wallet, Sparkles, LogOut, PackageCheck } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, switchRole, setIsAuthOpen, orders, setCurrentTab } = useApp();

  const userOrders = orders.filter(o => o.userId === currentUser.id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-[#b3925d]/30 overflow-hidden shadow-sm">
        
        {/* Banner Header */}
        <div className="imperial-dark-gradient p-6 sm:p-8 text-white relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#b3925d] via-[#ecd08c] to-[#d4145a] p-1 shadow-xl">
              <div className="w-full h-full bg-[#141211] rounded-full flex items-center justify-center font-cinzel text-3xl font-bold text-[#ecd08c]">
                {currentUser.name.charAt(0)}
              </div>
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                  {currentUser.name}
                </h1>
                {currentUser.vendorLevel && (
                  <span className="px-3 py-0.5 rounded-full bg-[#b3925d]/20 border border-[#b3925d] text-[#ecd08c] text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {currentUser.vendorLevel}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-300 mt-1">
                {currentUser.role === 'vendedor' ? 'Representante Oficial Florigan Venta por Catálogo' : currentUser.role === 'admin' ? 'Administración Central Florigan' : 'Clienta Distinguida'}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-400 mt-3">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#b3925d]" /> {currentUser.email}</span>
                {currentUser.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#b3925d]" /> {currentUser.phone}</span>}
                {currentUser.state && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#b3925d]" /> {currentUser.state}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Details & Stats */}
        <div className="p-6 sm:p-8 space-y-6">
          {currentUser.role === 'vendedor' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#b3925d]/30 text-xs">
                <span className="text-zinc-500 font-medium">Margen de Ganancia:</span>
                <div className="text-2xl font-black text-[#8c6e3d] mt-1">35% MXN</div>
                <span className="text-[10px] text-zinc-400">Descuento directo de mayoreo</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#b3925d]/30 text-xs">
                <span className="text-zinc-500 font-medium">Línea de Crédito:</span>
                <div className="text-2xl font-black text-[#141211] mt-1">
                  ${currentUser.creditLimit?.toLocaleString('es-MX')} MXN
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">Disponible: ${currentUser.availableCredit?.toLocaleString('es-MX')} MXN</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#b3925d]/30 text-xs">
                <span className="text-zinc-500 font-medium">Pedidos Gestionados:</span>
                <div className="text-2xl font-black text-[#d4145a] mt-1">{userOrders.length}</div>
                <span className="text-[10px] text-zinc-400">Con entregas a nivel nacional</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="pt-2 border-t border-zinc-100 flex flex-wrap gap-3">
            <button
              onClick={() => setCurrentTab('orders')}
              className="py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-[#141211] font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <PackageCheck className="w-4 h-4 text-[#b3925d]" />
              Ver Mi Historial de Pedidos
            </button>

            {currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => setCurrentTab('admin')}
                  className="py-2.5 px-4 rounded-xl bg-[#b3925d] hover:bg-[#ecd08c] text-[#141211] font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Shield className="w-4 h-4" />
                  Panel de Inventario
                </button>
                <button
                  onClick={() => setCurrentTab('analytics')}
                  className="py-2.5 px-4 rounded-xl bg-[#d4145a] hover:bg-[#b80f4c] text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                >
                  Reportes & PDF
                </button>
              </>
            )}

            <button
              onClick={() => setIsAuthOpen(true)}
              className="py-2.5 px-4 rounded-xl border border-zinc-300 text-zinc-700 hover:bg-zinc-50 font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <User className="w-4 h-4" />
              Cambiar de Cuenta / Registrar Otra
            </button>
          </div>

          {/* About Florigan */}
          <div className="p-4 rounded-2xl bg-zinc-50 text-xs text-zinc-600 space-y-1.5">
            <h4 className="font-cinzel font-bold text-zinc-800">Florigan® Desde 1975</h4>
            <p className="leading-relaxed">
              Cincuenta años de tradición herbolaria en México. Todas nuestras fórmulas combinan extractos botánicos de alta pureza con el compromiso de empoderar a vendedoras independientes en todo el territorio nacional.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
