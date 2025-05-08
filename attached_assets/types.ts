
export type FilterOptions = {
  search: string;
  priceRange: [number, number];
  stockStatus: 'all' | 'in-stock' | 'out-of-stock';
  categories: string[];
  subcategories: string[];
};

// Alias for backwards compatibility
export type ProductFilters = FilterOptions;
