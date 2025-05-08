import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter, ArrowLeft, RefreshCw } from 'lucide-react';

import EnhancedSearchInput from './EnhancedSearchInput';
import EnhancedPriceRangeSlider from './EnhancedPriceRangeSlider';
import EnhancedStockFilter from './EnhancedStockFilter';
import EnhancedAppliedFilters from './EnhancedAppliedFilters';

// Define the FilterOptions type based on the application needs
interface FilterOptions {
  search: string;
  priceRange: [number, number];
  stockStatus: 'all' | 'in-stock' | 'out-of-stock';
  categories: string[];
  subcategories: string[];
}

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  defaultPriceRange: [number, number];
  onFiltersChange: (newFilters: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0 }
};

const EnhancedMobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  defaultPriceRange,
  onFiltersChange,
  onResetFilters
}) => {
  // Handle escape key press
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    
    // Lock body scroll when drawer is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-background shadow-xl z-50 md:hidden flex flex-col"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center">
                <motion.button
                  className="mr-2 p-2 rounded-full hover:bg-muted"
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </motion.button>
                <div className="flex items-center">
                  <Filter className="h-5 w-5 mr-2 text-primary" />
                  <h2 className="font-medium">Filters</h2>
                  {hasActiveFilters && (
                    <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
              </div>
              
              {hasActiveFilters && (
                <motion.button
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center"
                  onClick={onResetFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Reset All
                </motion.button>
              )}
            </div>
            
            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="p-4 border-b">
                <h3 className="text-sm font-medium mb-2">Active Filters</h3>
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
            )}
            
            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Search</h3>
                <EnhancedSearchInput
                  value={filters.search}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Price</h3>
                <EnhancedPriceRangeSlider
                  value={filters.priceRange}
                  min={defaultPriceRange[0]}
                  max={defaultPriceRange[1]}
                  onChange={handlePriceChange}
                />
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Availability</h3>
                <EnhancedStockFilter
                  value={filters.stockStatus}
                  onChange={handleStockChange}
                />
              </div>
              
              {/* Category section would go here - omitted for brevity */}
            </div>
            
            {/* Footer with Apply Button */}
            <div className="border-t p-4 bg-background">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">
                  {hasActiveFilters 
                    ? `${activeFilterCount} ${activeFilterCount === 1 ? 'filter' : 'filters'} applied` 
                    : 'No filters applied'}
                </span>
                {hasActiveFilters && (
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={onResetFilters}
                  >
                    Reset All
                  </button>
                )}
              </div>
              
              <motion.button
                className="w-full py-2.5 text-center bg-primary text-primary-foreground rounded-md font-medium"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EnhancedMobileFilterDrawer;