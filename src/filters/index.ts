
// Export the filter components from our components/filters directory
export { default as SearchInput } from '../components/filters/SearchInput';
export { default as PriceRangeSlider } from '../components/filters/PriceRangeSlider';
export { default as StockFilter } from '../components/filters/StockFilter';
export { default as CategoryFilter } from '../components/filters/CategoryFilter';
export { default as FilterHeader } from '../components/filters/FilterHeader';
export type { FilterOptions } from '../components/filters/types';

// Export our main filter system component
export { default as FilterSystem } from './FilterSystem';
