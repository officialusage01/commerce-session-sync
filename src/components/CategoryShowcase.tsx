
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Category, getCategories } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const CategoryShowcase: React.FC = () => {
  const { data: categories } = useQuery({
    queryKey: ['categoriesShowcase'],
    queryFn: getCategories
  });

  if (!categories || categories.length < 3) {
    return null;
  }

  // Take only first 3 categories for showcase
  const showcaseCategories = categories.slice(0, 3);
  
  return (
    <div className="py-16 bg-white">
      <div className="container px-4 max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Shop by Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {showcaseCategories.map((category) => (
            <div key={category.id} className="group relative overflow-hidden rounded-lg">
              {/* Background Color Block */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Content */}
              <div className="relative p-8 flex flex-col items-center text-center text-white h-64 justify-center">
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="mb-4 opacity-80">Explore our selection of {category.name.toLowerCase()} products</p>
                <Button asChild variant="outline" className="bg-white text-purple-700 hover:bg-purple-50">
                  <Link to={`/category/${category.id}`}>
                    View Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;
