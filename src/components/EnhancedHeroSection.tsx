import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, ArrowRight, ChevronRight } from 'lucide-react';

const EnhancedHeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 pb-32">
      {/* Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-70"></div>
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-secondary/5 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-32 right-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-70"></div>
      
      {/* Small animated decorations */}
      <div className="hidden lg:block absolute top-20 left-16 w-6 h-6 rounded-full bg-primary/30 animate-float"></div>
      <div className="hidden lg:block absolute top-40 right-32 w-4 h-4 rounded-full bg-secondary/30 animate-float delay-300"></div>
      <div className="hidden lg:block absolute bottom-20 left-1/2 w-8 h-8 rounded-full bg-primary/20 animate-float delay-500"></div>
      
      <div className="container px-4 max-w-screen-xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Hero Text Content */}
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="animate-pulse-slow mr-2">✨</span>
              <span>Welcome to our refreshed shopping experience</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block animate-slide-up">Discover Amazing</span>
              <span className="block animate-slide-up delay-200 gradient-text">Products for Every Need</span>
            </h1>
            
            <p className="text-muted-foreground mb-8 text-lg max-w-xl animate-slide-up delay-300">
              Shop our extensive collection of high-quality products at competitive prices.
              Our refreshed interface makes finding what you need easier than ever before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-400">
              <Link 
                to="/search" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover-lift"
              >
                <Search className="h-5 w-5" />
                Search Products
              </Link>
              
              <Link 
                to="/category/1" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-primary/20 bg-white text-primary font-medium hover-lift"
              >
                Browse Categories
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            
            <div className="mt-10 flex items-center text-sm text-muted-foreground animate-slide-up delay-500">
              <div className="flex -space-x-2 mr-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">+1k</div>
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-primary text-xs">+5k</div>
                <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center text-primary text-xs">+10k</div>
              </div>
              <span>Customers trust our products globally</span>
            </div>
          </div>
          
          {/* Hero Image Content */}
          <div className="lg:w-1/2 relative animate-fade-in">
            {/* Image frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/5 animate-float">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 mix-blend-overlay"></div>
              <img 
                src="/public/lovable-uploads/2bd035f2-a08c-4231-8e2d-da5602bf035b.png" 
                alt="Shop products" 
                className="w-full object-cover"
              />
              
              {/* Floating card elements */}
              <div className="absolute -left-6 top-10 glass-card p-3 rounded-lg shadow-lg flex items-center gap-3 animate-float delay-200">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Latest arrivals</div>
                  <div className="text-sm font-medium">New collection</div>
                </div>
              </div>
              
              <div className="absolute -right-6 bottom-12 glass-card p-3 rounded-lg shadow-lg max-w-[180px] animate-float delay-400">
                <div className="flex items-center text-xs text-muted-foreground mb-1">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-1"></span>
                  <span>Special offer</span>
                </div>
                <div className="text-sm font-medium">Up to 40% off on selected items</div>
              </div>
            </div>
            
            {/* Stats display */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border border-muted animate-slide-up delay-300">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2">
                  <div className="text-2xl font-bold gradient-text">2k+</div>
                  <div className="text-xs text-muted-foreground">Products</div>
                </div>
                <div className="text-center p-2">
                  <div className="text-2xl font-bold gradient-text">24h</div>
                  <div className="text-xs text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom wave pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI0MHB4IiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyODAgMEw2NDAgNzAgMCAwdjE0MGgxMjgwVjB6IiBmaWxsLW9wYWNpdHk9Ii41Ii8+PHBhdGggZD0iTTEyODAgMGwtNjQwIDcwLTY0MC03MHY3MGgxMjgwVjB6Ii8+PC9nPjwvc3ZnPg==')]"></div>
      </div>
    </div>
  );
};

export default EnhancedHeroSection;