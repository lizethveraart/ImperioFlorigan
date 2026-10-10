import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Product,
  CartItem,
  Order,
  ClientProfile,
  AppNotification,
  MonthlyReportData,
  ProductPresentation,
  UserRole
} from '../types';
import { INITIAL_PRODUCTS } from '../data/catalog';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  products: Product[];
  updateProductStock: (productId: string, sku: string, newStock: number) => void;
  updateProductPrice: (productId: string, sku: string, newPrice: number) => void;
  addProduct: (product: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: string) => void;
  cart: CartItem[];
  addToCart: (product: Product, presentation: ProductPresentation, qty?: number) => void;
  removeFromCart: (sku: string) => void;
  updateCartQuantity: (sku: string, delta: number) => void;
  clearCart: () => void;
  totalCartWeightGrams: number;
  cartSubtotalCatalog: number;
  cartSubtotalWholesale: number;
  cartPotentialCommission: number;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'monthKey'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status'], tracking?: string) => void;
  clients: ClientProfile[];
  addClient: (client: Omit<ClientProfile, 'id' | 'totalOrdersCount' | 'totalSpent'>) => void;
  updateClient: (client: ClientProfile) => void;
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  pushNotificationsEnabled: boolean;
  setPushNotificationsEnabled: (enabled: boolean) => void;
  currentTab: 'catalog' | 'clients' | 'orders' | 'admin' | 'analytics' | 'profile';
  setCurrentTab: (tab: 'catalog' | 'clients' | 'orders' | 'admin' | 'analytics' | 'profile') => void;
  getMonthlyReport: (monthKey?: string) => MonthlyReportData;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
}

const DEFAULT_USERS: Record<UserRole, User> = {
  vendedor: {
    id: 'usr-vnd-01',
    name: 'Lizeth Emperatriz',
    email: 'Ing.lizethvera@gmail.com',
    role: 'vendedor',
    phone: '33 1071 1718',
    vendorLevel: 'Emperatriz Oro',
    commissionRate: 0.35,
    city: 'Guadalajara',
    state: 'Jalisco (Matriz Guadalajara)',
    creditLimit: 15000,
    availableCredit: 9850,
  },
  cliente: {
    id: 'usr-cli-02',
    name: 'Carolina Velasco',
    email: 'carolina.velasco@gmail.com',
    role: 'cliente',
    phone: '55 4321 8976',
    city: 'Ciudad de México',
    state: 'Ciudad de México',
  },
  admin: {
    id: 'usr-adm-00',
    name: 'Gerencia General Florigan',
    email: 'direccion@florigan.com.mx',
    role: 'admin',
    phone: '33 3619 0000',
    city: 'Guadalajara',
    state: 'Jalisco (Matriz Guadalajara)',
  },
};

const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'clt-01',
    vendorId: 'usr-vnd-01',
    fullName: 'Martha Solís Ramírez',
    phone: '33 1245 9901',
    email: 'martha.solis@outlook.com',
    address: 'Av. Chapultepec 410, Col. Americana',
    city: 'Guadalajara',
    state: 'Jalisco (Matriz Guadalajara)',
    postalCode: '44160',
    skinType: 'Seca y sensible con manchas de sol',
    preferredCategories: ['Facial', 'Capilar'],
    notes: 'Fan de la Baba de Caracol y Crema Concha Nácar. Paga puntual en efectivo o transferencia.',
    totalOrdersCount: 6,
    totalSpent: 4180,
    lastPurchaseDate: '2026-10-02',
  },
  {
    id: 'clt-02',
    vendorId: 'usr-vnd-01',
    fullName: 'Brenda Orozco Guzmán',
    phone: '55 9812 3456',
    email: 'brenda.orozco@yahoo.com',
    address: 'Calle Durango 88, Col. Roma Norte',
    city: 'Ciudad de México',
    state: 'Ciudad de México',
    postalCode: '06700',
    skinType: 'Grasa / con tendencia a brillo',
    preferredCategories: ['Facial', 'Salud & Bienestar'],
    notes: 'Le encanta el dúo de Arroz Matificante y la Fibra Natural de Mango.',
    totalOrdersCount: 4,
    totalSpent: 2890,
    lastPurchaseDate: '2026-09-28',
  },
  {
    id: 'clt-03',
    vendorId: 'usr-vnd-01',
    fullName: 'Roberto Valenzuela Flores',
    phone: '81 1928 3746',
    email: 'roberto.v@gmail.com',
    address: 'Paseo de los Leones 1250, Cumbres',
    city: 'Monterrey',
    state: 'Nuevo León',
    postalCode: '64610',
    skinType: 'Normal / Deportivo',
    preferredCategories: ['Capilar', 'Salud & Bienestar'],
    notes: 'Pide Shampoo Bergamota de 1 Litro y Gel Sin Dolor de Ganoderma para el gimnasio.',
    totalOrdersCount: 3,
    totalSpent: 2240,
    lastPurchaseDate: '2026-10-05',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'FLR-8420',
    date: '2026-10-02 11:30',
    monthKey: '2026-10',
    userId: 'usr-vnd-01',
    userRole: 'vendedor',
    clientName: 'Martha Solís Ramírez',
    clientPhone: '33 1245 9901',
    clientAddress: 'Av. Chapultepec 410, Col. Americana',
    clientCity: 'Guadalajara',
    clientState: 'Jalisco (Matriz Guadalajara)',
    clientPostalCode: '44160',
    items: [
      {
        productId: 'flr-018',
        productName: 'Crema Regeneradora Baba de Caracol',
        size: '350 gr',
        unitPrice: 309,
        wholesaleUnitPrice: 201,
        quantity: 2,
        subtotal: 618,
        weightGrams: 840,
      },
      {
        productId: 'flr-024',
        productName: 'Crema Concha Nácar Aclaradora y Humectante',
        size: '1 Kg',
        unitPrice: 615,
        wholesaleUnitPrice: 399,
        quantity: 1,
        subtotal: 615,
        weightGrams: 1150,
      },
    ],
    subtotalCatalog: 1233,
    subtotalWholesale: 801,
    vendorCommission: 432,
    shippingCost: 0,
    shippingCarrier: 'Punto Matriz Guadalajara',
    totalWeightGrams: 1990,
    grandTotal: 1233,
    paymentMethod: 'florigan_credit',
    paymentStatus: 'Aprobado',
    paymentReference: 'CRED-LIZETH-8420',
    status: 'Entregado',
    trackingNumber: 'ENTREGA-LOCAL-GDL',
  },
  {
    id: 'ord-102',
    orderNumber: 'FLR-8421',
    date: '2026-10-05 16:45',
    monthKey: '2026-10',
    userId: 'usr-vnd-01',
    userRole: 'vendedor',
    clientName: 'Roberto Valenzuela Flores',
    clientPhone: '81 1928 3746',
    clientAddress: 'Paseo de los Leones 1250, Cumbres',
    clientCity: 'Monterrey',
    clientState: 'Nuevo León',
    clientPostalCode: '64610',
    items: [
      {
        productId: 'flr-001',
        productName: 'Shampoo Bergamota',
        size: '1 Lt',
        unitPrice: 459,
        wholesaleUnitPrice: 298,
        quantity: 2,
        subtotal: 918,
        weightGrams: 2160,
      },
      {
        productId: 'flr-040',
        productName: 'Gel Sin Dolor Ganoderma Analgésico',
        size: '350 gr',
        unitPrice: 239,
        wholesaleUnitPrice: 155,
        quantity: 2,
        subtotal: 478,
        weightGrams: 840,
      },
    ],
    subtotalCatalog: 1396,
    subtotalWholesale: 906,
    vendorCommission: 490,
    shippingCost: 206,
    shippingCarrier: 'FedEx Express',
    totalWeightGrams: 3000,
    grandTotal: 1602,
    paymentMethod: 'card',
    paymentStatus: 'Aprobado',
    paymentReference: 'TXN-FDX-99412',
    status: 'Enviado con Guía',
    trackingNumber: 'FDX-773829104MX',
  },
  {
    id: 'ord-103',
    orderNumber: 'FLR-8395',
    date: '2026-09-28 14:15',
    monthKey: '2026-09',
    userId: 'usr-vnd-01',
    userRole: 'vendedor',
    clientName: 'Brenda Orozco Guzmán',
    clientPhone: '55 9812 3456',
    clientAddress: 'Calle Durango 88, Col. Roma Norte',
    clientCity: 'Ciudad de México',
    clientState: 'Ciudad de México',
    clientPostalCode: '06700',
    items: [
      {
        productId: 'flr-059',
        productName: 'Dúo Arroz Matificante Tónico y Crema',
        size: 'Crema 110 gr',
        unitPrice: 279,
        wholesaleUnitPrice: 181,
        quantity: 1,
        subtotal: 279,
        weightGrams: 170,
      },
      {
        productId: 'flr-035',
        productName: 'Fibra Natural Sabor Mango con Nopal y Colágeno',
        size: '540 gr',
        unitPrice: 689,
        wholesaleUnitPrice: 448,
        quantity: 1,
        subtotal: 689,
        weightGrams: 640,
      },
    ],
    subtotalCatalog: 968,
    subtotalWholesale: 629,
    vendorCommission: 339,
    shippingCost: 145,
    shippingCarrier: 'Estafeta',
    totalWeightGrams: 810,
    grandTotal: 1113,
    paymentMethod: 'spei',
    paymentStatus: 'Aprobado',
    paymentReference: 'SPEI-BNMX-4819',
    status: 'Entregado',
    trackingNumber: 'EST-992147321MX',
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '⚠️ Alerta Automática de Stock Bajo',
    message: 'Shampoo Bergamota (350 ml) cuenta con solo 4 unidades en inventario. Se recomienda resurtir.',
    type: 'stock_alert',
    timestamp: 'Hace 10 minutos',
    read: false,
  },
  {
    id: 'notif-2',
    title: '⚠️ Stock Crítico: Aceite Rosa Mosqueta',
    message: 'Aceite Anti-Edad Rosa Mosqueta (125 ml) cuenta con solo 2 unidades disponibles en bodega.',
    type: 'stock_alert',
    timestamp: 'Hace 35 minutos',
    read: false,
  },
  {
    id: 'notif-3',
    title: '🌸 ¡Campaña Aniversario 50 Años Florigan!',
    message: 'Aprovecha bonificación adicional del 5% en comisiones para la Línea Florigan Belleza durante todo Octubre.',
    type: 'offer',
    timestamp: 'Hoy, 09:00',
    read: false,
  },
  {
    id: 'notif-4',
    title: '📦 Pedido #FLR-8421 En Tránsito',
    message: 'Guía FedEx FDX-773829104MX activa con destino a Monterrey, N.L.',
    type: 'order_update',
    timestamp: 'Ayer, 18:20',
    read: true,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('imperio_user');
    return saved ? JSON.parse(saved) : DEFAULT_USERS.vendedor;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('imperio_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('imperio_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('imperio_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [clients, setClients] = useState<ClientProfile[]>(() => {
    const saved = localStorage.getItem('imperio_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('imperio_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<'catalog' | 'clients' | 'orders' | 'admin' | 'analytics' | 'profile'>('catalog');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('imperio_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('imperio_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('imperio_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('imperio_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('imperio_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('imperio_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const switchRole = (newRole: UserRole) => {
    const target = DEFAULT_USERS[newRole];
    setCurrentUser(target);
  };

  const updateProductStock = (productId: string, sku: string, newStock: number) => {
    setProducts(prev => {
      let triggeredLowStockName = '';
      const updated = prev.map(p => {
        if (p.id === productId) {
          const updatedPres = p.presentations.map(pr => {
            if (pr.sku === sku) {
              if (newStock <= 5 && pr.stock > 5) {
                triggeredLowStockName = `${p.name} (${pr.size})`;
              }
              return { ...pr, stock: Math.max(0, newStock) };
            }
            return pr;
          });
          return { ...p, presentations: updatedPres };
        }
        return p;
      });

      if (triggeredLowStockName && pushNotificationsEnabled) {
        const notif: AppNotification = {
          id: `stk-${Date.now()}`,
          title: '⚠️ Alerta de Stock Bajo Automática',
          message: `El producto "${triggeredLowStockName}" ha disminuido a solo ${newStock} unidades en inventario.`,
          type: 'stock_alert',
          timestamp: 'Justo ahora',
          read: false,
        };
        setNotifications(n => [notif, ...n]);
      }

      return updated;
    });
  };

  const updateProductPrice = (productId: string, sku: string, newPrice: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const updatedPres = p.presentations.map(pr => {
            if (pr.sku === sku) {
              return {
                ...pr,
                price: newPrice,
                wholesalePrice: Math.round(newPrice * 0.65),
              };
            }
            return pr;
          });
          return { ...p, presentations: updatedPres };
        }
        return p;
      })
    );
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  useEffect(() => {
    if (currentUser.role !== 'admin' && (currentTab === 'admin' || currentTab === 'analytics')) {
      setCurrentTab('catalog');
    }
  }, [currentUser.role, currentTab]);

  const addToCart = (product: Product, presentation: ProductPresentation, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.presentation.sku === presentation.sku);
      if (existing) {
        return prev.map(item =>
          item.presentation.sku === presentation.sku
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          line: product.line,
          imageUrl: product.imageUrl,
          presentation,
          quantity: qty,
        },
      ];
    });
  };

  const removeFromCart = (sku: string) => {
    setCart(prev => prev.filter(item => item.presentation.sku !== sku));
  };

  const updateCartQuantity = (sku: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.presentation.sku === sku) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const totalCartWeightGrams = cart.reduce(
    (sum, item) => sum + item.presentation.weightGrams * item.quantity,
    0
  );

  const cartSubtotalCatalog = cart.reduce(
    (sum, item) => sum + item.presentation.price * item.quantity,
    0
  );

  const cartSubtotalWholesale = cart.reduce(
    (sum, item) => sum + (item.presentation.wholesalePrice || Math.round(item.presentation.price * 0.65)) * item.quantity,
    0
  );

  const cartPotentialCommission = Math.max(0, cartSubtotalCatalog - cartSubtotalWholesale);

  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'monthKey'>) => {
    const now = new Date();
    const orderNumber = `FLR-${Math.floor(8400 + Math.random() * 1000)}`;
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      date: dateStr,
      monthKey,
    };

    // Deduct stock and trigger low stock alerts if threshold breached
    setProducts(prev => {
      const lowStockAlerts: string[] = [];
      const updated = prev.map(prod => {
        const matchingCartItems = orderData.items.filter(i => i.productId === prod.id);
        if (matchingCartItems.length === 0) return prod;

        const updatedPres = prod.presentations.map(pres => {
          const orderMatch = matchingCartItems.find(i => i.size === pres.size);
          if (orderMatch) {
            const nextStock = Math.max(0, pres.stock - orderMatch.quantity);
            if (nextStock <= 5 && pres.stock > 5) {
              lowStockAlerts.push(`${prod.name} (${pres.size}) con ${nextStock} unidades restantes`);
            }
            return { ...pres, stock: nextStock };
          }
          return pres;
        });

        return { ...prod, presentations: updatedPres };
      });

      if (lowStockAlerts.length > 0 && pushNotificationsEnabled) {
        lowStockAlerts.forEach(alertText => {
          setNotifications(n => [
            {
              id: `stk-${Date.now()}-${Math.random()}`,
              title: '⚠️ Alerta Automática de Nivel de Stock Bajo',
              message: `El pedido ${orderNumber} redujo el inventario de: ${alertText}.`,
              type: 'stock_alert',
              timestamp: 'Justo ahora',
              read: false,
            },
            ...n,
          ]);
        });
      }

      return updated;
    });

    setOrders(prev => [newOrder, ...prev]);

    // Update client stats if client matches
    setClients(prev =>
      prev.map(c => {
        if (c.fullName.toLowerCase() === orderData.clientName.toLowerCase() || c.phone === orderData.clientPhone) {
          return {
            ...c,
            totalOrdersCount: c.totalOrdersCount + 1,
            totalSpent: c.totalSpent + orderData.grandTotal,
            lastPurchaseDate: dateStr.split(' ')[0],
          };
        }
        return c;
      })
    );

    // Push notification for order confirmation
    const notif: AppNotification = {
      id: `ord-notif-${Date.now()}`,
      title: `🎉 Nuevo Pedido ${orderNumber} Registrado`,
      message: `El pedido para ${orderData.clientName} por $${orderData.grandTotal.toLocaleString('es-MX')} ha sido registrado exitosamente con ${orderData.shippingCarrier}.`,
      type: 'order_update',
      timestamp: 'Justo ahora',
      read: false,
    };
    setNotifications(n => [notif, ...n]);

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], tracking?: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            trackingNumber: tracking || o.trackingNumber,
          };
        }
        return o;
      })
    );

    const found = orders.find(o => o.id === orderId);
    if (found && pushNotificationsEnabled) {
      const notif: AppNotification = {
        id: `ord-stat-${Date.now()}`,
        title: `🚚 Actualización de Envío: ${found.orderNumber}`,
        message: `El estatus cambió a "${status}". Paquetería: ${found.shippingCarrier}.`,
        type: 'order_update',
        timestamp: 'Justo ahora',
        read: false,
      };
      setNotifications(n => [notif, ...n]);
    }
  };

  const addClient = (clientData: Omit<ClientProfile, 'id' | 'totalOrdersCount' | 'totalSpent'>) => {
    const newClient: ClientProfile = {
      ...clientData,
      id: `clt-${Date.now()}`,
      totalOrdersCount: 0,
      totalSpent: 0,
    };
    setClients(prev => [newClient, ...prev]);
  };

  const updateClient = (client: ClientProfile) => {
    setClients(prev => prev.map(c => (c.id === client.id ? client : c)));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const getMonthlyReport = (monthKey?: string): MonthlyReportData => {
    const now = new Date();
    const currentKey = monthKey || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const [yearStr, monthStr] = currentKey.split('-');
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);

    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const monthName = `${monthNames[monthNum - 1]} ${year}`;

    const filteredOrders = orders.filter(o => o.monthKey === currentKey);

    let totalCatalogSales = 0;
    let totalWholesaleSales = 0;
    let totalCommissions = 0;
    let totalShippingCollected = 0;

    const productMap = new Map<string, { quantity: number; revenue: number }>();
    const stateMap = new Map<string, { count: number; total: number }>();
    const lineMap = new Map<string, { count: number; total: number }>();

    filteredOrders.forEach(ord => {
      totalCatalogSales += ord.subtotalCatalog;
      totalWholesaleSales += ord.subtotalWholesale;
      totalCommissions += ord.vendorCommission;
      totalShippingCollected += ord.shippingCost;

      // By state
      const st = ord.clientState || 'Jalisco';
      const curState = stateMap.get(st) || { count: 0, total: 0 };
      stateMap.set(st, {
        count: curState.count + 1,
        total: curState.total + ord.grandTotal,
      });

      // By items
      ord.items.forEach(it => {
        const curProd = productMap.get(it.productName) || { quantity: 0, revenue: 0 };
        productMap.set(it.productName, {
          quantity: curProd.quantity + it.quantity,
          revenue: curProd.revenue + it.subtotal,
        });

        // Find product line
        const prodMatch = products.find(p => p.id === it.productId);
        const line = prodMatch ? prodMatch.line : 'Línea Florigan Belleza';
        const curLine = lineMap.get(line) || { count: 0, total: 0 };
        lineMap.set(line, {
          count: curLine.count + it.quantity,
          total: curLine.total + it.subtotal,
        });
      });
    });

    const topProducts = Array.from(productMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const salesByState = Array.from(stateMap.entries())
      .map(([state, data]) => ({ state, ...data }))
      .sort((a, b) => b.total - a.total);

    const salesByLine = Array.from(lineMap.entries())
      .map(([line, data]) => ({ line, ...data }))
      .sort((a, b) => b.total - a.total);

    return {
      monthKey: currentKey,
      monthName,
      year,
      totalOrders: filteredOrders.length,
      totalCatalogSales,
      totalWholesaleSales,
      totalCommissions,
      totalShippingCollected,
      topProducts,
      salesByState,
      salesByLine,
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        products,
        updateProductStock,
        updateProductPrice,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        totalCartWeightGrams,
        cartSubtotalCatalog,
        cartSubtotalWholesale,
        cartPotentialCommission,
        orders,
        createOrder,
        updateOrderStatus,
        clients,
        addClient,
        updateClient,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        pushNotificationsEnabled,
        setPushNotificationsEnabled,
        currentTab,
        setCurrentTab,
        getMonthlyReport,
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
