
import React from 'react';
import { LayoutGrid, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchResultsHeaderProps {
  filteredProductsCount: number;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  loading?: boolean;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  filteredProductsCount,
  viewMode,
  setViewMode,
  loading = false
}) => {
  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center">
        {loading ? (
          <div className="flex items-center text-muted-foreground">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span>Loading products...</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {filteredProductsCount} product{filteredProductsCount !== 1 && 's'} found
          </p>
        )}
      </div>
      
      <div className="flex gap-1">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => setViewMode('grid')}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="icon"
          className="h-8 w-8"
          onClick={() => setViewMode('list')}
          aria-label="List view"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SearchResultsHeader;
