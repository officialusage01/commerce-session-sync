
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from './LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAdmin = false,
  requireAuth = true
}) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [timeoutDuration] = useState(3000); // Reduced timeout to 3 seconds

  // Force debugging in console
  useEffect(() => {
    console.log("AUTH GUARD MOUNT - User:", user?.id, "isAdmin:", isAdmin, 
      "requireAdmin:", requireAdmin, "requireAuth:", requireAuth,
      "Current path:", location.pathname);
  }, []);

  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log("Auth guard still loading after timeout");
        setLoadingTimeout(true);
      }
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [isLoading, timeoutDuration]);

  // Log the current state for debugging
  useEffect(() => {
    console.log("AuthGuard state:", { 
      isLoading, 
      loadingTimeout, 
      user: user?.id, 
      isAdmin, 
      path: location.pathname,
      email: user?.email,
    });
  }, [isLoading, loadingTimeout, user, isAdmin, location.pathname]);

  // Special case for testad1@mailinator.com
  const forceAdminForTestUser = user?.email === 'testad1@mailinator.com';
  const effectiveIsAdmin = isAdmin || forceAdminForTestUser;
  
  if (forceAdminForTestUser && !isAdmin) {
    console.log("Forcing admin access for testad1@mailinator.com");
  }

  // If loading timed out, we'll proceed with null user to avoid getting stuck
  if (isLoading && !loadingTimeout) {
    return <LoadingScreen />;
  }

  // If auth is required and user is not logged in, redirect to login
  if (requireAuth && !user) {
    console.log("Auth required but no user, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If admin is required and user is not admin, redirect to dashboard
  if (requireAdmin && !effectiveIsAdmin) {
    console.log("Admin required but user is not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  // If user is authenticated but tries to access login/signup pages, redirect to dashboard
  if (user && ['/login', '/signup'].includes(location.pathname)) {
    console.log("User already logged in, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
