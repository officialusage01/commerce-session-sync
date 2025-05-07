
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui-components/Button';
import { Shield, Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for message in location state (e.g., from signup page)
    if (location.state?.message) {
      setMessage(location.state.message);
    }
    
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [location, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setForgotPasswordLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setShowForgotPassword(false);
      setMessage('Password reset email has been sent. Please check your inbox.');
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // If user is already logged in, don't show login form
  if (user) {
    return null; // Return early while redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="glass rounded-xl p-8 shadow-lg border border-border/40 animate-blur-in">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              {showForgotPassword ? 'Reset Password' : 'Sign in to your account'}
            </h2>
            {!showForgotPassword && (
              <p className="mt-2 text-sm text-muted-foreground">
                Or{' '}
                <Link to="/signup" className="font-medium text-primary hover:text-primary/90">
                  create a new account
                </Link>
              </p>
            )}
          </div>

          {message && (
            <div className="mb-4 p-3 rounded-md bg-green-50 text-green-600 text-sm animate-slide-in">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm animate-slide-in">
              {error}
            </div>
          )}

          {showForgotPassword ? (
            <form className="space-y-6" onSubmit={handleForgotPassword}>
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-foreground mb-1">
                  Email address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background"
                    placeholder="Your email"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={forgotPasswordLoading}
                >
                  Send reset instructions
                </Button>
                <Button
                  type="button"
                  className="w-full"
                  variant="outline"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to login
                </Button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background"
                    placeholder="Your email"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:text-primary/90 transition-colors"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background"
                    placeholder="Your password"
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Sign in
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
