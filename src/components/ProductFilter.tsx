
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CategoryFilter from '@/components/filters/CategoryFilter';
import PriceRangeSlider from '@/components/filters/PriceRangeSlider';
import StockFilter from '@/components/filters/StockFilter';
import SearchInput from '@/components/filters/SearchInput';
import FilterHeader from '@/components/filters/FilterHeader';
import { Separator } from '@/components/ui/separator';
import { FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';
import { FilterOptions } from '@/components/filters/types';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface ProductFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
  className?: string;
  compact?: boolean;
  onClearFilters?: () => void;
}

export type ProductFilters = FilterOptions;

const ProductFilter: React.FC<ProductFilterProps> = ({
  minPrice = 0,
  maxPrice = 10000,
  onFilterChange,
  initialFilters,
  className = '',
  compact = false,
  onClearFilters,
}) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(true);
  
  const [search, setSearch] = useState<string>(initialFilters?.search || '');
  const [priceRange, setPriceRange] = useState<[number, number]>(initialFilters?.priceRange || [minPrice, maxPrice]);
  const [stockStatus, setStockStatus] = useState<'all' | 'in-stock' | 'out-of-stock'>(initialFilters?.stockStatus || 'all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters?.categories || []);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(initialFilters?.subcategories || []);
  
  const [activeFilters, setActiveFilters] = useState<number>(0);
  
  useEffect(() => {
    let count = 0;
    if (search.trim()) count++;
    if (priceRange[0] > minPrice || priceRange[1] < maxPrice) count++;
    if (stockStatus !== 'all') count++;
    if (selectedCategories.length > 0) count++;
    if (selectedSubcategories.length > 0) count++;
    
    setActiveFilters(count);
    
    const timer = setTimeout(() => {
      onFilterChange({
        search,
        priceRange,
        stockStatus,
        categories: selectedCategories,
        subcategories: selectedSubcategories,
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, priceRange, stockStatus, selectedCategories, selectedSubcategories, minPrice, maxPrice, onFilterChange]);
  
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);
  
  const handlePriceRangeChange = useCallback((values: [number, number]) => {
    setPriceRange(values);
  }, []);
  
  const handleStockChange = useCallback((value: 'all' | 'in-stock' | 'out-of-stock') => {
    setStockStatus(value);
  }, []);
  
  const handleCategoryChange = useCallback((categoryId: string, isSelected: boolean) => {
    setSelectedCategories(prev => {
      if (isSelected) {
        return [...prev, categoryId];
      } else {
        return prev.filter(id => id !== categoryId);
      }
    });
  }, []);
  
  const handleSubcategoryChange = useCallback((subcategoryId: string, isSelected: boolean) => {
    setSelectedSubcategories(prev => {
      if (isSelected) {
        return [...prev, subcategoryId];
      } else {
        return prev.filter(id => id !== subcategoryId);
      }
    });
  }, []);

  const handleReset = () => {
    setSearch('');
    setPriceRange([minPrice, maxPrice]);
    setStockStatus('all');
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    
    // Call external reset function if provided
    if (onClearFilters) {
      onClearFilters();
    }
  };
  
  const containerClass = compact 
    ? `${className}`
    : `overflow-hidden ${className}`;

  const contentClass = compact
    ? "space-y-4"
    : "space-y-4 mt-4";
  
  const scrollAreaClass = compact
    ? "max-h-[60vh]"
    : "max-h-[calc(100vh-200px)]";
  
  return (
    <div className={containerClass}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        {!compact && (
          <FilterHeader 
            isOpen={isOpen}
            hasActiveFilters={activeFilters > 0}
            activeFilterCount={activeFilters}
            onReset={handleReset}
          />
        )}
        
        <CollapsibleContent className={contentClass} forceMount>
          <ScrollArea className={scrollAreaClass}>
            <div className="space-y-4 pr-3">
              <SearchInput value={search} onChange={handleSearchChange} />
              
              <Separator className="my-3" />
              
              <CategoryFilter 
                selectedCategories={selectedCategories}
                selectedSubcategories={selectedSubcategories}
                onCategoryChange={handleCategoryChange}
                onSubcategoryChange={handleSubcategoryChange}
              />
              
              <Separator className="my-3" />
              
              <PriceRangeSlider 
                value={priceRange}
                max={maxPrice}
                onChange={handlePriceRangeChange}
              />
              
              <Separator className="my-3" />
              
              <StockFilter 
                value={stockStatus} 
                onChange={handleStockChange} 
              />
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ProductFilter;
