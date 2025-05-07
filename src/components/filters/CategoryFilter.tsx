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
  
  // Load all categories and subcategories on initial mount
  useEffect(() => {
    const loadData = async () => {
      if (initialLoadComplete && userInteracting.current) {
        // Skip loading if user is interacting with checkboxes
        userInteracting.current = false;
        return;
      }
      
      setLoading(true);
      try {
        // Get all categories
        const cats = await getCategories();
        
        // Get subcategories for each category
        const categoriesData: CategoryWithSubs[] = [];
        
        for (const cat of cats) {
          try {
            const subs = await getSubcategories(cat.id);
            
            // Calculate if category should be expanded
            const hasSelectedSubcategories = subs.some(
              sub => selectedSubcategories.includes(sub.id)
            );
            
            categoriesData.push({
              ...cat,
              subcategories: subs,
              isExpanded: hasSelectedSubcategories || selectedCategories.includes(cat.id),
              isIndeterminate: false // Will be calculated in the next effect
            });
          } catch (error) {
            console.error(`Error loading subcategories for category ${cat.id}:`, error);
            categoriesData.push({
              ...cat,
              subcategories: [],
              isExpanded: false,
              isIndeterminate: false
            });
          }
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
  }, []); // Only run on mount
  
  // Update for selection changes without refetching from the server
  useEffect(() => {
    if (!initialLoadComplete) return;
    
    setCategoriesWithSubs(prevCats => 
      prevCats.map(cat => {
        if (cat.subcategories.length === 0) return cat;
        
        // Count selected subcategories for this category
        const selectedSubcatsCount = cat.subcategories.filter(
          sub => selectedSubcategories.includes(sub.id)
        ).length;
        
        // Category is indeterminate if some but not all subcategories are selected
        const isIndeterminate = 
          selectedSubcatsCount > 0 && 
          selectedSubcatsCount < cat.subcategories.length;
          
        // Category should be expanded if it or any of its subcategories are selected
        const isExpanded = 
          selectedCategories.includes(cat.id) || 
          cat.subcategories.some(sub => selectedSubcategories.includes(sub.id));
        
        return {
          ...cat,
          isIndeterminate,
          isExpanded: cat.isExpanded || isExpanded
        };
      })
    );
  }, [selectedCategories, selectedSubcategories, initialLoadComplete]);
  
  // Handle category checkbox change
  const handleCategoryChange = (category: CategoryWithSubs, isChecked: boolean) => {
    userInteracting.current = true;
    
    // 1. Update the parent category
    onCategoryChange(category.id, isChecked);
    
    // 2. Update all subcategories (select/deselect all)
    category.subcategories.forEach(sub => {
      const subId = sub.id;
      const isSubSelected = selectedSubcategories.includes(subId);
      
      // Only trigger change if needed
      if (isChecked !== isSubSelected) {
        onSubcategoryChange(subId, isChecked);
      }
    });
    
    // 3. Expand the category if it's being selected
    if (isChecked && !category.isExpanded) {
      setCategoriesWithSubs(prev => 
        prev.map(cat => 
          cat.id === category.id ? { ...cat, isExpanded: true } : cat
        )
      );
    }
  };
  
  // Handle subcategory checkbox change
  const handleSubcategoryChange = (category: CategoryWithSubs, subcategoryId: string, isChecked: boolean) => {
    userInteracting.current = true;
    
    // 1. Update the subcategory
    onSubcategoryChange(subcategoryId, isChecked);
    
    // 2. Check/uncheck the parent category if needed
    const isCategorySelected = selectedCategories.includes(category.id);
    
    if (isChecked) {
      // If all subcategories are now selected, select the parent category
      const allOtherSubsSelected = category.subcategories.every(sub => {
        if (sub.id === subcategoryId) return true; // This one is being selected
        return selectedSubcategories.includes(sub.id);
      });
      
      if (allOtherSubsSelected && !isCategorySelected) {
        onCategoryChange(category.id, true);
      }
    } else {
      // If unchecking a subcategory and the parent is selected, unselect parent
      if (isCategorySelected) {
        onCategoryChange(category.id, false);
      }
    }
  };
  
  // Handle accordion state change
  const handleExpand = (category: CategoryWithSubs, isExpanded: boolean) => {
    setCategoriesWithSubs(prev => 
      prev.map(cat => 
        cat.id === category.id ? { ...cat, isExpanded } : cat
      )
    );
  };
  
  // Get color for category based on its position in the array
  const getCategoryColor = (index: number): string => {
    const colors = [
      'bg-blue-100 border-blue-300 text-blue-800',
      'bg-green-100 border-green-300 text-green-800',
      'bg-purple-100 border-purple-300 text-purple-800',
      'bg-amber-100 border-amber-300 text-amber-800',
      'bg-rose-100 border-rose-300 text-rose-800',
      'bg-teal-100 border-teal-300 text-teal-800',
      'bg-indigo-100 border-indigo-300 text-indigo-800',
    ];
    return colors[index % colors.length];
  };
  
  if (loading && !initialLoadComplete) {
    return (
      <div className="space-y-2 p-3 bg-muted/30 rounded-lg flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-2">Loading categories...</p>
      </div>
    );
  }
  
  if (categoriesWithSubs.length === 0) {
    return (
      <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <Tag size={16} className="text-primary" />
          <Label className="text-sm font-medium">Categories</Label>
        </div>
        <div className="text-sm text-muted-foreground py-2 text-center">
          No categories available
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center space-x-2">
        <Tag size={16} className="text-primary" />
        <Label className="text-sm font-medium">Categories</Label>
      </div>
      
      <div className="space-y-2">
        {categoriesWithSubs.map((category, index) => {
          const isSelected = selectedCategories.includes(category.id);
          const hasSubcategories = category.subcategories.length > 0;
          const selectedSubsCount = category.subcategories.filter(
            sub => selectedSubcategories.includes(sub.id)
          ).length;
          
          // Visual class for the category box based on selection state
          const categoryBoxClass = isSelected
            ? getCategoryColor(index)
            : category.isIndeterminate
              ? 'bg-muted/50 border-muted-foreground/40'
              : 'border-muted-foreground/20';
              
          return (
            <div 
              key={category.id}
              className={`border rounded-md overflow-hidden transition-colors ${categoryBoxClass}`}
            >
              <div className="flex items-center p-3">
                <Checkbox 
                  id={`category-${category.id}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    handleCategoryChange(category, checked === true);
                  }}
                  data-state={category.isIndeterminate ? 'indeterminate' : isSelected ? 'checked' : 'unchecked'}
                  className="mr-2 data-[state=indeterminate]:bg-primary/50 data-[state=indeterminate]:text-primary-foreground"
                />
                
                <div 
                  className="flex-1 cursor-pointer flex items-center"
                  onClick={() => handleExpand(category, !category.isExpanded)}
                >
                  <Label 
                    htmlFor={`category-${category.id}`}
                    className={`flex-1 text-sm font-medium ${isSelected ? 'font-semibold' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {category.name}
                    {hasSubcategories && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({selectedSubsCount > 0 ? `${selectedSubsCount}/` : ''}
                        {category.subcategories.length})
                      </span>
                    )}
                  </Label>
                  
                  {hasSubcategories && (
                    <div className={`transition-transform duration-200 ${category.isExpanded ? 'rotate-180' : ''}`}>
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
              
              {/* Subcategories */}
              {hasSubcategories && category.isExpanded && (
                <div className="ml-6 space-y-1 py-2 pl-2 bg-background/40 rounded-b-md">
                  {category.subcategories.map(subcategory => {
                    const isSubSelected = selectedSubcategories.includes(subcategory.id);
                    return (
                      <div key={subcategory.id} className="flex items-center py-1">
                        <Checkbox 
                          id={`subcategory-${subcategory.id}`}
                          checked={isSubSelected}
                          onCheckedChange={(checked) => {
                            handleSubcategoryChange(category, subcategory.id, checked === true);
                          }}
                          className={`mr-2 ${isSubSelected ? 'text-primary' : ''}`}
                        />
                        <Label 
                          htmlFor={`subcategory-${subcategory.id}`}
                          className={`text-sm cursor-pointer ${isSubSelected ? 'font-medium' : ''}`}
                        >
                          {subcategory.name}
                        </Label>
                      </div>
                    );
                  })}
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