
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, getCurrentUser, initializeDatabase, signOut } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase/client';

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
        if (data.user) {
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
    initializeDatabase();
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
      const { data, error } = await signIn(email, password);
      
      if (error) {
        // If login fails and it's the demo account, try to create it
        if (email === 'admin@shopstory.com' && password === 'shopstory123') {
          // Try to create admin user and tables
          await initializeDatabase();
          
          // Wait a bit for tables to be created
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Try to create admin user using admin client
          const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.signUp({
            email: 'admin@shopstory.com',
            password: 'shopstory123',
            options: {
              data: { role: 'admin' }
            }
          });
          
          if (signUpError) {
            toast({
              title: 'Setup Failed',
              description: 'Could not create admin account. Please try again later.',
              variant: 'destructive',
            });
            return;
          }
          
          if (signUpData.user) {
            toast({
              title: 'Setup Complete',
              description: 'Admin account created. Please try logging in again.',
            });
            return;
          }
        }
        
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        console.error('Login error details:', error);
      } else if (data.user) {
        // Check if user has admin role in their metadata
        const userRole = data.user.user_metadata?.role;
        
        if (userRole !== 'admin') {
          toast({
            title: 'Access Denied',
            description: 'You do not have admin privileges.',
            variant: 'destructive',
          });
          await signOut();
          return;
        }
        
        toast({
          title: 'Login Successful',
          description: 'You have been logged in successfully',
        });
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
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
