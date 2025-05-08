
export interface FilterOptions {
  search: string;
  priceRange: [number, number];
  stockStatus: 'all' | 'in-stock' | 'out-of-stock';
  categories: string[];
  subcategories: string[];
  filterCount?: number;
}

// Alias for backward compatibility
export type ProductFilters = FilterOptions;
