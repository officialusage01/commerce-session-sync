import React from 'react';
import { X, Search as SearchIcon, IndianRupee, Tag, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategories, getSubcategories } from '@/lib/supabase';
import { Category, Subcategory, FilterOptions } from '@/lib/supabase/types';
import { formatCurrency } from '@/lib/utils';

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

const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  filters,
  defaultPriceRange,
  onRemoveCategory,
  onRemoveSubcategory,
  onRemoveStockFilter,
  onResetPriceRange,
  onRemoveSearch,
  className = ""
}) => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [subcategories, setSubcategories] = React.useState<Subcategory[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const cats = await getCategories();
        setCategories(cats);
        
        // Fetch subcategories for all categories
        let allSubcategories: Subcategory[] = [];
        for (const cat of cats) {
          const subs = await getSubcategories(cat.id);
          allSubcategories = [...allSubcategories, ...subs];
        }
        setSubcategories(allSubcategories);
      } catch (error) {
        console.error('Error loading filter data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const hasActiveFilters = 
    filters.search.trim() !== '' || 
    filters.stockStatus !== 'all' ||
    filters.categories.length > 0 ||
    filters.subcategories.length > 0 ||
    filters.priceRange[0] !== defaultPriceRange[0] ||
    filters.priceRange[1] !== defaultPriceRange[1];

  if (!hasActiveFilters || loading) return null;

  const isPriceRangeModified = 
    filters.priceRange[0] !== defaultPriceRange[0] ||
    filters.priceRange[1] !== defaultPriceRange[1];

  return (
    <motion.div 
      className={`${className}`}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-wrap gap-1.5">
        <AnimatePresence>
          {filters.search.trim() !== '' && (
            <FilterBadge 
              label={filters.search} 
              onRemove={onRemoveSearch}
              icon={<SearchIcon className="h-2.5 w-2.5 mr-1" />}
              color="blue"
            />
          )}

          {filters.stockStatus !== 'all' && (
            <FilterBadge 
              label={filters.stockStatus === 'in-stock' ? 'In Stock' : 'Out of Stock'} 
              onRemove={onRemoveStockFilter}
              icon={<Package className="h-2.5 w-2.5 mr-1" />}
              color={filters.stockStatus === 'in-stock' ? 'green' : 'red'}
            />
          )}

          {isPriceRangeModified && (
            <FilterBadge 
              label={`${formatCurrency(filters.priceRange[0])} - ${formatCurrency(filters.priceRange[1])}`} 
              onRemove={onResetPriceRange}
              icon={<IndianRupee className="h-2.5 w-2.5 mr-1" />}
              color="amber"
            />
          )}

          {filters.categories.map(categoryId => {
            const category = categories.find(c => c.id === categoryId);
            if (!category) return null;
            return (
              <FilterBadge 
                key={`cat-${categoryId}`} 
                label={category.name} 
                onRemove={() => onRemoveCategory(categoryId)}
                icon={<Tag className="h-2.5 w-2.5 mr-1" />}
                color="indigo"
              />
            );
          })}

          {filters.subcategories
            .filter(subId => !subcategories.some(sub => 
              sub.id === subId && filters.categories.includes(sub.categoryId)
            ))
            .map(subcategoryId => {
              // Find the subcategory in all loaded subcategories
              const foundSubcategory = subcategories.find(s => s.id === subcategoryId);
              
              if (!foundSubcategory) return null;
              
              return (
                <FilterBadge 
                  key={`sub-${subcategoryId}`} 
                  label={foundSubcategory.name} 
                  onRemove={() => onRemoveSubcategory(subcategoryId)}
                  icon={<Tag className="h-2.5 w-2.5 mr-1" />}
                  color="violet"
                />
              );
            })
          }
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

type FilterBadgeColor = 'blue' | 'green' | 'red' | 'amber' | 'indigo' | 'violet';

const getColorClasses = (color: FilterBadgeColor): string => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 text-blue-700 hover:bg-blue-100';
    case 'green':
      return 'bg-green-50 text-green-700 hover:bg-green-100';
    case 'red':
      return 'bg-red-50 text-red-700 hover:bg-red-100';
    case 'amber':
      return 'bg-amber-50 text-amber-700 hover:bg-amber-100';
    case 'indigo':
      return 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100';
    case 'violet':
      return 'bg-violet-50 text-violet-700 hover:bg-violet-100';
    default:
      return 'bg-primary-50 text-primary-700 hover:bg-primary-100';
  }
};

const FilterBadge = ({ 
  label, 
  onRemove, 
  icon, 
  color = 'blue'
}: { 
  label: string; 
  onRemove: () => void;
  icon?: React.ReactNode;
  color?: FilterBadgeColor;
}) => {
  const colorClasses = getColorClasses(color);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className={`flex items-center px-2 py-0.5 ${colorClasses} rounded-full text-xs font-medium group shadow-sm`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate max-w-[100px]">{label}</span>
      <button 
        onClick={onRemove}
        className="ml-1 rounded-full p-0.5 transition-colors flex items-center justify-center"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </motion.div>
  );
};

export default AppliedFilters;
