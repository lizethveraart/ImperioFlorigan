import { ShippingQuote } from '../types';

export interface MexicoState {
  code: string;
  name: string;
  zone: 'Local' | 'Centro' | 'Bajio' | 'Norte' | 'Sur' | 'Frontera/Peninsula';
}

export const MEXICO_STATES: MexicoState[] = [
  { code: 'AGS', name: 'Aguascalientes', zone: 'Bajio' },
  { code: 'BC', name: 'Baja California', zone: 'Frontera/Peninsula' },
  { code: 'BCS', name: 'Baja California Sur', zone: 'Frontera/Peninsula' },
  { code: 'CAM', name: 'Campeche', zone: 'Sur' },
  { code: 'CHIS', name: 'Chiapas', zone: 'Sur' },
  { code: 'CHIH', name: 'Chihuahua', zone: 'Norte' },
  { code: 'CDMX', name: 'Ciudad de México', zone: 'Centro' },
  { code: 'COAH', name: 'Coahuila', zone: 'Norte' },
  { code: 'COL', name: 'Colima', zone: 'Bajio' },
  { code: 'DGO', name: 'Durango', zone: 'Norte' },
  { code: 'GTO', name: 'Guanajuato (Matriz Irapuato)', zone: 'Local' },
  { code: 'GRO', name: 'Guerrero', zone: 'Sur' },
  { code: 'HGO', name: 'Hidalgo', zone: 'Centro' },
  { code: 'JAL', name: 'Jalisco', zone: 'Bajio' },
  { code: 'MEX', name: 'Estado de México', zone: 'Centro' },
  { code: 'MICH', name: 'Michoacán', zone: 'Bajio' },
  { code: 'MOR', name: 'Morelos', zone: 'Centro' },
  { code: 'NAY', name: 'Nayarit', zone: 'Bajio' },
  { code: 'NL', name: 'Nuevo León', zone: 'Norte' },
  { code: 'OAX', name: 'Oaxaca', zone: 'Sur' },
  { code: 'PUE', name: 'Puebla', zone: 'Centro' },
  { code: 'QRO', name: 'Querétaro', zone: 'Bajio' },
  { code: 'QROO', name: 'Quintana Roo', zone: 'Frontera/Peninsula' },
  { code: 'SLP', name: 'San Luis Potosí', zone: 'Bajio' },
  { code: 'SIN', name: 'Sinaloa', zone: 'Norte' },
  { code: 'SON', name: 'Sonora', zone: 'Norte' },
  { code: 'TAB', name: 'Tabasco', zone: 'Sur' },
  { code: 'TAM', name: 'Tamaulipas', zone: 'Norte' },
  { code: 'TLAX', name: 'Tlaxcala', zone: 'Centro' },
  { code: 'VER', name: 'Veracruz', zone: 'Sur' },
  { code: 'YUC', name: 'Yucatán', zone: 'Sur' },
  { code: 'ZAC', name: 'Zacatecas', zone: 'Bajio' },
];

import { ShippingCarrierRate } from '../types';

export const DEFAULT_CARRIER_RATES: ShippingCarrierRate[] = [
  {
    carrier: 'RedPack Terrestre',
    serviceName: 'Económico Nacional Terrestre',
    baseCost: 115,
    extraKgCost: 22,
    estimatedDays: '3 a 5 días hábiles',
    active: true,
  },
  {
    carrier: 'Estafeta',
    serviceName: 'Estafeta Estándar Prioritario',
    baseCost: 145,
    extraKgCost: 26,
    estimatedDays: '2 a 3 días hábiles',
    active: true,
  },
  {
    carrier: 'FedEx Express',
    serviceName: 'FedEx Express Saver Garantizado',
    baseCost: 175,
    extraKgCost: 32,
    estimatedDays: '1 a 2 días hábiles',
    active: true,
  },
  {
    carrier: 'DHL Express',
    serviceName: 'DHL Express 24h Premium',
    baseCost: 210,
    extraKgCost: 38,
    estimatedDays: '24 hrs hábiles (Día Siguiente)',
    active: true,
  },
];

export function calculateShippingQuotes(
  weightGrams: number,
  stateName: string,
  customRates: ShippingCarrierRate[] = DEFAULT_CARRIER_RATES
): ShippingQuote[] {
  const kg = Math.max(0.3, weightGrams / 1000);
  const found = MEXICO_STATES.find(s => s.name.toLowerCase().includes(stateName.toLowerCase()));
  const zone = found ? found.zone : 'Centro';

  // Zone multiplier
  let zoneMultiplier = 1.0;
  if (zone === 'Local') zoneMultiplier = 0.75;
  else if (zone === 'Bajio' || zone === 'Centro') zoneMultiplier = 1.0;
  else if (zone === 'Norte' || zone === 'Sur') zoneMultiplier = 1.18;
  else if (zone === 'Frontera/Peninsula') zoneMultiplier = 1.35;

  const bracket = kg <= 1 ? 'Hasta 1.0 kg' : kg <= 3 ? '1.1 - 3.0 kg' : kg <= 5 ? '3.1 - 5.0 kg' : `${kg.toFixed(1)} kg pesado`;

  const quotes: ShippingQuote[] = [];

  // Local pickup if in Guanajuato/Local
  if (zone === 'Local') {
    quotes.push({
      carrier: 'Punto Matriz Irapuato',
      serviceName: 'Recolección Directa en Centro de Distribución Irapuato, Gto.',
      cost: 0,
      estimatedDays: 'Listo en 2 horas',
      weightBracket: 'Sin límite',
    });
  }

  // Iterate over active carrier rates
  customRates.forEach(rate => {
    if (!rate.active) return;
    const extraKg = kg > 1 ? kg - 1 : 0;
    const calculatedCost = Math.round((rate.baseCost + extraKg * rate.extraKgCost) * zoneMultiplier);
    
    let days = rate.estimatedDays;
    if (zone === 'Local') {
      days = rate.carrier === 'Estafeta' ? 'Día siguiente hábil' : '1 a 2 días hábiles';
    }

    quotes.push({
      carrier: rate.carrier,
      serviceName: rate.serviceName,
      cost: calculatedCost,
      estimatedDays: days,
      weightBracket: bracket,
    });
  });

  return quotes;
}
