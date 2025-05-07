
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Shield, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import NavItems, { AuthButtons } from './NavItems';

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden w-full">
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-semibold text-primary"
        >
          <Shield className="h-6 w-6" />
          <span>Auth Fortress</span>
        </Link>

        <button
          onClick={toggleMenu}
          className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-secondary transition-colors"
          aria-expanded={isOpen ? "true" : "false"}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="glass animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-secondary"
              onClick={closeMenu}
            >
              Home
            </Link>
            <NavItems 
              onItemClick={closeMenu}
              linkClasses="block px-3 py-2 rounded-md text-base font-medium"
              activeLinkClasses="bg-primary/10 text-primary"
            />
            <AuthButtons 
              onItemClick={closeMenu}
              signOutClassName="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
