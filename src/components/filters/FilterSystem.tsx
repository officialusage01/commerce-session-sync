import React, { useState, useEffect } from 'react';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter, SlidersHorizontal } from 'lucide-react';

import { FilterOptions } from '@/lib/supabase/types';
import { getActiveFilterCount } from '@/lib/utils';
import FilterHeader from './FilterHeader';
import SearchInput from './SearchInput';
import PriceRangeSlider from './PriceRangeSlider';
import StockFilter from './StockFilter';
import CategoryFilter from './CategoryFilter';
import AppliedFilters from './AppliedFilters';
import MobileFilterDrawer from './MobileFilterDrawer';

interface FilterSystemProps {
  filters: FilterOptions;
  onFiltersChange: (newFilters: Partial<FilterOptions>) => void;
  defaultPriceRange?: [number, number];
  className?: string;
}

const FilterSystem: React.FC<FilterSystemProps> = ({
  filters,
  onFiltersChange,
  defaultPriceRange = [0, 50000],
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const hasActiveFilters = getActiveFilterCount(filters, defaultPriceRange) > 0;
  const activeFilterCount = getActiveFilterCount(filters, defaultPriceRange);

  // Track scroll position for mobile filter button animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Event handlers
  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value });
  };

  const handlePriceChange = (value: [number, number]) => {
    onFiltersChange({ priceRange: value });
  };

  const handleStockChange = (value: 'all' | 'in-stock' | 'out-of-stock') => {
    onFiltersChange({ stockStatus: value });
  };

  const handleCategoryChange = (categoryId: string, isSelected: boolean) => {
    const updatedCategories = isSelected
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId);
    
    onFiltersChange({ categories: updatedCategories });
  };

  const handleSubcategoryChange = (subcategoryId: string, isSelected: boolean) => {
    const updatedSubcategories = isSelected
      ? [...filters.subcategories, subcategoryId]
      : filters.subcategories.filter(id => id !== subcategoryId);
    
    onFiltersChange({ subcategories: updatedSubcategories });
  };

  const handleResetFilters = () => {
    onFiltersChange({
      search: '',
      priceRange: defaultPriceRange,
      stockStatus: 'all',
      categories: [],
      subcategories: []
    });
  };

  const handleRemoveCategory = (categoryId: string) => {
    onFiltersChange({ 
      categories: filters.categories.filter(id => id !== categoryId) 
    });
  };

  const handleRemoveSubcategory = (subcategoryId: string) => {
    onFiltersChange({ 
      subcategories: filters.subcategories.filter(id => id !== subcategoryId) 
    });
  };

  const handleRemoveStockFilter = () => {
    onFiltersChange({ stockStatus: 'all' });
  };

  const handleResetPriceRange = () => {
    onFiltersChange({ priceRange: defaultPriceRange });
  };

  const handleRemoveSearch = () => {
    onFiltersChange({ search: '' });
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        <Collapsible 
          open={isOpen} 
          onOpenChange={setIsOpen}
        >
          <motion.div 
            layout
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all"
          >
            <FilterHeader 
              isOpen={isOpen} 
              hasActiveFilters={hasActiveFilters}
              activeFilterCount={activeFilterCount}
              onReset={handleResetFilters}
            />
            
            <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-in-out">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-4 space-y-1"
              >
                <SearchInput 
                  value={filters.search}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                />
                
                <PriceRangeSlider 
                  value={filters.priceRange}
                  min={defaultPriceRange[0]}
                  max={defaultPriceRange[1]}
                  onChange={handlePriceChange}
                />
                
                <StockFilter 
                  value={filters.stockStatus}
                  onChange={handleStockChange}
                />
                
                <CategoryFilter 
                  selectedCategories={filters.categories}
                  selectedSubcategories={filters.subcategories}
                  onCategoryChange={handleCategoryChange}
                  onSubcategoryChange={handleSubcategoryChange}
                />
              </motion.div>
            </CollapsibleContent>
          </motion.div>
        </Collapsible>
        
        {/* Applied Filters (Desktop) */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hidden md:block overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <div className="bg-blue-50 p-1 rounded-md mr-1.5 text-blue-600">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </div>
                  Active Filters
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                </h4>
                {activeFilterCount > 2 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <AppliedFilters 
                filters={filters}
                defaultPriceRange={defaultPriceRange}
                onRemoveCategory={handleRemoveCategory}
                onRemoveSubcategory={handleRemoveSubcategory}
                onRemoveStockFilter={handleRemoveStockFilter}
                onResetPriceRange={handleResetPriceRange}
                onRemoveSearch={handleRemoveSearch}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Mobile Filter Button */}
      <AnimatePresence>
        <motion.div 
          className="fixed bottom-4 right-4 md:hidden z-30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: isScrolled ? -10 : 0
          }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center bg-primary text-white rounded-full shadow-lg w-14 h-14 hover:bg-primary/90 transition-colors"
            onClick={() => setMobileFilterOpen(true)}
          >
            <Filter className="h-5 w-5" />
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.span 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-1 bg-white text-primary text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-primary shadow-sm"
                >
                  {activeFilterCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </AnimatePresence>
      
      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer 
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        defaultPriceRange={defaultPriceRange}
        onFiltersChange={onFiltersChange}
        onResetFilters={handleResetFilters}
      />
      
      {/* Mobile Applied Filters */}
      <div className="md:hidden overflow-x-auto pt-2 pb-3 px-4 -mx-4">
        <AppliedFilters 
          filters={filters}
          defaultPriceRange={defaultPriceRange}
          onRemoveCategory={handleRemoveCategory}
          onRemoveSubcategory={handleRemoveSubcategory}
          onRemoveStockFilter={handleRemoveStockFilter}
          onResetPriceRange={handleResetPriceRange}
          onRemoveSearch={handleRemoveSearch}
          className="flex flex-nowrap pb-1"
        />
      </div>
    </>
  );
};

export default FilterSystem;
