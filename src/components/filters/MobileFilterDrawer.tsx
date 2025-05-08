import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { FilterOptions } from '@/lib/supabase/types';
import { getActiveFilterCount } from '@/lib/utils';
import SearchInput from './SearchInput';
import PriceRangeSlider from './PriceRangeSlider';
import StockFilter from './StockFilter';
import CategoryFilter from './CategoryFilter';
import AppliedFilters from './AppliedFilters';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  defaultPriceRange: [number, number];
  onFiltersChange: (newFilters: Partial<FilterOptions>) => void;
  onResetFilters: () => void;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  defaultPriceRange,
  onFiltersChange,
  onResetFilters
}) => {
  const [filterChanged, setFilterChanged] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const activeFilterCount = getActiveFilterCount(filters, defaultPriceRange);
  const localActiveFilterCount = getActiveFilterCount(localFilters, defaultPriceRange);
  
  // Reset local filters when drawer opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
      setFilterChanged(false);
    }
  }, [isOpen, filters]);

  // Close drawer when pressing escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Local handlers for filter changes
  const updateLocalFilters = (newPartialFilters: Partial<FilterOptions>) => {
    setLocalFilters(prev => {
      const updated = { ...prev, ...newPartialFilters };
      setFilterChanged(JSON.stringify(updated) !== JSON.stringify(filters));
      return updated;
    });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleSearchChange = (value: string) => {
    updateLocalFilters({ search: value });
  };

  const handlePriceChange = (value: [number, number]) => {
    updateLocalFilters({ priceRange: value });
  };

  const handleStockChange = (value: 'all' | 'in-stock' | 'out-of-stock') => {
    updateLocalFilters({ stockStatus: value });
  };

  const handleCategoryChange = (categoryId: string, isSelected: boolean) => {
    const updatedCategories = isSelected
      ? [...localFilters.categories, categoryId]
      : localFilters.categories.filter(id => id !== categoryId);
    
    updateLocalFilters({ categories: updatedCategories });
  };

  const handleSubcategoryChange = (subcategoryId: string, isSelected: boolean) => {
    const updatedSubcategories = isSelected
      ? [...localFilters.subcategories, subcategoryId]
      : localFilters.subcategories.filter(id => id !== subcategoryId);
    
    updateLocalFilters({ subcategories: updatedSubcategories });
  };

  const handleResetFilters = () => {
    setLocalFilters({
      search: '',
      priceRange: defaultPriceRange,
      stockStatus: 'all',
      categories: [],
      subcategories: []
    });
    setFilterChanged(true);
  };

  const handleRemoveCategory = (categoryId: string) => {
    updateLocalFilters({ 
      categories: localFilters.categories.filter(id => id !== categoryId) 
    });
  };

  const handleRemoveSubcategory = (subcategoryId: string) => {
    updateLocalFilters({ 
      subcategories: localFilters.subcategories.filter(id => id !== subcategoryId) 
    });
  };

  const handleRemoveStockFilter = () => {
    updateLocalFilters({ stockStatus: 'all' });
  };

  const handleResetPriceRange = () => {
    updateLocalFilters({ priceRange: defaultPriceRange });
  };

  const handleRemoveSearch = () => {
    updateLocalFilters({ search: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          
          {/* Drawer panel */}
          <motion.div 
            className="absolute inset-y-0 right-0 flex max-w-full"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="relative w-screen max-w-md">
              {/* Close button */}
              <motion.div 
                className="absolute top-0 left-0 -ml-12 pt-4 pr-2 flex sm:-ml-10 sm:pr-4 z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <button 
                  className="rounded-full bg-white/10 p-1 text-white backdrop-blur-sm hover:bg-white/20 focus:outline-none"
                  onClick={onClose}
                >
                  <span className="sr-only">Close panel</span>
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </motion.div>
              
              {/* Drawer content */}
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
                {/* Header */}
                <div className="px-4 py-4 bg-gradient-to-r from-white to-gray-50 border-b sticky top-0 z-10">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                      <div className="bg-primary/10 p-1.5 rounded-md mr-2 text-primary">
                        <Filter className="h-4 w-4" />
                      </div>
                      Filter Products
                      {localActiveFilterCount > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-800"
                        >
                          {localActiveFilterCount}
                        </motion.span>
                      )}
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={onClose}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Applied filters */}
                  <div className="mt-2">
                    <AppliedFilters 
                      filters={localFilters}
                      defaultPriceRange={defaultPriceRange}
                      onRemoveCategory={handleRemoveCategory}
                      onRemoveSubcategory={handleRemoveSubcategory}
                      onRemoveStockFilter={handleRemoveStockFilter}
                      onResetPriceRange={handleResetPriceRange}
                      onRemoveSearch={handleRemoveSearch}
                      className="overflow-x-auto py-1.5 flex-nowrap whitespace-nowrap"
                    />
                  </div>
                </div>
                
                <div className="relative flex-1 px-4 py-2">
                  <div className="space-y-1">
                    <div className="pb-3">
                      <SearchInput 
                        value={localFilters.search}
                        onChange={handleSearchChange}
                        placeholder="Search products..."
                      />
                    </div>
                    
                    <PriceRangeSlider 
                      value={localFilters.priceRange}
                      min={defaultPriceRange[0]}
                      max={defaultPriceRange[1]}
                      onChange={handlePriceChange}
                    />
                    
                    <StockFilter 
                      value={localFilters.stockStatus}
                      onChange={handleStockChange}
                    />
                    
                    <CategoryFilter 
                      selectedCategories={localFilters.categories}
                      selectedSubcategories={localFilters.subcategories}
                      onCategoryChange={handleCategoryChange}
                      onSubcategoryChange={handleSubcategoryChange}
                    />
                  </div>
                </div>
                
                {/* Mobile Actions */}
                <div className="border-t sticky bottom-0 bg-white py-4 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      className="w-1/2 border-gray-300"
                      onClick={handleResetFilters}
                      disabled={localActiveFilterCount === 0}
                    >
                      Reset All
                    </Button>
                    <Button
                      className="w-1/2 gap-1.5"
                      onClick={applyFilters}
                      disabled={!filterChanged}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileFilterDrawer;
