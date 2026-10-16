import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const { currentUser, cart } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendDefaultWhatsApp = () => {
    let customText = `¡Hola Imperio Florigan! Deseo solicitar una cotización y asesoría de venta directa.`;
    if (cartItemsCount > 0) {
      customText = `¡Hola Imperio Florigan! Tengo ${cartItemsCount} productos en mi carrito y deseo cotizar el envío directo a mi código postal.`;
    }
    const encoded = encodeURIComponent(message.trim() || customText);
    window.open(`https://wa.me/520000000000?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Message Bubble */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 text-[#1a1715]">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white shadow-inner">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs leading-none">Imperio Florigan Oficial</h4>
                <span className="text-[10px] text-emerald-100 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Asesora en línea para cotizaciones
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 text-xs bg-[#fdfcfb]">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-950 text-[11px] leading-relaxed">
              👋 ¡Hola{currentUser.name ? ` ${currentUser.name.split(' ')[0]}` : ''}! ¿En qué te podemos consentir hoy? Pregúntanos por existencias, cotizaciones de envío a tu estado o sugerencias botánicas.
            </div>

            {cartItemsCount > 0 && (
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[10px] flex items-center justify-between">
                <span>Tienes <strong>{cartItemsCount} artículos</strong> en tu carrito.</span>
                <span className="font-bold text-[#d4145a]">Cotizar flete</span>
              </div>
            )}

            <div>
              <textarea
                rows={2}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Escribe tu consulta o código postal..."
                className="w-full p-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>

            <button
              onClick={handleSendDefaultWhatsApp}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Iniciar Chat en WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="relative group">
        {!isOpen && (
          <span className="hidden sm:inline-block absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-xl bg-[#141211] text-[#ecd08c] border border-[#b3925d]/40 text-xs font-semibold shadow-xl pointer-events-none group-hover:opacity-100 transition-opacity">
            💬 ¡Cotiza y pide por WhatsApp!
          </span>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all border-2 border-white/60 relative"
          title="Atención directa por WhatsApp"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25" />
          {isOpen ? (
            <X className="w-6 h-6 text-white relative z-10" />
          ) : (
            <MessageCircle className="w-7 h-7 text-white relative z-10" />
          )}
        </button>
      </div>
    </div>
  );
};
