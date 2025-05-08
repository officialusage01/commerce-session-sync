
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { FilterOptions } from '@/components/filters/types';
import { Badge } from '@/components/ui/badge';

interface SearchFilterProps {
  maxPrice: number;
  filters: FilterOptions & { filterCount: number };
  showFilterDialog: boolean;
  setShowFilterDialog: (open: boolean) => void;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  showFilterDialog,
  setShowFilterDialog
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Button
      variant="outline"
      className="h-12 bg-white/80 backdrop-blur-sm shadow-sm flex items-center gap-2 shrink-0 transition-all hover:bg-white"
      onClick={() => setShowFilterDialog(!showFilterDialog)}
    >
      <Filter className="h-4 w-4" />
      <span>{showFilterDialog && !isMobile ? "Hide Filters" : "Filters"}</span>
      {filters.filterCount > 0 && (
        <Badge variant="default" className="ml-1 h-5 min-w-5 rounded-full text-xs flex items-center justify-center px-1.5">
          {filters.filterCount}
        </Badge>
      )}
    </Button>
  );
};

export default SearchFilter;
