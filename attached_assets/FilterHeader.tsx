import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

interface FilterHeaderProps {
  isOpen: boolean;
  hasActiveFilters: boolean;
  activeFilterCount?: number;
  onReset: () => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ 
  isOpen, 
  hasActiveFilters, 
  activeFilterCount = 0,
  onReset 
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background rounded-t-md">
      <h3 className="font-medium flex items-center text-sm">
        <Filter className="mr-2 h-4 w-4 text-primary" /> 
        Filter Products
        {hasActiveFilters && activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
            {activeFilterCount}
          </Badge>
        )}
      </h3>
      <div className="flex gap-2">
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3 mr-1" /> Clear All
          </Button>
        )}
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            {isOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </CollapsibleTrigger>
      </div>
    </div>
  );
};

export default FilterHeader;