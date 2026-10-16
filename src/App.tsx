import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CatalogView } from './components/CatalogView';
import { OrdersManager } from './components/OrdersManager';
import { AdminInventory } from './components/AdminInventory';
import { AnalyticsAndReports } from './components/AnalyticsAndReports';
import { ProfileView } from './components/ProfileView';
import { NotificationCenter } from './components/NotificationCenter';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { NavigationDrawer } from './components/NavigationDrawer';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PushToastBanner } from './components/PushToastBanner';

const AppContent: React.FC = () => {
  const { currentTab, currentUser } = useApp();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const isAdmin = currentUser.role === 'admin' && currentUser.email === 'ventas@imperioflorigan.com';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1715] flex flex-col font-['Montserrat',sans-serif]">
      {/* Real-time Push Alert Banner */}
      <PushToastBanner />

      {/* Imperial Navbar with Admin Icon & Drawer Menu Trigger */}
      <Navbar onOpenNotifications={() => setIsNotificationsOpen(true)} />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'catalog' && <CatalogView />}
        {currentTab === 'orders' && <OrdersManager />}
        {currentTab === 'profile' && <ProfileView />}
        {currentTab === 'admin' && (isAdmin ? <AdminInventory /> : <CatalogView />)}
        {currentTab === 'analytics' && (isAdmin ? <AnalyticsAndReports /> : <CatalogView />)}
      </main>

      {/* Official Footer with Socials & Emails */}
      <Footer />

      {/* Floating WhatsApp for Instant Quotes & Direct Sales */}
      <FloatingWhatsApp />

      {/* Dropdown Navigation Drawer for Tablet, PC & Mobile */}
      <NavigationDrawer />

      {/* Admin Login Modal (ventas@imperioflorigan.com / EriPerVan#27) */}
      <AdminLoginModal />

      {/* Feminine Customer Login / Registration Modal (Gmail / Direct) */}
      <AuthModal />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Slide-over Notification Center */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

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
