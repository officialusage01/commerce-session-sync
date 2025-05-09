
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, signOut, getCurrentUser, setupAdminUser } from '@/lib/supabase';
import { initializeDatabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const checkUser = async () => {
      setCheckingSession(true);
      try {
        const { data } = await getCurrentUser();
        if (data?.user) {
          navigate('/admin');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkUser();
    
    // Try to ensure tables are created
    initializeDatabase().catch(err => console.error('Database initialization error:', err));
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // First try to sign in
      const { data, error } = await signIn(email, password);
      
      if (error) {
        // If login fails and it's the demo account, try to create it
        if (email === 'admin@shopstory.com' && password === 'shopstory123') {
          toast({
            title: 'Creating admin account',
            description: 'First time login detected. Setting up admin account...',
          });
          
          // Try to create admin user and tables
          await initializeDatabase();
          
          // Setup admin user
          const setupResult = await setupAdminUser();
          
          if (!setupResult.success) {
            toast({
              title: 'Setup Failed',
              description: 'Could not create admin account. Please try again later.',
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }
          
          // Try logging in again
          const { data: newLoginData, error: newLoginError } = await signIn(email, password);
          
          if (newLoginError) {
            toast({
              title: 'Login Failed',
              description: newLoginError.message || 'Unknown error occurred',
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }
          
          if (newLoginData?.user) {
            toast({
              title: 'Setup Complete',
              description: 'Admin account created and logged in successfully.',
            });
            navigate('/admin');
            return;
          }
        } else {
          toast({
            title: 'Login Failed',
            description: error.message || 'Invalid email or password',
            variant: 'destructive',
          });
          console.error('Login error details:', error);
          setLoading(false);
          return;
        }
      }
      
      if (data?.user) {
        // Check if user has admin role in their metadata
        const userRole = data.user.user_metadata?.role;
        
        if (userRole !== 'admin') {
          toast({
            title: 'Access Denied',
            description: 'You do not have admin privileges.',
            variant: 'destructive',
          });
          await signOut();
          setLoading(false);
          return;
        }
        
        toast({
          title: 'Login Successful',
          description: 'You have been logged in successfully',
        });
        navigate('/admin');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: error?.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Checking authentication status...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
          <div className="mt-2 p-2 bg-primary/10 rounded-md text-sm">
            <strong>Demo Credentials:</strong><br />
            Email: admin@shopstory.com<br />
            Password: shopstory123
          </div>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@shopstory.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
