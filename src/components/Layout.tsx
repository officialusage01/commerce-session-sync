
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { CartProvider } from '@/lib/cart'; // Updated import path
import { CartDrawer } from './CartDrawer';
import { CartDropdown } from './CartDropdown';

const Layout: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Set viewport meta tag for better mobile experience
  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }, []);
  
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        {isMobile ? <CartDrawer /> : <CartDropdown />}
        <main className={`flex-1 ${isMobile ? 'pt-14' : ''}`}>
          <Outlet />
        </main>
      </div>
    </CartProvider>
  );
};

export default Layout;
