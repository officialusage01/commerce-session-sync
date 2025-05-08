
export type FilterOptions = {
  search: string;
  priceRange: [number, number];
  stockStatus: 'all' | 'in-stock' | 'out-of-stock';
  categories: string[];
  subcategories: string[];
  filterCount?: number; // Optional count of active filters for UI indicators
};

// Alias for backwards compatibility
export type ProductFilters = FilterOptions;
