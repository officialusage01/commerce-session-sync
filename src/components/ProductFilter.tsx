
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CategoryFilter from '@/components/filters/CategoryFilter';
import PriceRangeSlider from '@/components/filters/PriceRangeSlider';
import StockFilter from '@/components/filters/StockFilter';
import SearchInput from '@/components/filters/SearchInput';
import FilterHeader from '@/components/filters/FilterHeader';
import { Separator } from '@/components/ui/separator';
import { FilterX, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';
import { FilterOptions } from '@/components/filters/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  children, 
  defaultOpen = false 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border last:border-0 py-2">
      <button 
        className="w-full flex justify-between items-center py-3 px-1 hover:text-primary transition-colors"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className="font-medium">{title}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 12 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface ProductFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
  className?: string;
  compact?: boolean;
  onClearFilters?: () => void;
}

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
  
  // Synchronize local state with initialFilters
  useEffect(() => {
    if (initialFilters) {
      setSearch(initialFilters.search || '');
      setPriceRange(initialFilters.priceRange || [minPrice, maxPrice]);
      setStockStatus(initialFilters.stockStatus || 'all');
      setSelectedCategories(initialFilters.categories || []);
      setSelectedSubcategories(initialFilters.subcategories || []);
    }
  }, [initialFilters, minPrice, maxPrice]);

  // Handle filter change and active filter count
  useEffect(() => {
    const count = [
      search.trim(),
      priceRange[0] > minPrice || priceRange[1] < maxPrice,
      stockStatus !== 'all',
      selectedCategories.length > 0,
      selectedSubcategories.length > 0,
    ].filter(Boolean).length;

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

  // Handlers for filter changes
  const handleSearchChange = useCallback(setSearch, []);
  const handlePriceRangeChange = useCallback(setPriceRange, []);
  const handleStockChange = useCallback(setStockStatus, []);
  const handleCategoryChange = useCallback((categoryId: string, isSelected: boolean) => {
    setSelectedCategories(prev => isSelected ? [...prev, categoryId] : prev.filter(id => id !== categoryId));
  }, []);
  const handleSubcategoryChange = useCallback((subcategoryId: string, isSelected: boolean) => {
    setSelectedSubcategories(prev => isSelected ? [...prev, subcategoryId] : prev.filter(id => id !== subcategoryId));
  }, []);

  const handleReset = () => {
    setSearch('');
    setPriceRange([minPrice, maxPrice]);
    setStockStatus('all');
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <Card className={`rounded-xl shadow-sm bg-white ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <FilterHeader 
          isOpen={isOpen}
          hasActiveFilters={activeFilters > 0}
          activeFilterCount={activeFilters}
          onReset={handleReset}
        />
        
        <CollapsibleContent className="transition-all duration-300 ease-in-out">
          <CardContent className="p-4 pt-2">
            <ScrollArea className={compact ? "max-h-[60vh]" : "max-h-[calc(100vh-200px)]"}>
              <div className="space-y-1">
                <FilterSection title="Search" defaultOpen={true}>
                  <SearchInput value={search} onChange={handleSearchChange} placeholder="Search products..." />
                </FilterSection>
                
                <FilterSection title="Price Range" defaultOpen={true}>
                  <PriceRangeSlider 
                    value={priceRange}
                    min={minPrice}
                    max={maxPrice}
                    onChange={handlePriceRangeChange}
                  />
                </FilterSection>
                
                <FilterSection title="Availability">
                  <StockFilter 
                    value={stockStatus} 
                    onChange={handleStockChange} 
                  />
                </FilterSection>
                
                <FilterSection title="Categories">
                  <CategoryFilter 
                    selectedCategories={selectedCategories}
                    selectedSubcategories={selectedSubcategories}
                    onCategoryChange={handleCategoryChange}
                    onSubcategoryChange={handleSubcategoryChange}
                  />
                </FilterSection>
              </div>
            </ScrollArea>

            {activeFilters > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pt-4 border-t flex justify-end"
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="text-xs flex items-center gap-1.5 text-gray-600 hover:text-gray-900"
                >
                  <FilterX className="h-4 w-4" /> Clear Filters
                </Button>
              </motion.div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ProductFilter;
