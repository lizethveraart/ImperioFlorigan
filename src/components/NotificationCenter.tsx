import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, AlertTriangle, Sparkles, Truck, CheckCheck, ToggleLeft, ToggleRight } from 'lucide-react';

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
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#181615] border-l border-[#b3925d]/30 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#141211]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#d4145a]/20 flex items-center justify-center text-[#d4145a]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-sm text-[#ecd08c]">Centro de Notificaciones</h3>
                <p className="text-[11px] text-zinc-400">Alertas de inventario, pedidos y ofertas</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Push Notifications Toggle */}
          <div className="px-5 py-3 bg-[#24201e]/70 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-200">Notificaciones Automáticas</span>
              <p className="text-[10px] text-zinc-400">Avisos de stock bajo &lt; 5 unidades y guías</p>
            </div>
            <button
              onClick={() => setPushNotificationsEnabled(!pushNotificationsEnabled)}
              className="text-[#ecd08c] hover:scale-105 transition-transform"
            >
              {pushNotificationsEnabled ? (
                <ToggleRight className="w-7 h-7 text-[#ecd08c]" />
              ) : (
                <ToggleLeft className="w-7 h-7 text-zinc-500" />
              )}
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No tienes notificaciones pendientes</p>
              </div>
            ) : (
              notifications.map(notif => {
                const isStockAlert = notif.type === 'stock_alert';
                const isOffer = notif.type === 'offer';
                const isOrder = notif.type === 'order_update';

                return (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      notif.read
                        ? 'bg-white/5 border-white/5 opacity-70'
                        : isStockAlert
                        ? 'bg-[#d4145a]/10 border-[#d4145a]/40 shadow-sm'
                        : isOffer
                        ? 'bg-[#b3925d]/10 border-[#b3925d]/40 shadow-sm'
                        : 'bg-zinc-800/60 border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">
                        {isStockAlert && <AlertTriangle className="w-4 h-4 text-[#e8226e]" />}
                        {isOffer && <Sparkles className="w-4 h-4 text-[#ecd08c]" />}
                        {isOrder && <Truck className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white tracking-wide">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-zinc-400">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                        {!notif.read && (
                          <div className="mt-2 flex justify-end">
                            <span className="text-[9px] text-[#ecd08c] font-medium flex items-center gap-1">
                              Marcar como leída
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
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
          )}

        </div>
      </div>
    </div>
  );
};
