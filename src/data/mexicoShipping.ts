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
  { code: 'GTO', name: 'Guanajuato', zone: 'Bajio' },
  { code: 'GRO', name: 'Guerrero', zone: 'Sur' },
  { code: 'HGO', name: 'Hidalgo', zone: 'Centro' },
  { code: 'JAL', name: 'Jalisco (Matriz Guadalajara)', zone: 'Local' },
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

export function calculateShippingQuotes(weightGrams: number, stateName: string): ShippingQuote[] {
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

  // Base pricing
  const baseRedpack = Math.round((115 + (kg > 1 ? (kg - 1) * 22 : 0)) * zoneMultiplier);
  const baseEstafeta = Math.round((145 + (kg > 1 ? (kg - 1) * 26 : 0)) * zoneMultiplier);
  const baseFedEx = Math.round((175 + (kg > 1 ? (kg - 1) * 32 : 0)) * zoneMultiplier);
  const baseDHL = Math.round((210 + (kg > 1 ? (kg - 1) * 38 : 0)) * zoneMultiplier);

  const quotes: ShippingQuote[] = [
    {
      carrier: 'RedPack Terrestre',
      serviceName: 'Económico Nacional Terrestre',
      cost: baseRedpack,
      estimatedDays: zone === 'Local' ? '1 a 2 días hábiles' : '3 a 5 días hábiles',
      weightBracket: bracket,
    },
    {
      carrier: 'Estafeta',
      serviceName: 'Estafeta Estándar Prioritario',
      cost: baseEstafeta,
      estimatedDays: zone === 'Local' ? 'Día siguiente hábil' : '2 a 3 días hábiles',
      weightBracket: bracket,
    },
    {
      carrier: 'FedEx Express',
      serviceName: 'FedEx Express Saver Garantizado',
      cost: baseFedEx,
      estimatedDays: '1 a 2 días hábiles',
      weightBracket: bracket,
    },
    {
      carrier: 'DHL Express',
      serviceName: 'DHL Express 24h Premium',
      cost: baseDHL,
      estimatedDays: '24 hrs hábiles (Día Siguiente)',
      weightBracket: bracket,
    },
  ];

  if (zone === 'Local') {
    quotes.unshift({
      carrier: 'Punto Matriz Guadalajara',
      serviceName: 'Recolección Directa en Centro Distribución Florigan Matriz',
      cost: 0,
      estimatedDays: 'Listo en 2 horas',
      weightBracket: 'Sin límite',
    });
  }

  return quotes;
}
