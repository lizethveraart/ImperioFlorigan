export type UserRole = 'cliente' | 'admin' | 'vendedor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  city?: string;
  state?: string;
  address?: string;
  postalCode?: string;
  authProvider?: 'google' | 'email';
  savedCart?: CartItem[];
  vendorLevel?: 'Emperatriz Bronce' | 'Emperatriz Plata' | 'Emperatriz Oro' | 'Emperatriz Diamante';
  commissionRate?: number;
  creditLimit?: number;
  availableCredit?: number;
}

export interface ProductPresentation {
  size: string; // e.g. "350 ml", "1 Lt", "100 gr"
  price: number; // Precio Catálogo
  wholesalePrice?: number; // Precio Vendedora (con descuento del 35%)
  weightGrams: number; // Gramos para cálculo de flete
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  line: string; // e.g. "Línea Elementos Concentrados", "Línea Organics", etc.
  category: 'Capilar' | 'Facial' | 'Corporal' | 'Salud & Bienestar' | 'Fragancias & Feromonas' | 'Bebé';
  tagline: string;
  description: string;
  benefits: string[];
  keyIngredients: string[];
  imageUrl: string;
  presentations: ProductPresentation[];
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  line: string;
  imageUrl: string;
  presentation: ProductPresentation;
  quantity: number;
}

export interface ClientProfile {
  id: string;
  vendorId: string;
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  skinType?: string;
  preferredCategories?: string[];
  notes?: string;
  totalOrdersCount: number;
  totalSpent: number;
  lastPurchaseDate?: string;
}

export type PaymentMethodType = 'spei' | 'oxxo' | 'whatsapp' | 'card' | 'florigan_credit';

export interface ShippingCarrierRate {
  carrier: 'Estafeta' | 'FedEx Express' | 'RedPack Terrestre' | 'DHL Express';
  serviceName: string;
  baseCost: number;
  extraKgCost: number;
  estimatedDays: string;
  active: boolean;
}

export interface ShippingQuote {
  carrier: 'Estafeta' | 'FedEx Express' | 'RedPack Terrestre' | 'DHL Express' | 'Punto Matriz Irapuato' | 'Punto Matriz Guadalajara';
  serviceName: string;
  cost: number;
  estimatedDays: string;
  weightBracket: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  unitPrice: number;
  wholesaleUnitPrice: number;
  quantity: number;
  subtotal: number;
  weightGrams: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  monthKey: string; // "2026-10"
  userId: string;
  userRole: UserRole;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientPostalCode: string;
  items: OrderItem[];
  subtotalCatalog: number;
  subtotalWholesale: number;
  vendorCommission: number;
  shippingCost: number;
  shippingCarrier: string;
  totalWeightGrams: number;
  grandTotal: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'Aprobado' | 'Pendiente' | 'Verificado';
  paymentReference?: string;
  status: 'Preparando' | 'Enviado con Guía' | 'En Ruta de Entrega' | 'Entregado';
  trackingNumber?: string;
  notes?: string;
}

export type NotificationType =
  | 'stock_alert'
  | 'offer'
  | 'order_update'
  | 'inventory_update'
  | 'new_product'
  | 'system';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  productId?: string;
  productName?: string;
  targetRole?: UserRole | 'all';
  adminAuthor?: string;
  isPushSent?: boolean;
}

export interface MonthlyReportData {
  monthKey: string;
  monthName: string;
  year: number;
  totalOrders: number;
  totalCatalogSales: number;
  totalWholesaleSales: number;
  totalCommissions: number;
  totalShippingCollected: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  salesByState: { state: string; count: number; total: number }[];
  salesByLine: { line: string; count: number; total: number }[];
}
