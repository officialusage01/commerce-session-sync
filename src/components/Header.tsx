
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, Home, Phone, Moon, Sun } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from './ui/button';
import { useTheme } from '@/hooks/use-theme';
import './header-styles.css';

const Header = () => {
  const { totalItems } = useCart();
  const isMobile = useIsMobile();

  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="font-bold text-2xl">
          E-Commerce
        </Link>

        {isMobile ? (
          <MobileNav totalItems={totalItems} />
        ) : (
          <DesktopNav totalItems={totalItems} />
        )}
      </div>
    </header>
  );
};

interface MobileNavProps {
  totalItems: number;
}

const MobileNav: React.FC<MobileNavProps> = ({ totalItems }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center space-x-4">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
      <Link to="/search">
        <Search className="h-5 w-5" />
      </Link>
      <Link to="/cart" className="relative">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full px-1 text-xs">
            {totalItems}
          </span>
        )}
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Explore our site.
            </SheetDescription>
          </SheetHeader>
          <nav className="grid gap-4 py-4">
            <NavLink to="/" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/search" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </NavLink>
            <NavLink to="/contact" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Contact</span>
            </NavLink>
            <NavLink to="/profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

interface DesktopNavProps {
  totalItems: number;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ totalItems }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="flex items-center space-x-6">
      <NavLink to="/" className="flex items-center space-x-2 hover:text-primary transition-colors">
        <Home className="h-4 w-4 desktop-tab-icon" />
        <span className="desktop-only-text">Home</span>
      </NavLink>
      <NavLink to="/search" className="flex items-center space-x-2 hover:text-primary transition-colors">
        <Search className="h-4 w-4 desktop-tab-icon" />
        <span className="desktop-only-text">Search</span>
      </NavLink>
      <NavLink to="/contact" className="flex items-center space-x-2 hover:text-primary transition-colors">
        <Phone className="h-4 w-4 desktop-tab-icon" />
        <span className="desktop-only-text">Contact</span>
      </NavLink>
      <NavLink to="/profile" className="flex items-center space-x-2 hover:text-primary transition-colors">
        <User className="h-4 w-4 desktop-tab-icon" />
        <span className="desktop-only-text">Profile</span>
      </NavLink>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="hover:text-primary transition-colors"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
      <Link to="/cart" className="relative hover:text-primary transition-colors">
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full px-1 text-xs">
            {totalItems}
          </span>
        )}
      </Link>
    </nav>
  );
};

export default Header;
