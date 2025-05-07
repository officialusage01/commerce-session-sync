
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui-components/Button';
import { Shield, Mail, Lock, User } from 'lucide-react';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validatePassword = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validatePassword()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      navigate('/login', { state: { message: 'Account created successfully! Please check your email for verification.' } });
    } catch (error: any) {
      setError(error.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, don't show signup form
  if (user) {
    return null; // Return early while redirecting
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="glass rounded-xl p-8 shadow-lg border border-border/40 animate-blur-in">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-primary/10 flex items-center justify-center rounded-full">
              <User className="h-8 w-8 text-primary" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-foreground">Create your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Or{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                sign in to existing account
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-600 text-sm animate-slide-in">
              {error}
            </div>
          )}

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
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background"
                  placeholder="Create password"
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                Confirm Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-background"
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </div>
          </form>

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

export default SignUp;
