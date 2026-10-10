import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CatalogView } from './components/CatalogView';
import { ClientsManager } from './components/ClientsManager';
import { OrdersManager } from './components/OrdersManager';
import { AdminInventory } from './components/AdminInventory';
import { AnalyticsAndReports } from './components/AnalyticsAndReports';
import { ProfileView } from './components/ProfileView';
import { NotificationCenter } from './components/NotificationCenter';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const { currentTab, currentUser } = useApp();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1715] flex flex-col font-['Montserrat',sans-serif]">
      {/* Imperial Navbar */}
      <Navbar onOpenNotifications={() => setIsNotificationsOpen(true)} />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'catalog' && <CatalogView />}
        {currentTab === 'clients' && <ClientsManager />}
        {currentTab === 'orders' && <OrdersManager />}
        {currentTab === 'admin' && (currentUser.role === 'admin' ? <AdminInventory /> : <CatalogView />)}
        {currentTab === 'analytics' && (currentUser.role === 'admin' ? <AnalyticsAndReports /> : <CatalogView />)}
        {currentTab === 'profile' && <ProfileView />}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Slide-over Notification Center */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Login & Registration Modal */}
      <AuthModal />

      {/* Mobile App Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
