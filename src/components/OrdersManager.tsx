import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { exportOrderReceiptPDF } from '../services/pdfService';
import {
  PackageCheck,
  Search,
  Truck,
  Download,
  Send,
  Clock,
  CheckCircle,
  MapPin,
  Calendar,
  CreditCard,
  Edit2,
  X,
  Sparkles,
} from 'lucide-react';

export const OrdersManager: React.FC = () => {
  const { orders, updateOrderStatus, currentUser } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('Preparando');
  const [newTracking, setNewTracking] = useState('');

  const filteredOrders = orders.filter(ord => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      ord.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (ord.trackingNumber && ord.trackingNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = selectedStatus === 'Todos' || ord.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleOpenEdit = (ord: Order) => {
    setEditingOrder(ord);
    setNewStatus(ord.status);
    setNewTracking(ord.trackingNumber || '');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOrder) {
      updateOrderStatus(editingOrder.id, newStatus, newTracking);
      setEditingOrder(null);
    }
  };

  const handleShareTrackingWhatsApp = (ord: Order) => {
    const text = `📦 *ACTUALIZACIÓN DE ENVÍO FLORIGAN*\n\nHola *${ord.clientName}*! Tu pedido *${ord.orderNumber}* se encuentra actualmente: *${ord.status.toUpperCase()}*.\n\n🚚 Paquetería: *${ord.shippingCarrier}*\n🔎 Guía de Rastreo: *${ord.trackingNumber || 'En trámite'}*\n📍 Destino: ${ord.clientCity}, ${ord.clientState}\n\nFlorigan Desde 1975 • ¡Gracias por tu preferencia!`;
    const cleanPhone = ord.clientPhone.replace(/\D/g, '');
    window.open(`https://wa.me/52${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#b3925d]/30 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#141211] text-[#ecd08c] flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
            <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-[#141211]">
              Gestión y Rastreo de Pedidos Nacionales
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl">
            Monitorea el estado de entrega en tiempo real, descarga remisiones en PDF y comparte guías de paquetería con tus clientas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#faf8f5] px-4 py-2 rounded-2xl border border-zinc-200 text-xs">
          <Truck className="w-4 h-4 text-[#d4145a]" />
          <span className="font-bold text-zinc-700">{orders.length} pedidos registrados</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por número de pedido (#FLR-8420), nombre o número de guía..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-zinc-200 text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#d4145a] shadow-sm"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['Todos', 'Preparando', 'Enviado con Guía', 'Entregado'].map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-[#141211] text-[#ecd08c]'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="mt-6 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-zinc-300 p-12 text-center">
            <PackageCheck className="w-12 h-12 mx-auto text-zinc-300 mb-2" />
            <p className="text-zinc-500 text-xs">No se encontraron pedidos con los criterios de búsqueda.</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const isDelivered = order.status === 'Entregado';
            const isShipped = order.status === 'Enviado con Guía';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-zinc-200/90 hover:border-[#b3925d]/50 p-5 shadow-sm transition-all space-y-4"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                  <div className="flex items-center gap-3">
                    <span className="font-cinzel text-base font-bold text-[#141211]">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isDelivered
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isShipped
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isDelivered && <CheckCircle className="w-3 h-3" />}
                      {isShipped && <Truck className="w-3 h-3" />}
                      {!isDelivered && !isShipped && <Clock className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" /> {order.date}
                    </span>
                    <span className="font-semibold text-zinc-700 capitalize">
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Client & Destination info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-zinc-50 p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                      Destinatario:
                    </span>
                    <div className="font-bold text-[#141211]">{order.clientName}</div>
                    <div className="text-zinc-500">{order.clientPhone}</div>
                  </div>

                  <div className="bg-zinc-50 p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                      Destino Nacional:
                    </span>
                    <div className="text-zinc-700 font-medium line-clamp-1">{order.clientAddress}</div>
                    <div className="text-zinc-500">{order.clientCity}, {order.clientState} (CP {order.clientPostalCode})</div>
                  </div>

                  <div className="bg-zinc-50 p-3 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                      Paquetería & Rastreo:
                    </span>
                    <div className="font-bold text-[#d4145a]">{order.shippingCarrier}</div>
                    <div className="font-mono text-zinc-700">
                      Guía: {order.trackingNumber || 'En trámite'}
                    </div>
                  </div>
                </div>

                {/* Items preview table */}
                <div className="bg-[#fcfbfa] p-3 rounded-xl border border-zinc-200 text-xs">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-400 pb-1.5 border-b border-zinc-200">
                    <span>Producto & Tamaño</span>
                    <span>Cant</span>
                    <span>Subtotal</span>
                  </div>
                  <div className="divide-y divide-zinc-100">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between py-1.5 text-zinc-700">
                        <span className="font-medium">
                          {it.productName} <span className="text-zinc-400 font-normal">({it.size})</span>
                        </span>
                        <span className="text-zinc-500">x{it.quantity}</span>
                        <span className="font-bold text-zinc-900">${it.subtotal}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 mt-1 border-t border-zinc-200 flex flex-wrap items-center justify-between font-bold text-zinc-800">
                    <span className="text-zinc-500 text-[11px]">
                      Flete: ${order.shippingCost} MXN • Peso: {(order.totalWeightGrams / 1000).toFixed(2)} kg
                    </span>
                    <div className="text-sm">
                      Total: <span className="text-[#d4145a] font-black">${order.grandTotal.toLocaleString('es-MX')} MXN</span>
                    </div>
                  </div>
                </div>

                {/* Actions: Download PDF, WhatsApp, Edit Status */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => exportOrderReceiptPDF(order)}
                    className="py-1.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-[#141211] font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#b3925d]" />
                    Descargar PDF
                  </button>

                  <button
                    onClick={() => handleShareTrackingWhatsApp(order)}
                    className="py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors border border-emerald-200"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    Enviar Guía por WhatsApp
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => handleOpenEdit(order)}
                      className="py-1.5 px-3 rounded-xl bg-[#141211] hover:bg-[#26211e] text-[#ecd08c] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Actualizar Estatus
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Status Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 border border-[#b3925d]/30 text-[#1a1715]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="font-cinzel font-bold text-base text-[#141211]">
                Actualizar Estatus: {editingOrder.orderNumber}
              </h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Estatus del Pedido:
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as Order['status'])}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-bold"
                >
                  <option value="Preparando">Preparando en Almacén</option>
                  <option value="Enviado con Guía">Enviado con Guía (En camino)</option>
                  <option value="En Ruta de Entrega">En Ruta de Entrega Local</option>
                  <option value="Entregado">Entregado al Cliente</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                  Número de Guía de Rastreo ({editingOrder.shippingCarrier}):
                </label>
                <input
                  type="text"
                  value={newTracking}
                  onChange={e => setNewTracking(e.target.value)}
                  placeholder="Ej. FDX-773829104MX"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 py-2 rounded-xl border border-zinc-200 text-zinc-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#d4145a] text-white font-bold hover:brightness-110"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
