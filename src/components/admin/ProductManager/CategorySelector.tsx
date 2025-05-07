
import React from 'react';
import { Category } from '@/lib/supabase';
import { Label } from '@/components/ui/label';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">Category</Label>
      <select 
        className="w-full rounded-md border border-input bg-background px-3 py-2"
        value={selectedCategory || ''}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="" disabled>Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelector;
