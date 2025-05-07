
import { useState } from 'react';
import { 
  signIn as supabaseSignIn, 
  signUp as supabaseSignUp, 
  signOut as supabaseSignOut 
} from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export function useAuthActions() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseSignUp(email, password);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Success",
        description: 'Account created successfully! Please check your email for verification.'
      });
      return { data };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabaseSignIn(email, password);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Success",
        description: 'Logged in successfully!'
      });
      return { data };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    // Prevent multiple signOut calls
    if (isSigningOut) {
      console.log('Already signing out, ignoring duplicate request');
      return;
    }
    
    try {
      setIsSigningOut(true);
      setIsLoading(true);
      
      const { error } = await supabaseSignOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive"
        });
        
        // Force reset auth state after failed signout
        window.location.href = '/login';
        return;
      }
      
      toast({
        title: "Success",
        description: 'Logged out successfully'
      });
    } catch (error: any) {
      console.error('Unexpected sign out error:', error);
      toast({
        title: "Error",
        description: 'Unexpected error signing out',
        variant: "destructive"
      });
      
      // Force page refresh on error to reset state
      window.location.href = '/login';
    } finally {
      setIsLoading(false);
      setIsSigningOut(false);
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    authLoading: isLoading || isSigningOut
  };
}
