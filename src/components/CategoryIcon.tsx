
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/lib/supabase';
import { Card } from '@/components/ui/card';

interface CategoryIconProps {
  category: Category;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.id}`} className="flex flex-col items-center">
      <Card className="w-24 h-24 mb-2 flex items-center justify-center text-4xl hover:bg-slate-50 transition-colors">
        {category.icon}
      </Card>
      <p className="text-center font-medium">{category.name}</p>
    </Link>
  );
};

export default CategoryIcon;
