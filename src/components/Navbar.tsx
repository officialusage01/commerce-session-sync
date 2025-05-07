
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopNav from './navigation/DesktopNav';
import MobileNav from './navigation/MobileNav';

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-border/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {isMobile ? <MobileNav /> : <DesktopNav />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
