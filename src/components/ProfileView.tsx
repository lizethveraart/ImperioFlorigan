import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { exportOrderReceiptPDF } from '../services/pdfService';
import { MEXICO_STATES } from '../data/mexicoShipping';
import {
  User,
  Heart,
  Package,
  ShoppingBag,
  Truck,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check,
  Download,
  ExternalLink,
  MessageCircle,
  Sparkles,
  LogOut,
  Edit2,
  Save,
  CheckCircle2,
  Clock,
  Shield,
  Search,
  ArrowRight,
  RotateCcw,
  Calendar,
  Box,
  Navigation,
} from 'lucide-react';

/**
 * Returns the official tracking link for Mexican carriers
 */
export function getCarrierTrackingUrl(carrier: string, trackingNumber: string): string {
  const cleanTrack = encodeURIComponent(trackingNumber.trim());
  const lower = carrier.toLowerCase();
  if (lower.includes('fedex')) {
    return `https://www.fedex.com/fedextrack/?trknbr=${cleanTrack}`;
  }
  if (lower.includes('estafeta')) {
    return `https://www.estafeta.com/Herramientas/Rastreo?rastreo=${cleanTrack}`;
  }
  if (lower.includes('redpack')) {
    return `https://www.redpack.com.mx/es/rastreo/?guia=${cleanTrack}`;
  }
  if (lower.includes('dhl')) {
    return `https://www.dhl.com/mx-es/home/tracking/tracking-express.html?submit=1&tracking-id=${cleanTrack}`;
  }
  return `https://www.google.com/search?q=rastreo+${encodeURIComponent(carrier)}+${cleanTrack}`;
}

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    orders,
    products,
    cart,
    addToCart,
    setIsCartOpen,
    setIsAuthOpen,
    setCurrentTab,
    logout,
  } = useApp();

  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [reorderedOrderId, setReorderedOrderId] = useState<string | null>(null);

  // Filter tabs for orders history
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_transit' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Address edit state
  const [address, setAddress] = useState(currentUser.address || 'Av. Guerrero 1500, Col. Jardines');
  const [city, setCity] = useState(currentUser.city && currentUser.city !== 'Guadalajara' ? currentUser.city : 'Irapuato');
  const [state, setState] = useState(currentUser.state && !currentUser.state.includes('Guadalajara') ? currentUser.state : 'Guanajuato');
  const [postalCode, setPostalCode] = useState(currentUser.postalCode || '36660');
  const [phone, setPhone] = useState(currentUser.phone && !currentUser.phone.includes('3619') ? currentUser.phone : '000 000 0000');

  // Filter client orders: matches current user ID or email or default client
  const clientOrders = useMemo(() => {
    return orders.filter(o => {
      const matchUserId = o.userId === currentUser.id;
      const matchName = currentUser.name && o.clientName.toLowerCase().includes(currentUser.name.toLowerCase());
      const isDefaultCarolina = currentUser.id === 'usr-cli-01' || currentUser.email === 'carolina.velasco@gmail.com';
      return matchUserId || matchName || isDefaultCarolina;
    });
  }, [orders, currentUser]);

  // Filtered by sub-tab and search query
  const displayedOrders = useMemo(() => {
    return clientOrders.filter(order => {
      // Tab filter
      if (statusFilter === 'in_transit') {
        const inTransit = order.status === 'Enviado con Guía' || order.status === 'En Ruta de Entrega' || order.status === 'Preparando';
        if (!inTransit) return false;
      } else if (statusFilter === 'delivered') {
        if (order.status !== 'Entregado') return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesOrderNum = order.orderNumber.toLowerCase().includes(q);
        const matchesTracking = order.trackingNumber ? order.trackingNumber.toLowerCase().includes(q) : false;
        const matchesCarrier = order.shippingCarrier.toLowerCase().includes(q);
        const matchesItem = order.items.some(item => item.productName.toLowerCase().includes(q));
        if (!matchesOrderNum && !matchesTracking && !matchesCarrier && !matchesItem) {
          return false;
        }
      }

      return true;
    });
  }, [clientOrders, statusFilter, searchQuery]);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.presentation.price * item.quantity, 0);

  const handleCopyTracking = (tracking: string) => {
    navigator.clipboard.writeText(tracking);
    setCopiedTracking(tracking);
    setTimeout(() => setCopiedTracking(null), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      address,
      city,
      state,
      postalCode,
      phone,
    });
    setIsEditingAddress(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleOpenWhatsAppSupport = (order?: Order) => {
    let text = `Hola Imperio Florigan, soy ${currentUser.name || 'clienta'}.`;
    if (order) {
      text += ` Me gustaría consultar información sobre mi pedido #${order.orderNumber} con guía ${order.trackingNumber || 'asignada'} de ${order.shippingCarrier}.`;
    } else {
      text += ` Deseo solicitar información sobre mis pedidos o realizar una cotización.`;
    }
    window.open(`https://wa.me/520000000000?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleReorder = (order: Order) => {
    let addedCount = 0;
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId || p.name === item.productName);
      if (prod) {
        const pres = prod.presentations.find(p => p.size === item.size) || prod.presentations[0];
        if (pres) {
          addToCart(prod, pres, item.quantity);
          addedCount += item.quantity;
        }
      }
    });

    setReorderedOrderId(order.id);
    setTimeout(() => setReorderedOrderId(null), 2500);
    if (addedCount > 0) {
      setIsCartOpen(true);
    }
  };

  if (!currentUser.email) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 border border-[#e8cbb0] shadow-xl text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#d4145a] via-[#e87a90] to-[#b3925d] p-0.5 mx-auto mb-4 flex items-center justify-center">
            <div className="w-full h-full bg-[#141211] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-[#ecd08c]" />
            </div>
          </div>
          <h2 className="font-cinzel text-xl font-bold text-[#141211]">
            Acceso a tu Panel de Cliente
          </h2>
          <p className="text-xs text-zinc-600 mt-2 max-w-sm mx-auto leading-relaxed">
            Inicia sesión o regístrate con tu cuenta de Gmail o correo para ver tus carritos de compra guardados, historial de pedidos anteriores y números de guía de seguimiento.
          </p>
          <button
            onClick={() => setIsAuthOpen(true)}
            className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#d4145a] to-[#a10e43] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#d4145a]/25 hover:brightness-110 transition-all"
          >
            Iniciar Sesión / Registrarme
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 sm:pb-24 font-['Montserrat',sans-serif]">
      
      {/* Feminine & Imperial Client Header Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#ecd0be] overflow-hidden shadow-xs mb-6">
        
        {/* Soft Blush Pink & Rose Gold Banner */}
        <div className="relative p-4 sm:p-8 bg-gradient-to-r from-[#fff7f2] via-[#fbf0ea] to-[#f7e6dc] border-b border-[#ecd0be]">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#d4145a] via-[#f08da3] to-[#b3925d] p-1 shadow-lg shrink-0">
              <div className="w-full h-full bg-[#141211] rounded-full flex items-center justify-center font-cinzel text-2xl font-bold text-[#ecd08c]">
                {currentUser.name.charAt(0)}
              </div>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-[#141211]">
                  {currentUser.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-[#a10e43] text-xs font-bold flex items-center gap-1 shadow-xs">
                  <Heart className="w-3 h-3 fill-[#d4145a] text-[#d4145a]" /> Clienta Preferencial
                </span>
                {currentUser.authProvider === 'google' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-blue-200 text-blue-600 text-[10px] font-semibold flex items-center gap-1 shadow-2xs">
                    Google Gmail
                  </span>
                )}
              </div>

              <p className="text-xs text-zinc-600 mt-1">
                Bienvenida a tu panel personal en Imperio Florigan • Cosmética & Herbolaria Pura Mexicana
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-600 mt-3">
                <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-xl border border-[#ecd0be]">
                  <Mail className="w-3.5 h-3.5 text-[#d4145a] shrink-0" />
                  <span className="font-mono text-[11px] text-zinc-800">
                    {currentUser.email && currentUser.email !== 'direccion@florigan.com.mx'
                      ? currentUser.email
                      : 'contacto@imperioflorigan.com'}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-xl border border-[#ecd0be]">
                  <Phone className="w-3.5 h-3.5 text-[#b3925d] shrink-0" />
                  <span className="font-mono text-[11px] text-zinc-800">
                    {currentUser.phone && !currentUser.phone.includes('3619') && !currentUser.phone.includes('1290') && !currentUser.phone.includes('1071')
                      ? currentUser.phone
                      : '000 000 0000'}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-xl border border-[#ecd0be]">
                  <MapPin className="w-3.5 h-3.5 text-[#d4145a] shrink-0" />
                  <span className="font-medium text-zinc-800">
                    Irapuato, Guanajuato
                  </span>
                </span>
              </div>

              {/* Official Contact Emails Bar */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-[11px] text-zinc-500 mt-2.5 pt-2 border-t border-[#ecd0be]/60">
                <span className="font-bold text-[#b3925d] uppercase text-[10px] tracking-wider">Atención Oficial:</span>
                <a href="mailto:contacto@imperioflorigan.com" className="hover:text-[#d4145a] font-mono transition-colors">
                  contacto@imperioflorigan.com
                </a>
                <span>•</span>
                <a href="mailto:ventas@imperioflorigan.com" className="hover:text-[#b3925d] font-mono transition-colors">
                  ventas@imperioflorigan.com
                </a>
                <span>•</span>
                <span className="font-mono text-zinc-600 font-semibold">Tel: 000 000 0000</span>
                <span>•</span>
                <span className="text-zinc-600 font-medium">Irapuato, Guanajuato</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-2 shrink-0">
              <button
                onClick={() => handleOpenWhatsAppSupport()}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                title="Atención directa por WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Asesora WhatsApp</span>
              </button>

              <button
                onClick={logout}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5 text-zinc-400" />
                <span>Cerrar Sesión</span>
              </button>
            </div>

          </div>
        </div>

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-6 bg-[#fffdfb]">
          <div className="p-4 rounded-2xl bg-white border border-[#f0d4bf] text-xs shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-semibold uppercase text-[10px]">Carrito Guardado:</span>
              <ShoppingBag className="w-4 h-4 text-[#d4145a]" />
            </div>
            <div className="text-xl font-black text-[#141211] mt-1.5">
              ${cartTotal.toLocaleString('es-MX')} MXN
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-zinc-500">{cartItemsCount} artículos listos</span>
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-[11px] text-[#d4145a] font-bold hover:underline"
              >
                Ver Carrito →
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#f0d4bf] text-xs shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-semibold uppercase text-[10px]">Historial de Pedidos:</span>
              <Package className="w-4 h-4 text-[#b3925d]" />
            </div>
            <div className="text-xl font-black text-[#141211] mt-1.5">
              {clientOrders.length} {clientOrders.length === 1 ? 'pedido registrado' : 'pedidos registrados'}
            </div>
            <span className="text-[11px] text-zinc-500 block mt-2">
              Envíos asegurados y rastreables
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#f0d4bf] text-xs shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-semibold uppercase text-[10px]">Garantía Florigan:</span>
              <Sparkles className="w-4 h-4 text-[#ecd08c]" />
            </div>
            <div className="text-xl font-black text-[#a10e43] mt-1.5">
              100% Original
            </div>
            <span className="text-[11px] text-emerald-700 font-bold block mt-2">
              Envío asegurado desde Irapuato, Guanajuato
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout: Orders History Section (2 cols) + Address & Cart summary (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ============================================================== */}
        {/* SECCIÓN PRINCIPAL: HISTORIAL DE PEDIDOS ANTERIORES DEL CLIENTE */}
        {/* ============================================================== */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Header of Orders History */}
          <div className="bg-white rounded-3xl p-5 border border-[#ecd0be] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#d4145a] to-[#a10e43] text-white flex items-center justify-center shadow-xs">
                    <Truck className="w-4 h-4" />
                  </div>
                  <h2 className="font-cinzel text-lg font-bold text-[#141211]">
                    Historial de Pedidos Anteriores
                  </h2>
                </div>
                <p className="text-xs text-zinc-500 mt-1 ml-10">
                  Estado de envío en tiempo real y enlaces directos a guías de paquetería oficial.
                </p>
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 bg-[#faf6f2] p-1 rounded-2xl border border-[#ecd0be] self-start sm:self-auto">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'all'
                      ? 'bg-white text-[#d4145a] font-bold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Todos ({clientOrders.length})
                </button>
                <button
                  onClick={() => setStatusFilter('in_transit')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'in_transit'
                      ? 'bg-white text-[#d4145a] font-bold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  En Camino
                </button>
                <button
                  onClick={() => setStatusFilter('delivered')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === 'delivered'
                      ? 'bg-white text-[#d4145a] font-bold shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Entregados
                </button>
              </div>
            </div>

            {/* Quick Search inside History */}
            {clientOrders.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-100 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar por # de pedido, código de guía, producto o paquetería..."
                  className="w-full pl-9 pr-4 py-2 bg-[#faf9f8] border border-zinc-200 rounded-xl text-xs text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                />
              </div>
            )}
          </div>

          {/* Empty State */}
          {displayedOrders.length === 0 ? (
            <div className="p-10 rounded-3xl bg-white border border-dashed border-[#ecd0be] text-center">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-[#d4145a] flex items-center justify-center mx-auto mb-3">
                <Box className="w-7 h-7" />
              </div>
              <h3 className="font-cinzel text-base font-bold text-zinc-800">
                {searchQuery
                  ? 'No se encontraron pedidos con ese criterio de búsqueda'
                  : 'No tienes pedidos en esta categoría'}
              </h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? 'Verifica el número de orden o número de guía ingresado.'
                  : 'Tus compras realizadas en la tienda se registrarán aquí con su respectiva guía y seguimiento en vivo.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCurrentTab('catalog');
                }}
                className="mt-5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#d4145a] to-[#a10e43] text-white font-bold text-xs shadow-md shadow-[#d4145a]/20 hover:brightness-105 transition-all"
              >
                Explorar Catálogo de Productos
              </button>
            </div>
          ) : (
            /* Orders List */
            <div className="space-y-4">
              {displayedOrders.map(order => {
                const isDelivered = order.status === 'Entregado';
                const isEnRuta = order.status === 'En Ruta de Entrega';
                const isShipped = order.status === 'Enviado con Guía';
                const isPreparing = order.status === 'Preparando';

                // Stepper index: 1: Pago, 2: Preparación, 3: En Tránsito/Ruta, 4: Entregado
                const currentStep: number = isDelivered
                  ? 4
                  : isEnRuta || isShipped
                  ? 3
                  : isPreparing
                  ? 2
                  : 1;

                const trackingUrl = order.trackingNumber
                  ? getCarrierTrackingUrl(order.shippingCarrier, order.trackingNumber)
                  : '#';

                return (
                  <div
                    key={order.id}
                    className="rounded-3xl bg-white border border-[#eed8c9] shadow-sm hover:shadow-md transition-all overflow-hidden"
                  >
                    {/* Top Order Card Header */}
                    <div className="p-5 bg-gradient-to-r from-[#fff9f6] via-[#faf2ed] to-[#f7ece5] border-b border-[#ecd0be]">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-cinzel text-base font-bold text-[#141211]">
                              Pedido #{order.orderNumber}
                            </span>
                            
                            {/* Estado del Envío Badge */}
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-2xs ${
                                isDelivered
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : isEnRuta
                                  ? 'bg-rose-100 text-[#a10e43] border border-rose-300 animate-pulse'
                                  : isShipped
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {order.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#b3925d]" />
                              {order.date}
                            </span>
                            <span>•</span>
                            <span className="text-zinc-600 font-medium">
                              Paquetería: <strong className="text-zinc-800">{order.shippingCarrier}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Grand Total */}
                        <div className="text-right">
                          <div className="text-lg font-black text-[#d4145a]">
                            ${order.grandTotal.toLocaleString('es-MX')} MXN
                          </div>
                          <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block">
                            {order.paymentMethod === 'spei'
                              ? 'Transferencia SPEI'
                              : order.paymentMethod === 'oxxo'
                              ? 'Depósito OXXO'
                              : order.paymentMethod === 'whatsapp'
                              ? 'Acuerdo WhatsApp'
                              : 'Pago Registrado'}
                          </span>
                        </div>
                      </div>

                      {/* Visual Shipping Progress Stepper */}
                      <div className="mt-5 pt-4 border-t border-[#ecd0be]/60">
                        <div className="relative flex items-center justify-between">
                          {/* Progress bar line */}
                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-zinc-200 z-0 rounded-full" />
                          <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#d4145a] via-[#e87a90] to-[#b3925d] z-0 rounded-full transition-all duration-500"
                            style={{
                              width:
                                currentStep === 1
                                  ? '0%'
                                  : currentStep === 2
                                  ? '33%'
                                  : currentStep === 3
                                  ? '66%'
                                  : '100%',
                            }}
                          />

                          {/* Step 1: Confirmado */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-[#d4145a] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-700 mt-1 text-center">
                              Pagado
                            </span>
                          </div>

                          {/* Step 2: Preparando */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-colors ${
                                currentStep >= 2
                                  ? 'bg-[#d4145a] text-white'
                                  : 'bg-zinc-200 text-zinc-400'
                              }`}
                            >
                              <Box className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-700 mt-1 text-center">
                              Empacado
                            </span>
                          </div>

                          {/* Step 3: En Tránsito / Ruta */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-colors ${
                                currentStep >= 3
                                  ? 'bg-[#d4145a] text-white animate-pulse'
                                  : 'bg-zinc-200 text-zinc-400'
                              }`}
                            >
                              <Truck className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-700 mt-1 text-center">
                              En Tránsito
                            </span>
                          </div>

                          {/* Step 4: Entregado */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs transition-colors ${
                                currentStep >= 4
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-zinc-200 text-zinc-400'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-700 mt-1 text-center">
                              Entregado
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tracking Box with DIRECT LINK to Carrier */}
                    {order.trackingNumber && (
                      <div className="p-4 mx-5 my-4 rounded-2xl bg-gradient-to-r from-[#faf4ee] to-[#f4ebe1] border border-[#e8cbb0] shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          {/* Carrier & Tracking Number */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-[#e8cbb0] flex items-center justify-center text-[#d4145a] shrink-0 shadow-xs">
                              <Navigation className="w-5 h-5 text-[#b3925d]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b3925d]">
                                  Guía Oficial de Seguimiento:
                                </span>
                                <span className="text-[10px] px-2 py-0.2 bg-white rounded-md font-semibold text-zinc-600 border border-zinc-200">
                                  {order.shippingCarrier}
                                </span>
                              </div>
                              <div className="font-mono text-sm font-bold text-[#141211] tracking-wider mt-0.5">
                                {order.trackingNumber}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons: Tracking Link, Copy, PDF */}
                          <div className="flex flex-wrap items-center gap-2">
                            
                            {/* OFFIAL CARRIER TRACKING LINK */}
                            <a
                              href={trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#141211] to-[#262220] hover:from-[#d4145a] hover:to-[#a10e43] text-[#ecd08c] hover:text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                              title={`Rastrear directamente en la web de ${order.shippingCarrier}`}
                            >
                              <span>Rastrear en {order.shippingCarrier.split(' ')[0]}</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            {/* Copy Tracking Button */}
                            <button
                              onClick={() => handleCopyTracking(order.trackingNumber!)}
                              className="px-3 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                              title="Copiar número de guía"
                            >
                              {copiedTracking === order.trackingNumber ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">¡Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-zinc-500" />
                                  <span>Copiar Guía</span>
                                </>
                              )}
                            </button>

                            {/* Download PDF receipt */}
                            <button
                              onClick={() => exportOrderReceiptPDF(order)}
                              className="p-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-[#d4145a] text-xs transition-colors shadow-2xs"
                              title="Descargar Nota de Pedido Oficial en PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* Order Items Preview */}
                    <div className="p-5 pt-1 space-y-3">
                      <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider block">
                        Productos en este pedido ({order.items.length}):
                      </span>

                      <div className="space-y-2">
                        {order.items.map((item, idx) => {
                          const catalogProd = products.find(p => p.id === item.productId || p.name === item.productName);

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2.5 rounded-2xl bg-[#faf9f8] border border-zinc-100 text-xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {catalogProd && (
                                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                                    <img
                                      src={catalogProd.imageUrl}
                                      alt={item.productName}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h4 className="font-semibold text-zinc-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                                    {item.productName}
                                  </h4>
                                  <span className="text-[10px] text-zinc-500">
                                    {item.size} • Cantidad: <strong>{item.quantity}</strong> pzas
                                  </span>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-bold text-zinc-900 block">
                                  ${item.subtotal.toLocaleString('es-MX')} MXN
                                </span>
                                <span className="text-[10px] text-zinc-400">
                                  ${item.unitPrice} c/u
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Subtotals & Shipping breakdown */}
                      <div className="mt-3 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-600">
                        <div className="space-y-0.5">
                          <span className="text-[11px] block">
                            Subtotal de productos: <strong>${order.subtotalCatalog.toLocaleString('es-MX')} MXN</strong>
                          </span>
                          <span className="text-[11px] block">
                            Costo de paquetería ({order.shippingCarrier}):{' '}
                            <strong>${order.shippingCost.toLocaleString('es-MX')} MXN</strong>
                          </span>
                        </div>

                        {/* Reorder and WhatsApp support */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenWhatsAppSupport(order)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Ayuda del Pedido</span>
                          </button>

                          <button
                            onClick={() => handleReorder(order)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#a10e43] border border-rose-200 text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>
                              {reorderedOrderId === order.id ? '¡Agregado al carrito!' : 'Volver a Comprar'}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Destination Address */}
                      <div className="pt-2 text-[11px] text-zinc-500 flex items-center gap-1.5 border-t border-zinc-100">
                        <MapPin className="w-3.5 h-3.5 text-[#b3925d] shrink-0" />
                        <span className="truncate">
                          Dirección de Entrega: {order.clientAddress}, {order.clientCity}, {order.clientState} (C.P. {order.clientPostalCode})
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* ============================================================== */}
        {/* COLUMNA DERECHA: DIRECCIÓN DE ENTREGA Y CARRITO GUARDADO */}
        {/* ============================================================== */}
        <div className="space-y-6">
          
          {/* Saved Delivery Address Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#ecd0be] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d4145a]" />
                <h3 className="font-cinzel text-sm font-bold text-[#141211]">
                  Dirección de Envío
                </h3>
              </div>
              <button
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-xs text-[#d4145a] font-bold hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingAddress ? 'Cancelar' : 'Editar'}</span>
              </button>
            </div>

            {savedSuccess && (
              <div className="mb-3 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Dirección guardada exitosamente.</span>
              </div>
            )}

            {isEditingAddress ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Calle, Número y Colonia:
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Ej. Av. Chapultepec 410, Col. Americana"
                    className="w-full px-3 py-2 bg-[#faf9f8] border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Ciudad:
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Irapuato"
                      className="w-full px-3 py-2 bg-[#faf9f8] border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Código Postal:
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      placeholder="36660"
                      className="w-full px-3 py-2 bg-[#faf9f8] border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Estado:
                  </label>
                  <select
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf9f8] border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  >
                    {MEXICO_STATES.map(s => (
                      <option key={s.code} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                    Teléfono WhatsApp:
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="000 000 0000"
                    className="w-full px-3 py-2 bg-[#faf9f8] border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-[#141211] hover:bg-[#d4145a] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm mt-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Datos de Entrega</span>
                </button>
              </form>
            ) : (
              <div className="space-y-2 text-xs text-zinc-700">
                <div className="p-3 rounded-2xl bg-[#faf9f8] border border-zinc-100">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">
                    Domicilio Registrado:
                  </span>
                  <p className="font-semibold text-zinc-900">
                    {currentUser.address || 'Av. Guerrero 1500, Col. Jardines'}
                  </p>
                  <p className="text-zinc-600 mt-0.5">
                    {currentUser.city && currentUser.city !== 'Guadalajara' ? currentUser.city : 'Irapuato'}, {currentUser.state && !currentUser.state.includes('Guadalajara') ? currentUser.state : 'Guanajuato'} {currentUser.postalCode ? `(C.P. ${currentUser.postalCode})` : '(C.P. 36660)'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#faf9f8] border border-zinc-100">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">
                    Contacto y Avisos de Entrega:
                  </span>
                  <p className="font-semibold text-zinc-900 font-mono">
                    {currentUser.phone && !currentUser.phone.includes('3619') ? currentUser.phone : '000 000 0000'}
                  </p>
                  <p className="text-zinc-500 text-[11px] mt-0.5">
                    Notificaciones de paquetería vía WhatsApp
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Saved Shopping Cart Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#ecd0be] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#d4145a]" />
                <h3 className="font-cinzel text-sm font-bold text-[#141211]">
                  Mi Carrito Guardado
                </h3>
              </div>
              <span className="text-xs font-bold text-[#d4145a]">
                {cartItemsCount} artículos
              </span>
            </div>

            {cart.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-4">
                Tu carrito está vacío actualmente.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {cart.map(item => (
                    <div
                      key={item.presentation.sku}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-[#faf9f8] border border-zinc-100 text-xs"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-10 h-10 object-contain rounded-lg bg-white p-1 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-zinc-900 truncate">
                          {item.productName}
                        </h4>
                        <span className="text-[10px] text-zinc-500">
                          {item.presentation.size} • Cant: {item.quantity}
                        </span>
                      </div>
                      <div className="font-bold text-zinc-900 shrink-0">
                        ${item.presentation.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-600 font-semibold">Total Acumulado:</span>
                  <span className="font-black text-sm text-[#d4145a]">
                    ${cartTotal.toLocaleString('es-MX')} MXN
                  </span>
                </div>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4145a] to-[#a10e43] text-white font-bold text-xs uppercase tracking-wider hover:brightness-105 shadow-md shadow-[#d4145a]/25 transition-all text-center block"
                >
                  Proceder al Pago
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
