
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call to subscribe the user
      setIsLoading(false);
      setEmail('');
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
    }, 1000);
  };

  return (
    <div className="py-12 bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
      <div className="container px-4 max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="mb-6 text-purple-200">
              Subscribe to our newsletter to receive updates on new products, special offers, and exclusive discounts.
            </p>
          </div>
          
          <div className="lg:w-1/2">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-white text-black h-12 rounded-md"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-white text-purple-700 hover:bg-purple-100 h-12 px-6"
                disabled={isLoading}
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
