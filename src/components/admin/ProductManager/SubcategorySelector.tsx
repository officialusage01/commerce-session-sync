
import React from 'react';
import { Subcategory } from '@/lib/supabase';
import { Label } from '@/components/ui/label';

interface SubcategorySelectorProps {
  subcategories: Subcategory[];
  selectedSubcategory: string | null;
  onSubcategoryChange: (subcategoryId: string) => void;
  disabled: boolean;
}

const SubcategorySelector: React.FC<SubcategorySelectorProps> = ({
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
  disabled
}) => {
  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">Subcategory</Label>
      <select 
        className="w-full rounded-md border border-input bg-background px-3 py-2"
        value={selectedSubcategory || ''}
        onChange={(e) => onSubcategoryChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>Select a subcategory</option>
        {subcategories.map((subcategory) => (
          <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
        ))}
      </select>
    </div>
  );
};

export default SubcategorySelector;
