import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, User, Moon, Sun, Search, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCurrentUser, signOut } from '@/lib/supabase';
import { useCart } from '@/lib/cart';

const Header: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  
  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await getCurrentUser();
      setIsAdmin(!!data.user);
    };
    
    checkAdmin();
  }, []);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  const handleSignOut = async () => {
    await signOut();
    setIsAdmin(false);
    navigate('/');
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="font-bold text-xl flex items-center">
            <ShoppingBag className="h-5 w-5 mr-1" />
            <span>ShopStory</span>
          </Link>
          
          {!isMobile && (
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/" className="font-medium transition-colors hover:text-primary">
                Home
              </Link>
              <Link to="/search" className="font-medium transition-colors hover:text-primary">
                Search
              </Link>
              <Link to="/contact" className="font-medium transition-colors hover:text-primary">
                Contact
              </Link>
              {isAdmin && (
                <Link to="/admin" className="font-medium transition-colors hover:text-primary">
                  Admin
                </Link>
              )}
            </nav>
          )}
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button variant="ghost" size="icon" asChild>
              <Link to="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="ghost" size="icon" asChild>
              <Link to="/cart" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {totalItems || 0}
                </span>
              </Link>
            </Button>
            
            <Button variant="ghost" size="icon" asChild>
              <Link to="/contact">
                <Mail className="h-5 w-5" />
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/login">Sign In</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="flex flex-col gap-4 mt-8">
                    <Link to="/" className="px-2 py-1 hover:bg-secondary rounded-md">
                      Home
                    </Link>
                    <Link to="/search" className="px-2 py-1 hover:bg-secondary rounded-md">
                      Search
                    </Link>
                    <Link to="/contact" className="px-2 py-1 hover:bg-secondary rounded-md">
                      Contact
                    </Link>
                    <Link to="/cart" className="px-2 py-1 hover:bg-secondary rounded-md">
                      Cart {totalItems > 0 && `(${totalItems})`}
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="px-2 py-1 hover:bg-secondary rounded-md">
                        Admin
                      </Link>
                    )}
                    {isAdmin ? (
                      <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                    ) : (
                      <Button asChild>
                        <Link to="/login">Sign In</Link>
                      </Button>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;