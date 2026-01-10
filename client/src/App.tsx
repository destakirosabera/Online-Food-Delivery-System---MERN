
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import { OrderProvider } from './context/OrderContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import TrayPage from './pages/TrayPage';
import OrderTrackerPage from './pages/OrderTrackerPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';

export type Page = 'home' | 'menu' | 'admin' | 'tray' | 'tracker' | 'about' | 'support' | 'profile' | 'auth';

const AppContent: React.FC = () => {
  const [history, setHistory] = useState<Page[]>(['home']);
  const [pendingRedirect, setPendingRedirect] = useState<Page | null>(null);
  const { user, isAuthenticated } = useAuth();

  const currentPage = history[history.length - 1];

  const navigateTo = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Access Control: Menu is protected
    if (page === 'menu' && !isAuthenticated) {
      setPendingRedirect('menu');
      setHistory(prev => [...prev, 'auth']);
      return;
    }
    setHistory(prev => [...prev, page]);
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Auto-redirect logic after login
  useEffect(() => {
    if (isAuthenticated && pendingRedirect) {
      const target = pendingRedirect;
      setPendingRedirect(null);
      setHistory(prev => {
        const newHistory = [...prev];
        if (newHistory[newHistory.length - 1] === 'auth') {
          newHistory[newHistory.length - 1] = target;
        } else {
          newHistory.push(target);
        }
        return newHistory;
      });
    }
  }, [isAuthenticated, pendingRedirect]);

  const renderPage = () => {
    const pageKey = history.length;
    return (
      <div key={pageKey} className="page-transition min-h-[70vh]">
        {(() => {
          switch (currentPage) {
            case 'home': return <HomePage onNavigate={navigateTo} />;
            case 'menu': return <MenuPage onBack={goBack} />;
            case 'admin': return <AdminDashboard onBack={goBack} />;
            case 'tray': return <TrayPage onNavigate={navigateTo} onBack={goBack} />;
            case 'tracker': return <OrderTrackerPage onBack={goBack} />;
            case 'about': return <AboutPage onBack={goBack} />;
            case 'support': return <SupportPage onBack={goBack} />;
            case 'profile': return <ProfilePage onBack={goBack} />;
            case 'auth': return <AuthPage onBack={goBack} />;
            default: return <HomePage onNavigate={navigateTo} />;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-ino-dark transition-colors duration-300">
      <Navbar onNavigate={navigateTo} currentPage={currentPage} />
      <div className="flex-grow pt-0">
        {renderPage()}
      </div>
      <Footer onNavigate={navigateTo} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <MenuProvider>
            <OrderProvider>
              <AppContent />
            </OrderProvider>
          </MenuProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
