
import React from 'react';
import { Category } from '@/lib/supabase';
import CategoryIcon from '@/components/CategoryIcon';
import { Loader2, ShoppingBag } from 'lucide-react';

interface CategoriesBrowserProps {
  categories: Category[] | undefined;
  isLoading: boolean;
}

const CategoriesBrowser: React.FC<CategoriesBrowserProps> = ({ categories, isLoading }) => {
  return (
    <div className="container px-4 py-16 max-w-screen-xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Browse All Categories
        </h2>
        <p className="text-slate-500 text-lg">Find products by category</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-8 justify-items-center">
          {categories.map((category) => (
            <CategoryIcon key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 rounded-lg">
          <ShoppingBag className="h-12 w-12 mx-auto text-slate-400 mb-4" />
          <p className="text-slate-500 mb-2">No categories found.</p>
          <p className="text-slate-400 text-sm">Please check back later or visit the admin dashboard to add categories.</p>
        </div>
      )}
    </div>
  );
};

export default CategoriesBrowser;
