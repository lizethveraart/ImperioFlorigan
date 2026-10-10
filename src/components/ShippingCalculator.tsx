import React, { useState, useMemo } from 'react';
import { MEXICO_STATES, calculateShippingQuotes } from '../data/mexicoShipping';
import { ShippingQuote } from '../types';
import { Truck, MapPin, Scale, Clock, ShieldCheck, Check } from 'lucide-react';

interface ShippingCalculatorProps {
  totalWeightGrams: number;
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedQuote: ShippingQuote | null;
  onSelectQuote: (quote: ShippingQuote) => void;
}

export const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({
  totalWeightGrams,
  selectedState,
  onStateChange,
  selectedQuote,
  onSelectQuote,
}) => {
  const [postalCode, setPostalCode] = useState('');

  const quotes = useMemo(() => {
    return calculateShippingQuotes(totalWeightGrams, selectedState);
  }, [totalWeightGrams, selectedState]);

  // Default select first quote if none selected
  React.useEffect(() => {
    if ((!selectedQuote || !quotes.some(q => q.carrier === selectedQuote.carrier)) && quotes.length > 0) {
      onSelectQuote(quotes[0]);
    }
  }, [quotes, selectedQuote, onSelectQuote]);

  const weightInKg = Math.max(0.1, totalWeightGrams / 1000).toFixed(2);

  return (
    <div className="bg-[#faf8f5] rounded-2xl p-4 border border-[#b3925d]/30 text-[#1a1715]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#d4145a]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#141211]">
            Cotizador de Envíos Nacionales
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-600 bg-white px-2 py-0.5 rounded-full border border-zinc-200">
          <Scale className="w-3 h-3 text-[#b3925d]" />
          <span>Peso Total: {weightInKg} kg</span>
        </div>
      </div>

      {/* State & Postal Code inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
        <div>
          <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
            Estado de la República:
          </label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <select
              value={selectedState}
              onChange={e => onStateChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-zinc-300 rounded-xl text-xs font-medium text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
            >
              {MEXICO_STATES.map(st => (
                <option key={st.code} value={st.name}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
            Código Postal (5 dígitos):
          </label>
          <input
            type="text"
            maxLength={5}
            value={postalCode}
            onChange={e => setPostalCode(e.target.value.replace(/\D/g, ''))}
            placeholder="Ej. 44100 / 06700"
            className="w-full px-3 py-1.5 bg-white border border-zinc-300 rounded-xl text-xs font-medium text-zinc-800 focus:outline-none focus:ring-1 focus:ring-[#d4145a]"
          />
        </div>
      </div>

      {/* Available Courier Quotes */}
      <div className="mt-3 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
          Opciones de Paquetería Disponibles:
        </span>

        {quotes.map(quote => {
          const isSelected = selectedQuote?.carrier === quote.carrier;
          const isFree = quote.cost === 0;

          return (
            <div
              key={quote.carrier}
              onClick={() => onSelectQuote(quote)}
              className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white border-[#d4145a] ring-1 ring-[#d4145a] shadow-sm'
                  : 'bg-white/70 border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-[#d4145a] bg-[#d4145a] text-white' : 'border-zinc-400'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#141211]">{quote.carrier}</span>
                    <span className="text-[10px] text-zinc-500 hidden sm:inline">• {quote.serviceName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5 text-zinc-400" /> {quote.estimatedDays}
                    </span>
                    <span>• {quote.weightBracket}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-xs font-black ${isFree ? 'text-emerald-700' : 'text-[#d4145a]'}`}>
                  {isFree ? 'GRATIS' : `$${quote.cost} MXN`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 pt-2 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Envíos asegurados y rastreables
        </span>
        <span>Solo República Mexicana</span>
      </div>

    </div>
  );
};
