import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShippingQuote, PaymentMethodType, Order } from '../types';
import { ShippingCalculator } from './ShippingCalculator';
import { exportOrderReceiptPDF } from '../services/pdfService';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  Building2,
  Store,
  Wallet,
  CheckCircle2,
  Download,
  Send,
  AlertCircle,
  Truck,
  User,
  MapPin,
  Lock,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedClientId?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, preselectedClientId }) => {
  const {
    cart,
    totalCartWeightGrams,
    cartSubtotalCatalog,
    cartSubtotalWholesale,
    cartPotentialCommission,
    currentUser,
    clients,
    createOrder,
  } = useApp();

  if (!isOpen || cart.length === 0) return null;

  // Selected client or custom input
  const initialClient = clients.find(c => c.id === preselectedClientId) || (currentUser.role === 'cliente' ? {
    fullName: currentUser.name,
    phone: currentUser.phone || '33 1234 5678',
    address: 'Av. Vallarta 2440',
    city: currentUser.city || 'Guadalajara',
    state: currentUser.state || 'Jalisco (Matriz Guadalajara)',
    postalCode: '44100',
  } : {
    fullName: clients[0]?.fullName || '',
    phone: clients[0]?.phone || '',
    address: clients[0]?.address || '',
    city: clients[0]?.city || 'Guadalajara',
    state: clients[0]?.state || 'Jalisco (Matriz Guadalajara)',
    postalCode: clients[0]?.postalCode || '44100',
  });

  const [clientName, setClientName] = useState(initialClient.fullName);
  const [clientPhone, setClientPhone] = useState(initialClient.phone);
  const [clientAddress, setClientAddress] = useState(initialClient.address);
  const [clientCity, setClientCity] = useState(initialClient.city);
  const [clientState, setClientState] = useState(initialClient.state);
  const [clientPostalCode, setClientPostalCode] = useState(initialClient.postalCode);

  const [selectedQuote, setSelectedQuote] = useState<ShippingQuote | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');

  // Card form state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(currentUser.name);
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('382');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const shippingCost = selectedQuote ? selectedQuote.cost : 0;
  const isVendor = currentUser.role === 'vendedor';
  const effectiveSubtotal = isVendor ? cartSubtotalWholesale : cartSubtotalCatalog;
  const grandTotal = effectiveSubtotal + shippingCost;

  const handleSelectExistingClient = (clientId: string) => {
    const found = clients.find(c => c.id === clientId);
    if (found) {
      setClientName(found.fullName);
      setClientPhone(found.phone);
      setClientAddress(found.address);
      setClientCity(found.city);
      setClientState(found.state);
      setClientPostalCode(found.postalCode);
    }
  };

  const handleProcessPayment = () => {
    if (!clientName || !clientPhone || !clientAddress || !selectedQuote) {
      alert('Por favor completa todos los datos de envío y selecciona una paquetería.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      let ref = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
      if (paymentMethod === 'spei') ref = `SPEI-BBVA-646180${Math.floor(1000 + Math.random() * 9000)}`;
      if (paymentMethod === 'oxxo') ref = `OXXO-9381-0429-${Math.floor(1000 + Math.random() * 9000)}`;
      if (paymentMethod === 'florigan_credit') ref = `CRED-FLR-${currentUser.name.split(' ')[0]}-01`;

      const orderItems = cart.map(item => ({
        productId: item.productId,
        productName: item.productName,
        size: item.presentation.size,
        unitPrice: item.presentation.price,
        wholesaleUnitPrice: item.presentation.wholesalePrice || Math.round(item.presentation.price * 0.65),
        quantity: item.quantity,
        subtotal: item.presentation.price * item.quantity,
        weightGrams: item.presentation.weightGrams * item.quantity,
      }));

      const newOrder = createOrder({
        userId: currentUser.id,
        userRole: currentUser.role,
        clientName,
        clientPhone,
        clientAddress,
        clientCity,
        clientState,
        clientPostalCode,
        items: orderItems,
        subtotalCatalog: cartSubtotalCatalog,
        subtotalWholesale: cartSubtotalWholesale,
        vendorCommission: cartPotentialCommission,
        shippingCost,
        shippingCarrier: selectedQuote.carrier,
        totalWeightGrams: totalCartWeightGrams,
        grandTotal,
        paymentMethod,
        paymentStatus: 'Aprobado',
        paymentReference: ref,
        status: 'Preparando',
        trackingNumber: `${selectedQuote.carrier.substring(0, 3).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}MX`,
      });

      setIsProcessing(false);
      setCompletedOrder(newOrder);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#b3925d', '#d4145a', '#ecd08c', '#ffffff'],
        });
      } catch (e) {
        // Safe fallback
      }
    }, 1200);
  };

  const handleShareWhatsApp = (ord: Order) => {
    const text = `🌸 *CONFIRMACIÓN DE PEDIDO IMPERIO FLORIGAN*\n\n¡Gracias por tu compra, *${ord.clientName}*!\n\n📋 *Pedido:* ${ord.orderNumber}\n📦 *Envío:* ${ord.shippingCarrier}\n📍 *Destino:* ${ord.clientAddress}, ${ord.clientCity}, ${ord.clientState}\n🏷️ *Total:* $${ord.grandTotal.toLocaleString('es-MX')} MXN\n💳 *Método de Pago:* ${ord.paymentMethod.toUpperCase()}\n📑 *Referencia:* ${ord.paymentReference}\n\nFlorigan Desde 1975 • En breve te compartiremos tu guía de rastreo.`;
    const url = `https://wa.me/52${ord.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#b3925d]/30 text-[#1a1715] max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 bg-[#141211] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#b3925d]/20 border border-[#b3925d] flex items-center justify-center text-[#ecd08c]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#ecd08c]">
                Pasarela de Pago Segura • Imperio Florigan
              </h2>
              <p className="text-[11px] text-zinc-300">
                {isVendor ? 'Liquidación a precio de mayoreo de vendedora (35% margen)' : 'Compra directa de catálogo Florigan'}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {completedOrder ? (
            /* Success Order View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-cinzel text-2xl font-bold text-[#141211]">
                  ¡Pedido {completedOrder.orderNumber} Exitoso!
                </h3>
                <p className="text-xs text-zinc-600 mt-1 max-w-md mx-auto">
                  Tu orden ha sido registrada en el sistema de Imperio Florigan. Se ha enviado la solicitud al almacén central en Guadalajara para despacho inmediato.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="max-w-md mx-auto bg-[#faf8f5] p-4 rounded-2xl border border-[#b3925d]/30 text-left text-xs space-y-2">
                <div className="flex justify-between pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500">Destinatario:</span>
                  <span className="font-bold text-[#141211]">{completedOrder.clientName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500">Paquetería Nacional:</span>
                  <span className="font-bold text-[#d4145a]">{completedOrder.shippingCarrier}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500">Guía de Rastreo Generada:</span>
                  <span className="font-mono font-bold text-zinc-800">{completedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-zinc-200">
                  <span className="text-zinc-500">Método de Pago:</span>
                  <span className="font-bold text-[#141211] uppercase">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-black text-[#141211]">
                  <span>Total Cobrado:</span>
                  <span className="text-[#d4145a]">${completedOrder.grandTotal.toLocaleString('es-MX')} MXN</span>
                </div>
              </div>

              {/* Actions: Download PDF & WhatsApp */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                <button
                  onClick={() => exportOrderReceiptPDF(completedOrder)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#141211] text-[#ecd08c] hover:bg-[#25201d] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Download className="w-4 h-4 text-[#ecd08c]" />
                  Descargar Remisión en PDF
                </button>
                <button
                  onClick={() => handleShareWhatsApp(completedOrder)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  Notificar al Cliente por WhatsApp
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="text-xs text-zinc-500 hover:text-zinc-800 underline font-medium"
                >
                  Regresar a la aplicación
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Steps */
            <>
              {/* Step 1: Customer Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#141211] text-[#ecd08c] font-bold text-xs flex items-center justify-center">
                      1
                    </div>
                    <span className="font-cinzel text-sm font-bold text-[#141211]">
                      Datos del Cliente y Destinatario
                    </span>
                  </div>

                  {/* Client Selector for Vendors */}
                  {isVendor && clients.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-zinc-500 font-semibold">Cargar de mi cartera:</span>
                      <select
                        onChange={e => handleSelectExistingClient(e.target.value)}
                        className="text-xs py-1 px-2 border border-[#b3925d]/40 rounded-lg bg-[#faf8f5] text-[#8c6e3d] font-bold focus:outline-none"
                      >
                        <option value="">Seleccionar Cliente...</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Nombre Completo:
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      placeholder="Nombre del cliente o destinatario"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Teléfono Celular (WhatsApp):
                    </label>
                    <input
                      type="text"
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                      placeholder="Ej. 33 1234 5678"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Dirección Completa (Calle, Número, Colonia):
                    </label>
                    <input
                      type="text"
                      value={clientAddress}
                      onChange={e => setClientAddress(e.target.value)}
                      placeholder="Ej. Av. Chapultepec 410, Col. Americana"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Ciudad / Municipio:
                    </label>
                    <input
                      type="text"
                      value={clientCity}
                      onChange={e => setClientCity(e.target.value)}
                      placeholder="Ej. Guadalajara"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Código Postal:
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={clientPostalCode}
                      onChange={e => setClientPostalCode(e.target.value)}
                      placeholder="Ej. 44160"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: National Shipping Calculator */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#141211] text-[#ecd08c] font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <span className="font-cinzel text-sm font-bold text-[#141211]">
                    Cotización de Envíos Nacionales por Peso ({clientState})
                  </span>
                </div>

                <ShippingCalculator
                  totalWeightGrams={totalCartWeightGrams}
                  selectedState={clientState}
                  onStateChange={setClientState}
                  selectedQuote={selectedQuote}
                  onSelectQuote={setSelectedQuote}
                />
              </div>

              {/* Step 3: Integrated Payment Gateway */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#141211] text-[#ecd08c] font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <span className="font-cinzel text-sm font-bold text-[#141211]">
                    Método de Pago Integrado
                  </span>
                </div>

                {/* Method selector tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#d4145a] bg-[#d4145a]/5 text-[#d4145a] font-bold'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1" />
                    <span className="text-[11px]">Tarjeta Bancaria</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('spei')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      paymentMethod === 'spei'
                        ? 'border-[#d4145a] bg-[#d4145a]/5 text-[#d4145a] font-bold'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mb-1" />
                    <span className="text-[11px]">Transferencia SPEI</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('oxxo')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      paymentMethod === 'oxxo'
                        ? 'border-[#d4145a] bg-[#d4145a]/5 text-[#d4145a] font-bold'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                    }`}
                  >
                    <Store className="w-5 h-5 mb-1" />
                    <span className="text-[11px]">OXXO Pay</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('florigan_credit')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                      paymentMethod === 'florigan_credit'
                        ? 'border-[#b3925d] bg-[#b3925d]/10 text-[#8c6e3d] font-bold'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                    }`}
                  >
                    <Wallet className="w-5 h-5 mb-1" />
                    <span className="text-[11px]">Crédito Florigan</span>
                  </button>
                </div>

                {/* Payment Method Details */}
                <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200 text-xs">
                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-700">Tarjeta de Crédito / Débito:</span>
                        <div className="flex gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-200 text-[9px] font-bold">VISA</span>
                          <span className="px-1.5 py-0.5 rounded bg-zinc-200 text-[9px] font-bold">MASTERCARD</span>
                          <span className="px-1.5 py-0.5 rounded bg-zinc-200 text-[9px] font-bold">AMEX</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="sm:col-span-2">
                          <label className="text-[10px] text-zinc-500 font-bold block mb-1">Número de Tarjeta:</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-500 font-bold block mb-1">Nombre en Tarjeta:</label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={e => setCardHolder(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs uppercase"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-zinc-500 font-bold block mb-1">Expira:</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={e => setCardExpiry(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-500 font-bold block mb-1">CVV:</label>
                            <input
                              type="password"
                              maxLength={4}
                              value={cardCvv}
                              onChange={e => setCardCvv(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs text-center font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'spei' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-800">Transferencia Electrónica SPEI Inmediata</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Aprobación Instantánea</span>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Realiza tu transferencia desde la app de cualquier banco mexicano (BBVA, Banorte, Santander, Banamex, Hey Banco, etc.):
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-zinc-300 font-mono text-xs space-y-1">
                        <div><strong className="text-zinc-600">Banco Receptor:</strong> STP / BBVA México</div>
                        <div><strong className="text-zinc-600">CLABE Interbancaria:</strong> 6461 8011 2400 9182 34</div>
                        <div><strong className="text-zinc-600">Beneficiario:</strong> IMPERIO FLORIGAN S.A. DE C.V.</div>
                        <div><strong className="text-zinc-600">Concepto / Ref:</strong> FLORIGAN-842</div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'oxxo' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-800">Pago en Tiendas OXXO (OXXO Pay)</span>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">Acreditación en Minutos</span>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Se generará una referencia de 14 dígitos que podrás dictar o presentar al cajero de cualquier tienda OXXO en la República Mexicana.
                      </p>
                      <div className="p-3 bg-white rounded-xl border border-zinc-300 font-mono text-center">
                        <div className="text-[10px] text-zinc-400">Referencia de Prueba OXXO Pay:</div>
                        <div className="text-base font-bold text-zinc-800 tracking-widest mt-1">
                          9381 0429 8812 40
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'florigan_credit' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8c6e3d]">Línea de Crédito Emperatriz Florigan (15 Días)</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">Activo</span>
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        Permite a las vendedoras recibir los productos primero, entregarlos a sus clientes y liquidar el costo de mayoreo en un plazo de 15 días naturales.
                      </p>
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-amber-200">
                        <div>
                          <span className="text-[10px] text-zinc-400 block">Límite Total: $15,000 MXN</span>
                          <span className="text-xs font-bold text-zinc-800">Crédito Disponible: $9,850 MXN</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-700">✓ Saldo Suficiente</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary & Final Total */}
              <div className="bg-[#faf8f5] p-4 rounded-2xl border border-[#b3925d]/40 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal Catálogo ({cart.length} productos):</span>
                  <span>${cartSubtotalCatalog.toLocaleString('es-MX')} MXN</span>
                </div>

                {isVendor && (
                  <div className="flex justify-between font-bold text-[#b3925d]">
                    <span>Margen de Ganancia Vendedora (Descuento):</span>
                    <span>-${cartPotentialCommission.toLocaleString('es-MX')} MXN</span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-600">
                  <span>Envío Nacional ({selectedQuote?.carrier || 'Pendiente'}):</span>
                  <span className="font-bold text-[#141211]">
                    {shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toLocaleString('es-MX')} MXN`}
                  </span>
                </div>

                <div className="pt-2 border-t border-zinc-300 flex justify-between items-center text-base font-black text-[#141211]">
                  <span>Total a Pagar:</span>
                  <span className="text-xl text-[#d4145a]">${grandTotal.toLocaleString('es-MX')} MXN</span>
                </div>
              </div>

              {/* Payment Submit Button */}
              <div className="pt-2">
                <button
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#d4145a] via-[#e8226e] to-[#b3925d] text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-[#d4145a]/30 hover:brightness-110 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>Procesando Pago Seguro...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Completar Pago • ${grandTotal.toLocaleString('es-MX')} MXN</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
