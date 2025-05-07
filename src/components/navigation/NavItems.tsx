
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const NavItems: React.FC<{
  onItemClick?: () => void;
  linkClasses?: string;
  activeLinkClasses?: string;
}> = ({ 
  onItemClick, 
  linkClasses = "px-3 py-2 text-sm font-medium rounded-md",
  activeLinkClasses = "bg-accent text-accent-foreground" 
}) => {
  const { user, isAdmin } = useAuthState();
  
  const getLinkClasses = (isActive: boolean) => 
    `${linkClasses} ${isActive ? activeLinkClasses : 'hover:bg-accent/50'}`;

  return (
    <>
      <NavLink
        to="/"
        className={({ isActive }) => getLinkClasses(isActive)}
        onClick={onItemClick}
      >
        Home
      </NavLink>
      
      {/* Performance link - added for all users */}
      <NavLink
        to="/performance"
        className={({ isActive }) => getLinkClasses(isActive)}
        onClick={onItemClick}
      >
        Performance
      </NavLink>

      {user && (
        <NavLink
          to="/dashboard"
          className={({ isActive }) => getLinkClasses(isActive)}
          onClick={onItemClick}
        >
          Dashboard
        </NavLink>
      )}

      {isAdmin && (
        <>
          <NavLink
            to="/admin"
            className={({ isActive }) => getLinkClasses(isActive)}
            onClick={onItemClick}
          >
            Admin
          </NavLink>
          
          <NavLink
            to="/stock-analysis"
            className={({ isActive }) => getLinkClasses(isActive)}
            onClick={onItemClick}
          >
            Stock Analysis
          </NavLink>
        </>
      )}

      {user && (
        <NavLink
          to="/user"
          className={({ isActive }) => getLinkClasses(isActive)}
          onClick={onItemClick}
        >
          Profile
        </NavLink>
      )}
    </>
  );
};

export const AuthButtons: React.FC<{
  onItemClick?: () => void;
  signOutClassName?: string;
}> = ({ 
  onItemClick,
  signOutClassName = "px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50" 
}) => {
  const { user } = useAuthState();
  const { signOut } = useAuthActions();

  const handleSignOut = async () => {
    await signOut();
    if (onItemClick) onItemClick();
  };

  return (
    <div className="flex items-center gap-2">
      {!user ? (
        <>
          <Link 
            to="/login" 
            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent/50"
            onClick={onItemClick}
          >
            Log in
          </Link>
          <Link 
            to="/signup" 
            className="px-3 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onItemClick}
          >
            Sign up
          </Link>
        </>
      ) : (
        <Button
          variant="ghost"
          className={signOutClassName}
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      )}
    </div>
  );
};

export default NavItems;
