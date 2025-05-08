// Export our enhanced filter components
export { default as EnhancedSearchInput } from './EnhancedSearchInput';
export { default as EnhancedPriceRangeSlider } from './EnhancedPriceRangeSlider';
export { default as EnhancedStockFilter } from './EnhancedStockFilter';
export { default as EnhancedFilterHeader } from './EnhancedFilterHeader';
export { default as EnhancedAppliedFilters } from './EnhancedAppliedFilters';
export { default as EnhancedMobileFilterDrawer } from './EnhancedMobileFilterDrawer';
export { default as EnhancedFilterSystem } from './EnhancedFilterSystem';

// Export types
export interface FilterOptions {
  search: string;
  priceRange: [number, number];
  stockStatus: 'all' | 'in-stock' | 'out-of-stock';
  categories: string[];
  subcategories: string[];
}