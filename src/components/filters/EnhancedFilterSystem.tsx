import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';

import EnhancedSearchInput from './EnhancedSearchInput';
import EnhancedPriceRangeSlider from './EnhancedPriceRangeSlider';
import EnhancedStockFilter from './EnhancedStockFilter';
import EnhancedFilterHeader from './EnhancedFilterHeader';
import EnhancedAppliedFilters from './EnhancedAppliedFilters';
import EnhancedMobileFilterDrawer from './EnhancedMobileFilterDrawer';

// Define the FilterOptions type based on the application needs
interface FilterOptions {
  search: string;
  priceRange: [number, number];
  stockStatus: 'all' | 'in-stock' | 'out-of-stock';
  categories: string[];
  subcategories: string[];
}

interface EnhancedFilterSystemProps {
  filters: FilterOptions;
  onFiltersChange: (newFilters: Partial<FilterOptions>) => void;
  defaultPriceRange?: [number, number];
  className?: string;
}

const EnhancedFilterSystem: React.FC<EnhancedFilterSystemProps> = ({
  filters,
  onFiltersChange,
  defaultPriceRange = [0, 50000],
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Calculate the active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search.trim() !== '') count++;
    if (filters.stockStatus !== 'all') count++;
    if (filters.priceRange[0] !== defaultPriceRange[0] || 
        filters.priceRange[1] !== defaultPriceRange[1]) count++;
    count += filters.categories.length;
    count += filters.subcategories.length;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();
  const hasActiveFilters = activeFilterCount > 0;

  // Event handlers for filter changes
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
      {/* Desktop Filter */}
      <div className={`space-y-4 ${className}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <EnhancedFilterHeader 
            isOpen={isOpen}
            hasActiveFilters={hasActiveFilters}
            activeFilterCount={activeFilterCount}
            onReset={handleResetFilters}
            onToggle={() => setIsOpen(!isOpen)}
          />
          
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-6">
                  <EnhancedSearchInput
                    value={filters.search}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                  />
                  
                  <EnhancedPriceRangeSlider
                    value={filters.priceRange}
                    min={defaultPriceRange[0]}
                    max={defaultPriceRange[1]}
                    onChange={handlePriceChange}
                  />
                  
                  <EnhancedStockFilter
                    value={filters.stockStatus}
                    onChange={handleStockChange}
                  />
                  
                  {/* Category section would go here */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Applied Filters (Desktop) */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <EnhancedAppliedFilters
                  filters={filters}
                  defaultPriceRange={defaultPriceRange}
                  onRemoveCategory={handleRemoveCategory}
                  onRemoveSubcategory={handleRemoveSubcategory}
                  onRemoveStockFilter={handleRemoveStockFilter}
                  onResetPriceRange={handleResetPriceRange}
                  onRemoveSearch={handleRemoveSearch}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Mobile Filter Button */}
      <AnimatePresence>
        <motion.div
          className="fixed bottom-4 right-4 md:hidden z-30"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center bg-primary text-white rounded-full shadow-lg w-14 h-14"
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
      
      {/* Mobile Applied Filters */}
      <div className="md:hidden overflow-x-auto pt-2 pb-3 px-4 -mx-4">
        <AnimatePresence>
          {hasActiveFilters && (
            <EnhancedAppliedFilters
              filters={filters}
              defaultPriceRange={defaultPriceRange}
              onRemoveCategory={handleRemoveCategory}
              onRemoveSubcategory={handleRemoveSubcategory}
              onRemoveStockFilter={handleRemoveStockFilter}
              onResetPriceRange={handleResetPriceRange}
              onRemoveSearch={handleRemoveSearch}
              className="flex flex-nowrap pb-1"
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Mobile Filter Drawer */}
      <EnhancedMobileFilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        defaultPriceRange={defaultPriceRange}
        onFiltersChange={onFiltersChange}
        onResetFilters={handleResetFilters}
      />
    </>
  );
};

export default EnhancedFilterSystem;