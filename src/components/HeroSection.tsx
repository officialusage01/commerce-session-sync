
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 pt-12 pb-24">
      <div className="container px-4 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Discover Amazing Products for Every Need
            </h1>
            <p className="text-slate-600 mb-8 text-lg">
              Shop our extensive collection of high-quality products at competitive prices. 
              Find exactly what you're looking for with our easy-to-use search.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Search Products
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/category/1">
                  Browse Categories
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply opacity-70 animate-pulse"></div>
              <img 
                src="/public/lovable-uploads/2bd035f2-a08c-4231-8e2d-da5602bf035b.png" 
                alt="Shop products" 
                className="relative rounded-lg shadow-xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
