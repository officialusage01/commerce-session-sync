
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import NavItems, { AuthButtons } from './NavItems';

const DesktopNav: React.FC = () => {
  return (
    <div className="hidden md:flex items-center justify-between w-full">
      <div className="flex items-center">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-xl font-semibold text-primary"
        >
          <Shield className="h-6 w-6" />
          <span>Auth Fortress</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <NavItems />
        <AuthButtons />
      </div>
    </div>
  );
};

export default DesktopNav;
