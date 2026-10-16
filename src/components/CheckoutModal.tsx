import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShippingQuote, PaymentMethodType, Order } from '../types';
import { ShippingCalculator } from './ShippingCalculator';
import { exportOrderReceiptPDF } from '../services/pdfService';
import confetti from 'canvas-confetti';
import {
  X,
  Building2,
  Store,
  MessageCircle,
  CheckCircle2,
  Download,
  AlertCircle,
  Truck,
  User,
  MapPin,
  Lock,
  Phone,
  Sparkles,
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
    currentUser,
    createOrder,
    clearCart,
  } = useApp();

  if (!isOpen || cart.length === 0) return null;

  const [clientName, setClientName] = useState(currentUser.name || '');
  const [clientPhone, setClientPhone] = useState(currentUser.phone && !currentUser.phone.includes('3619') ? currentUser.phone : '000 000 0000');
  const [clientAddress, setClientAddress] = useState(currentUser.address || 'Av. Guerrero 1500, Col. Jardines');
  const [clientCity, setClientCity] = useState(currentUser.city && currentUser.city !== 'Guadalajara' ? currentUser.city : 'Irapuato');
  const [clientState, setClientState] = useState(currentUser.state && !currentUser.state.includes('Guadalajara') ? currentUser.state : 'Guanajuato');
  const [clientPostalCode, setClientPostalCode] = useState(currentUser.postalCode || '36660');

  const [selectedQuote, setSelectedQuote] = useState<ShippingQuote | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('spei');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const shippingCost = selectedQuote ? selectedQuote.cost : 0;
  const grandTotal = cartSubtotalCatalog + shippingCost;

  const handleProcessPayment = () => {
    if (!clientName.trim() || !clientPhone.trim() || !clientAddress.trim() || !selectedQuote) {
      alert('Por favor completa los datos de entrega y selecciona una paquetería.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      let ref = `REF-FLR-${Math.floor(100000 + Math.random() * 900000)}`;
      if (paymentMethod === 'spei') ref = `SPEI-BBVA-${Math.floor(10000000 + Math.random() * 90000000)}`;
      if (paymentMethod === 'oxxo') ref = `OXXO-9381-0429-${Math.floor(1000 + Math.random() * 9000)}`;
      if (paymentMethod === 'whatsapp') ref = `WSP-${Math.floor(10000 + Math.random() * 90000)}`;

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

      // Generate random courier tracking number
      const carrierPrefix = selectedQuote.carrier.includes('FedEx')
        ? 'FDX'
        : selectedQuote.carrier.includes('Estafeta')
        ? 'EST'
        : selectedQuote.carrier.includes('DHL')
        ? 'DHL'
        : 'RPK';
      const tracking = `${carrierPrefix}-${Math.floor(100000000 + Math.random() * 900000000)}MX`;

      const newOrder = createOrder({
        userId: currentUser.id,
        userRole: 'cliente',
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientAddress: clientAddress.trim(),
        clientCity: clientCity.trim(),
        clientState,
        clientPostalCode: clientPostalCode.trim(),
        items: orderItems,
        subtotalCatalog: cartSubtotalCatalog,
        subtotalWholesale: Math.round(cartSubtotalCatalog * 0.65),
        vendorCommission: 0,
        shippingCost,
        shippingCarrier: selectedQuote.carrier,
        totalWeightGrams: totalCartWeightGrams,
        grandTotal,
        paymentMethod,
        paymentStatus: 'Aprobado',
        paymentReference: ref,
        status: 'Preparando',
        trackingNumber: tracking,
        notes: `Pedido realizado en línea por ${clientName}`,
      });

      setCompletedOrder(newOrder);
      setIsProcessing(false);

      // Launch golden celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b3925d', '#ecd08c', '#d4145a', '#ffffff'],
      });
    }, 1200);
  };

  const handleFinishAndClose = () => {
    setCompletedOrder(null);
    onClose();
  };

  const handleSendWhatsAppOrder = (order: Order) => {
    const text = encodeURIComponent(
      `¡Hola Imperio Florigan! Acabo de registrar mi pedido #${order.orderNumber} por un total de $${order.grandTotal} MXN con envío a ${order.clientCity}, ${order.clientState}. Método: ${order.paymentMethod.toUpperCase()} (Ref: ${order.paymentReference}).`
    );
    window.open(`https://wa.me/520000000000?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#b3925d]/40 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#141211] text-white flex items-center justify-between border-b border-[#b3925d]/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#d4145a] to-[#b3925d] flex items-center justify-center text-xs font-bold text-white shadow">
              F
            </div>
            <div>
              <h2 className="font-cinzel text-base font-bold text-[#ecd08c]">
                Finalizar Compra Directa
              </h2>
              <span className="text-[10px] text-zinc-300">
                Imperio Florigan • Envíos Oficiales a Todo México
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[#1a1715]">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-cinzel text-xl font-bold text-[#141211]">
                  ¡Pedido Confirmado con Éxito!
                </h3>
                <p className="text-xs text-zinc-600 mt-1">
                  Tu compra ha sido registrada. Hemos reservado tu producto en almacén para despacho nacional.
                </p>
              </div>

              {/* Order Summary Receipt Box */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#b3925d]/30 text-left max-w-md mx-auto text-xs space-y-2">
                <div className="flex justify-between border-b border-zinc-200 pb-2">
                  <span className="font-bold text-zinc-500">Número de Pedido:</span>
                  <span className="font-mono font-bold text-[#d4145a]">#{completedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-2">
                  <span className="font-bold text-zinc-500">Destinatario:</span>
                  <span className="font-semibold text-zinc-800">{completedOrder.clientName}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-2">
                  <span className="font-bold text-zinc-500">Destino:</span>
                  <span className="text-zinc-700">{completedOrder.clientCity}, {completedOrder.clientState}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-2">
                  <span className="font-bold text-zinc-500">Paquetería:</span>
                  <span className="font-semibold text-zinc-800">{completedOrder.shippingCarrier}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-2">
                  <span className="font-bold text-zinc-500">Guía Asignada:</span>
                  <span className="font-mono font-bold text-blue-700">{completedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 pb-2">
                  <span className="font-bold text-zinc-500">Total Pagado:</span>
                  <span className="font-black text-sm text-[#d4145a]">
                    ${completedOrder.grandTotal.toLocaleString('es-MX')} MXN
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-zinc-500">Referencia de Pago:</span>
                  <span className="font-mono text-zinc-600">{completedOrder.paymentReference}</span>
                </div>
              </div>

              {/* Instructions based on payment method */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 max-w-md mx-auto text-left">
                {completedOrder.paymentMethod === 'spei' && (
                  <div>
                    <strong className="block font-bold mb-1">Instrucciones para Transferencia SPEI:</strong>
                    Transfiere <strong>${completedOrder.grandTotal} MXN</strong> a la CLABE <strong>6461 8011 2400 9182 34</strong> (STP/BBVA) a nombre de <strong>IMPERIO FLORIGAN S.A. DE C.V.</strong> indicando en concepto <strong>{completedOrder.orderNumber}</strong>.
                  </div>
                )}
                {completedOrder.paymentMethod === 'oxxo' && (
                  <div>
                    <strong className="block font-bold mb-1">Instrucciones para Pago en OXXO:</strong>
                    Acude a cualquier tienda OXXO y proporciona al cajero la referencia <strong>{completedOrder.paymentReference}</strong> por un total de <strong>${completedOrder.grandTotal} MXN</strong>.
                  </div>
                )}
                {completedOrder.paymentMethod === 'whatsapp' && (
                  <div>
                    <strong className="block font-bold mb-1">Atención Directa por WhatsApp:</strong>
                    Presiona el botón verde abajo para enviar el resumen de tu pedido a nuestra asesora y coordinar la confirmación inmediata.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => exportOrderReceiptPDF(completedOrder)}
                  className="px-4 py-2.5 rounded-xl bg-[#141211] text-[#ecd08c] font-bold text-xs flex items-center gap-2 hover:bg-[#2b2724] transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar Nota en PDF</span>
                </button>

                <button
                  onClick={() => handleSendWhatsAppOrder(completedOrder)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar por WhatsApp</span>
                </button>

                <button
                  onClick={handleFinishAndClose}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition-colors"
                >
                  Seguir Comprando
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form Steps */
            <>
              {/* Step 1: Customer Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#141211] text-[#ecd08c] font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <span className="font-cinzel text-sm font-bold text-[#141211]">
                    Datos de Envío y Contacto
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Nombre Completo:
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      placeholder="Nombre de quien recibe"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Teléfono WhatsApp (para avisos de guía):
                    </label>
                    <input
                      type="text"
                      required
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                      placeholder="Ej. 33 1234 5678"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Dirección Completa (Calle, Número Exterior/Interior, Colonia):
                    </label>
                    <input
                      type="text"
                      required
                      value={clientAddress}
                      onChange={e => setClientAddress(e.target.value)}
                      placeholder="Ej. Av. Chapultepec 410, Col. Americana"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
                      Ciudad o Municipio:
                    </label>
                    <input
                      type="text"
                      required
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
                      required
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
                    Cotización de Envío Nacional por Peso ({clientState})
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

              {/* Step 3: Payment Method (SPEI, OXXO, WhatsApp - NO Card) */}
              <div className="space-y-3 pt-4 border-t border-zinc-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#141211] text-[#ecd08c] font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <span className="font-cinzel text-sm font-bold text-[#141211]">
                    Método de Pago Seguro
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('spei')}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                      paymentMethod === 'spei'
                        ? 'border-[#d4145a] bg-[#d4145a]/5 text-[#d4145a] font-bold shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold">Transferencia SPEI</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">BBVA / STP Instantáneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('oxxo')}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                      paymentMethod === 'oxxo'
                        ? 'border-[#d4145a] bg-[#d4145a]/5 text-[#d4145a] font-bold shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                    }`}
                  >
                    <Store className="w-5 h-5 mb-1.5" />
                    <span className="text-xs font-bold">Pago OXXO Pay</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">Efectivo en cualquier tienda</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
                      paymentMethod === 'whatsapp'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5 mb-1.5 text-emerald-600" />
                    <span className="text-xs font-bold">WhatsApp Directo</span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">Atención y cotización personalizada</span>
                  </button>
                </div>

                {/* Method instructions preview */}
                <div className="bg-[#faf8f5] rounded-2xl p-4 border border-[#e8cbb0] text-xs">
                  {paymentMethod === 'spei' && (
                    <div className="space-y-1.5 text-zinc-700">
                      <div className="flex items-center justify-between">
                        <strong className="text-zinc-900">Transferencia Electrónica SPEI Inmediata:</strong>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          Sin Comisiones
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600">
                        Al confirmar tu pedido recibirás la CLABE interbancaria única para transferir desde BBVA, Santander, Banamex o cualquier banco.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'oxxo' && (
                    <div className="space-y-1.5 text-zinc-700">
                      <div className="flex items-center justify-between">
                        <strong className="text-zinc-900">Pago en Efectivo OXXO Pay:</strong>
                        <span className="text-[10px] font-bold text-zinc-600 bg-zinc-200 px-2 py-0.5 rounded">
                          Nacional
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600">
                        Se generará una referencia numérica y código de barras para que pagues en cualquier caja OXXO de la República Mexicana.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'whatsapp' && (
                    <div className="space-y-1.5 text-zinc-700">
                      <div className="flex items-center justify-between">
                        <strong className="text-emerald-900">Asesoría Directa por WhatsApp:</strong>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          Atención VIP
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600">
                        Tu pedido quedará reservado y una asesora oficial de Florigan te contactará para coordinar tu forma de pago preferida.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Total & CTA */}
              <div className="pt-4 border-t border-zinc-200 space-y-2">
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Subtotal Productos ({cart.length} artículos):</span>
                  <span className="font-bold text-zinc-900">${cartSubtotalCatalog.toLocaleString('es-MX')} MXN</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Costo de Envío ({selectedQuote ? selectedQuote.carrier : 'Pendiente'}):</span>
                  <span className="font-bold text-zinc-900">${shippingCost.toLocaleString('es-MX')} MXN</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#141211] pt-2 border-t border-zinc-200">
                  <span>Total a Pagar:</span>
                  <span className="text-[#d4145a] text-lg">${grandTotal.toLocaleString('es-MX')} MXN</span>
                </div>

                <button
                  type="button"
                  disabled={isProcessing || !selectedQuote}
                  onClick={handleProcessPayment}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4145a] via-[#e8226e] to-[#b3925d] text-white font-cinzel font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-xl shadow-[#d4145a]/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {isProcessing ? (
                    <span>Procesando y Asignando Guía...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Confirmar Pedido (${grandTotal.toLocaleString('es-MX')} MXN)</span>
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
