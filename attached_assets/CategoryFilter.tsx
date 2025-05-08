import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getCategories, getSubcategories } from '@/lib/supabase';
import { Category, Subcategory } from '@/lib/supabase/types';
import { Tag, Loader2 } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategories: string[];
  selectedSubcategories: string[];
  onCategoryChange: (categoryId: string, isSelected: boolean) => void;
  onSubcategoryChange: (subcategoryId: string, isSelected: boolean) => void;
}

type CategoryWithSubs = Category & {
  subcategories: Subcategory[];
  isExpanded: boolean;
  isIndeterminate: boolean;
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategories,
  selectedSubcategories,
  onCategoryChange,
  onSubcategoryChange
}) => {
  const [categoriesWithSubs, setCategoriesWithSubs] = useState<CategoryWithSubs[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const userInteracting = useRef(false);

  // Load all categories and their subcategories on initial mount
  useEffect(() => {
    const loadData = async () => {
      if (initialLoadComplete && userInteracting.current) return;
      
      setLoading(true);
      try {
        const cats = await getCategories();
        const categoriesData: CategoryWithSubs[] = [];
        
        for (const cat of cats) {
          const subs = await getSubcategories(cat.id);
          const hasSelectedSubcategories = subs.some(sub => selectedSubcategories.includes(sub.id));
          categoriesData.push({
            ...cat,
            subcategories: subs,
            isExpanded: hasSelectedSubcategories || selectedCategories.includes(cat.id),
            isIndeterminate: false
          });
        }

        setCategoriesWithSubs(categoriesData);
        setInitialLoadComplete(true);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); 

  // Update for selection changes without refetching from the server
  useEffect(() => {
    if (!initialLoadComplete) return;

    setCategoriesWithSubs(prevCats => prevCats.map(cat => {
      if (cat.subcategories.length === 0) return cat;

      const selectedSubcatsCount = cat.subcategories.filter(sub => selectedSubcategories.includes(sub.id)).length;
      const isIndeterminate = selectedSubcatsCount > 0 && selectedSubcatsCount < cat.subcategories.length;
      const isExpanded = selectedCategories.includes(cat.id) || cat.subcategories.some(sub => selectedSubcategories.includes(sub.id));

      return {
        ...cat,
        isIndeterminate,
        isExpanded: cat.isExpanded || isExpanded
      };
    }));
  }, [selectedCategories, selectedSubcategories, initialLoadComplete]);
  
  // Handle category checkbox change
  const handleCategoryChange = (category: CategoryWithSubs, isChecked: boolean) => {
    userInteracting.current = true;
    onCategoryChange(category.id, isChecked);

    category.subcategories.forEach(sub => {
      const subId = sub.id;
      const isSubSelected = selectedSubcategories.includes(subId);
      if (isChecked !== isSubSelected) {
        onSubcategoryChange(subId, isChecked);
      }
    });

    if (isChecked && !category.isExpanded) {
      setCategoriesWithSubs(prev => prev.map(cat => cat.id === category.id ? { ...cat, isExpanded: true } : cat));
    }
  };
  
  // Handle subcategory checkbox change
  const handleSubcategoryChange = (category: CategoryWithSubs, subcategoryId: string, isChecked: boolean) => {
    userInteracting.current = true;
    onSubcategoryChange(subcategoryId, isChecked);

    const isCategorySelected = selectedCategories.includes(category.id);
    if (isChecked) {
      const allOtherSubsSelected = category.subcategories.every(sub => {
        if (sub.id === subcategoryId) return true;
        return selectedSubcategories.includes(sub.id);
      });

      if (allOtherSubsSelected && !isCategorySelected) {
        onCategoryChange(category.id, true);
      }
    } else {
      if (isCategorySelected) {
        onCategoryChange(category.id, false);
      }
    }
  };

  // Handle accordion state change
  const handleExpand = (category: CategoryWithSubs, isExpanded: boolean) => {
    setCategoriesWithSubs(prev => prev.map(cat => cat.id === category.id ? { ...cat, isExpanded } : cat));
  };

  if (loading && !initialLoadComplete) {
    return (
      <div className="space-y-2 p-3 bg-gray-200 rounded-lg flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm text-gray-600 mt-2">Loading categories...</p>
      </div>
    );
  }
  
  if (categoriesWithSubs.length === 0) {
    return (
      <div className="space-y-3 p-4 bg-gray-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Tag size={16} className="text-blue-500" />
          <Label className="text-sm font-medium">Categories</Label>
        </div>
        <div className="text-sm text-gray-600 py-2 text-center">No categories available</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        <Tag size={16} className="text-blue-500" />
        <Label className="text-lg font-medium">Categories</Label>
      </div>
      
      <div className="space-y-2">
        {categoriesWithSubs.map((category, index) => {
          const hasSubcategories = category.subcategories.length > 0;
          const selectedSubsCount = category.subcategories.filter(sub => selectedSubcategories.includes(sub.id)).length;
          const categoryBoxClass = selectedCategories.includes(category.id) ? 'bg-blue-50 border-blue-300' : category.isIndeterminate ? 'bg-yellow-50 border-yellow-300' : 'border-gray-200';

          return (
            <div key={category.id} className={`border rounded-md overflow-hidden transition-colors ${categoryBoxClass}`}>
              <div className="flex items-center p-3">
                <Checkbox 
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked===true)}
                  data-state={category.isIndeterminate ? 'indeterminate' : selectedCategories.includes(category.id) ? 'checked' : 'unchecked'}
                  className="mr-2"
                />
                <div className="flex-1 cursor-pointer flex items-center" onClick={() => handleExpand(category, !category.isExpanded)}>
                  <Label htmlFor={`category-${category.id}`} className={`flex-1 text-sm font-medium ${selectedCategories.includes(category.id) ? 'font-semibold text-blue-800' : ''}`}>
                    {category.name}
                    {hasSubcategories && (
                      <span className="ml-2 text-xs text-gray-600">({selectedSubsCount > 0 ? `${selectedSubsCount}/` : ''}{category.subcategories.length})</span>
                    )}
                  </Label>
                  {hasSubcategories && (
                    <div className={`ml-2 transition-transform duration-200 ${category.isExpanded ? 'rotate-180' : ''}`}>
                      <svg width="10" height="6" xmlns="http://www.w3.org/2000/svg">
                        <path 
                          d="M1 1L5 5L9 1" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              {hasSubcategories && category.isExpanded && (
                <div className="ml-6 space-y-1 py-2 pl-2 bg-gray-100 rounded-b-md">
                  {category.subcategories.map(subcategory => (
                    <div key={subcategory.id} className="flex items-center py-1">
                      <Checkbox 
                        id={`subcategory-${subcategory.id}`}
                        checked={selectedSubcategories.includes(subcategory.id)}
                        onCheckedChange={(checked) => handleSubcategoryChange(category, subcategory.id, checked===true)}
                        className="mr-2"
                      />
                      <Label htmlFor={`subcategory-${subcategory.id}`} className={`text-sm cursor-pointer ${selectedSubcategories.includes(subcategory.id) ? 'font-medium text-blue-700' : ''}`}>
                        {subcategory.name}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter; 