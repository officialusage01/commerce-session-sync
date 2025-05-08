import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, IndianRupee, Package, Tag } from 'lucide-react';

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

// Define the FilterOptions type based on the application needs
interface FilterOptions {
  search: string;
  priceRange: [number, number];
  stockStatus: 'all' | 'in-stock' | 'out-of-stock';
  categories: string[];
  subcategories: string[];
}

interface AppliedFiltersProps {
  filters: FilterOptions;
  defaultPriceRange: [number, number];
  onRemoveCategory: (categoryId: string) => void;
  onRemoveSubcategory: (subcategoryId: string) => void;
  onRemoveStockFilter: () => void;
  onResetPriceRange: () => void;
  onRemoveSearch: () => void;
  className?: string;
}

type FilterBadgeColor = 'blue' | 'green' | 'red' | 'amber' | 'indigo' | 'violet';

const getColorClasses = (color: FilterBadgeColor): { bg: string, text: string } => {
  switch (color) {
    case 'blue':
      return { bg: 'bg-blue-100', text: 'text-blue-700' };
    case 'green':
      return { bg: 'bg-green-100', text: 'text-green-700' };
    case 'red':
      return { bg: 'bg-red-100', text: 'text-red-700' };
    case 'amber':
      return { bg: 'bg-amber-100', text: 'text-amber-700' };
    case 'indigo':
      return { bg: 'bg-indigo-100', text: 'text-indigo-700' };
    case 'violet':
      return { bg: 'bg-violet-100', text: 'text-violet-700' };
  }
};

interface FilterBadgeProps {
  label: string;
  onRemove: () => void;
  color?: FilterBadgeColor;
  icon?: React.ReactNode;
  className?: string;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({
  label,
  onRemove,
  color = 'blue',
  icon,
  className = ''
}) => {
  const { bg, text } = getColorClasses(color);

  return (
    <motion.div
      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full ${bg} ${text} text-xs font-medium shadow-sm mr-2 mb-2 ${className}`}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ duration: 0.2 }}
      layout
    >
      {icon && <span className="mr-1">{icon}</span>}
      <span>{label}</span>
      <motion.button
        className="ml-1 rounded-full p-0.5 hover:bg-white/30"
        onClick={onRemove}
        whileHover={{ scale: 1.2, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="h-3 w-3" />
      </motion.button>
    </motion.div>
  );
};

const EnhancedAppliedFilters: React.FC<AppliedFiltersProps> = ({
  filters,
  defaultPriceRange,
  onRemoveCategory,
  onRemoveSubcategory,
  onRemoveStockFilter,
  onResetPriceRange,
  onRemoveSearch,
  className = ""
}) => {
  // Mock categories and subcategories data for demonstration
  // These would typically come from your application's state
  const categories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Home & Kitchen' },
  ];
  
  const subcategories = [
    { id: '101', name: 'Smartphones', category_id: '1' },
    { id: '102', name: 'Laptops', category_id: '1' },
    { id: '201', name: 'T-shirts', category_id: '2' },
    { id: '301', name: 'Cookware', category_id: '3' },
  ];
  
  const hasActiveFilters = 
    filters.search.trim() !== '' || 
    filters.stockStatus !== 'all' ||
    filters.categories.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.priceRange[0] !== defaultPriceRange[0] ||
    filters.priceRange[1] !== defaultPriceRange[1];
    
  if (!hasActiveFilters) return null;

  // Get the display name for a category by ID
  const getCategoryName = (id: string) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : id;
  };
  
  // Get the display name for a subcategory by ID
  const getSubcategoryName = (id: string) => {
    const subcategory = subcategories.find(s => s.id === id);
    return subcategory ? subcategory.name : id;
  };
  
  // Translation map for stock status
  const stockStatusText: Record<string, string> = {
    'all': 'All Products',
    'in-stock': 'In Stock Only',
    'out-of-stock': 'Out of Stock Only'
  };

  return (
    <motion.div 
      className={`flex flex-wrap ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence>
        {/* Search filter */}
        {filters.search.trim() !== '' && (
          <FilterBadge
            label={`"${filters.search}"`}
            onRemove={onRemoveSearch}
            color="blue"
            icon={<Search className="h-3 w-3" />}
          />
        )}
        
        {/* Price range filter */}
        {(filters.priceRange[0] !== defaultPriceRange[0] || 
          filters.priceRange[1] !== defaultPriceRange[1]) && (
          <FilterBadge
            label={`${formatCurrency(filters.priceRange[0])} - ${formatCurrency(filters.priceRange[1])}`}
            onRemove={onResetPriceRange}
            color="green"
            icon={<IndianRupee className="h-3 w-3" />}
          />
        )}
        
        {/* Stock status filter */}
        {filters.stockStatus !== 'all' && (
          <FilterBadge
            label={stockStatusText[filters.stockStatus]}
            onRemove={onRemoveStockFilter}
            color={filters.stockStatus === 'in-stock' ? 'green' : 'red'}
            icon={<Package className="h-3 w-3" />}
          />
        )}
        
        {/* Category filters */}
        {filters.categories.map(categoryId => (
          <FilterBadge
            key={`category-${categoryId}`}
            label={getCategoryName(categoryId)}
            onRemove={() => onRemoveCategory(categoryId)}
            color="indigo"
            icon={<Tag className="h-3 w-3" />}
          />
        ))}
        
        {/* Subcategory filters */}
        {filters.subcategories.map(subcategoryId => (
          <FilterBadge
            key={`subcategory-${subcategoryId}`}
            label={getSubcategoryName(subcategoryId)}
            onRemove={() => onRemoveSubcategory(subcategoryId)}
            color="violet"
            icon={<Tag className="h-3 w-3" />}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedAppliedFilters;