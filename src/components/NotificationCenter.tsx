import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppNotification } from '../types';
import {
  X,
  Bell,
  AlertTriangle,
  Sparkles,
  Truck,
  Package,
  CheckCheck,
  ToggleLeft,
  ToggleRight,
  ArrowRight,
  Send,
  ShieldAlert,
} from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    pushNotificationsEnabled,
    setPushNotificationsEnabled,
    requestBrowserPushPermission,
    dispatchPushNotification,
    setCurrentTab,
    currentUser,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'admin' | 'stock' | 'orders' | 'offers'>('all');
  const [browserPermissionStatus, setBrowserPermissionStatus] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );

  if (!isOpen) return null;

  const handleRequestBrowserPermission = async () => {
    const granted = await requestBrowserPushPermission();
    setBrowserPermissionStatus(granted ? 'granted' : 'denied');
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (activeFilter === 'admin') {
      return notif.type === 'new_product' || notif.type === 'inventory_update';
    }
    if (activeFilter === 'stock') {
      return notif.type === 'stock_alert';
    }
    if (activeFilter === 'orders') {
      return notif.type === 'order_update';
    }
    if (activeFilter === 'offers') {
      return notif.type === 'offer';
    }
    return true;
  });

  const handleGoToProduct = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    onClose();
    if (notif.type === 'order_update') {
      setCurrentTab('orders');
    } else {
      setCurrentTab('catalog');
    }
  };

  // Simulated push for testing
  const handleSimulateAdminPush = () => {
    const testNotif: AppNotification = {
      id: `sim-${Date.now()}`,
      title: '✨ ¡Nuevo Producto Publicado por Administración!',
      message: 'Se ha agregado "Serum Concentrado de Tepezcohuite & Retinol" con 35% de margen para vendedoras. ¡Comienza a ofrecerlo a tus clientas!',
      type: 'new_product',
      timestamp: 'Justo ahora',
      read: false,
      productName: 'Serum Concentrado de Tepezcohuite',
      targetRole: 'vendedor',
      adminAuthor: currentUser.role === 'admin' ? currentUser.name : 'Administración Central Florigan',
    };
    dispatchPushNotification(testNotif);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#181615] border-l border-[#b3925d]/30 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#141211]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#d4145a]/20 border border-[#d4145a]/50 flex items-center justify-center text-[#d4145a]">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-sm text-[#ecd08c]">Centro de Notificaciones Push</h3>
                <p className="text-[10px] text-zinc-400">
                  Alertas en tiempo real para vendedoras e inventario
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Browser Push Notification Permission Banner */}
          <div className="px-5 py-3 bg-[#24201e]/80 border-b border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">
                  Alertas Push de Inventario & Catálogo
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  Avisa a vendedoras cuando admin resurtir o lance productos
                </span>
              </div>
              <button
                onClick={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
                className="text-[#ecd08c] hover:scale-105 transition-transform"
                title="Activar/Desactivar notificaciones"
              >
                {pushNotificationsEnabled ? (
                  <ToggleRight className="w-7 h-7 text-[#ecd08c]" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-zinc-500" />
                )}
              </button>
            </div>

            {/* Native Browser Push Permission status button */}
            {browserPermissionStatus !== 'granted' && typeof window !== 'undefined' && 'Notification' in window && (
              <div className="pt-1">
                <button
                  onClick={handleRequestBrowserPermission}
                  className="w-full py-1.5 px-3 rounded-xl bg-[#b3925d]/20 hover:bg-[#b3925d]/30 border border-[#b3925d]/50 text-[#ecd08c] font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Bell className="w-3 h-3" />
                  Activar Notificaciones Push en el Navegador Web
                </button>
              </div>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="px-4 py-2 bg-[#141211] border-b border-white/10 flex gap-1.5 overflow-x-auto hide-scrollbar text-[11px]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                activeFilter === 'all'
                  ? 'bg-[#ecd08c] text-[#141211]'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('admin')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeFilter === 'admin'
                  ? 'bg-[#d4145a] text-white shadow-sm'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#ecd08c]" /> Novedades Admin
            </button>
            <button
              onClick={() => setActiveFilter('stock')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                activeFilter === 'stock'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              Stock Bajo
            </button>
            <button
              onClick={() => setActiveFilter('orders')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors ${
                activeFilter === 'orders'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              Pedidos
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#b3925d]" />
                <p className="text-xs">No hay notificaciones en esta categoría.</p>
              </div>
            ) : (
              filteredNotifications.map(notif => {
                const isNewProduct = notif.type === 'new_product';
                const isInventoryUpdate = notif.type === 'inventory_update';
                const isStockAlert = notif.type === 'stock_alert';
                const isOffer = notif.type === 'offer';
                const isOrder = notif.type === 'order_update';

                return (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      notif.read
                        ? 'bg-white/5 border-white/5 opacity-75'
                        : isNewProduct
                        ? 'bg-[#d4145a]/15 border-[#d4145a]/50 shadow-md ring-1 ring-[#d4145a]/30'
                        : isInventoryUpdate
                        ? 'bg-[#b3925d]/15 border-[#b3925d]/50 shadow-md ring-1 ring-[#b3925d]/30'
                        : isStockAlert
                        ? 'bg-red-900/15 border-red-500/40'
                        : isOffer
                        ? 'bg-[#b3925d]/10 border-[#b3925d]/40'
                        : 'bg-zinc-800/60 border-zinc-700'
                    }`}
                  >
                    {/* Unread indicator dot */}
                    {!notif.read && (
                      <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#d4145a] animate-ping" />
                    )}

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isNewProduct ? (
                          <div className="w-8 h-8 rounded-full bg-[#d4145a] flex items-center justify-center text-white shadow-md">
                            <Sparkles className="w-4 h-4 text-[#ecd08c]" />
                          </div>
                        ) : isInventoryUpdate ? (
                          <div className="w-8 h-8 rounded-full bg-[#b3925d] flex items-center justify-center text-[#141211] shadow-md">
                            <Package className="w-4 h-4" />
                          </div>
                        ) : isStockAlert ? (
                          <div className="w-8 h-8 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        ) : isOffer ? (
                          <div className="w-8 h-8 rounded-full bg-amber-600/30 text-amber-300 flex items-center justify-center">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
                            <Truck className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 pr-3">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isNewProduct
                                ? 'bg-[#d4145a] text-white'
                                : isInventoryUpdate
                                ? 'bg-[#b3925d] text-[#141211]'
                                : isStockAlert
                                ? 'bg-red-500/20 text-red-300'
                                : 'bg-white/10 text-zinc-300'
                            }`}
                          >
                            {isNewProduct
                              ? 'NUEVO EN CATÁLOGO'
                              : isInventoryUpdate
                              ? 'RESURTIDO INVENTARIO'
                              : isStockAlert
                              ? 'STOCK CRÍTICO'
                              : isOrder
                              ? 'GUÍA DE ENVÍO'
                              : 'PROMOCIÓN'}
                          </span>
                          <span className="text-[10px] text-zinc-400">{notif.timestamp}</span>
                        </div>

                        <h4 className="text-xs font-bold text-white tracking-wide">
                          {notif.title}
                        </h4>

                        <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                          {notif.message}
                        </p>

                        {/* Author info if triggered by admin */}
                        {notif.adminAuthor && (
                          <div className="mt-1.5 text-[9px] text-[#ecd08c] font-medium flex items-center gap-1">
                            <span>🛡️ Autorizado por: {notif.adminAuthor}</span>
                          </div>
                        )}

                        {/* Action Link for Vendors */}
                        {(isNewProduct || isInventoryUpdate || isStockAlert) && (
                          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGoToProduct(notif);
                              }}
                              className="text-[11px] font-bold text-[#ecd08c] hover:text-white flex items-center gap-1 transition-colors"
                            >
                              <span>Ver producto en Catálogo</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>

                            {!notif.read && (
                              <span className="text-[9px] text-zinc-400">
                                Marcar leída
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick simulation button for Admin / Testing */}
          <div className="p-3 bg-[#1e1b19] border-t border-white/10">
            <button
              onClick={handleSimulateAdminPush}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[#b3925d]/30 text-zinc-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-[#ecd08c]" />
              Probar Alerta Push de Admin a Vendedoras
            </button>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 bg-[#141211] flex items-center justify-between">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Marcar todas como leídas
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-[#b3925d] text-[#141211] font-bold text-xs hover:bg-[#ecd08c] transition-colors"
            >
              Cerrar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
