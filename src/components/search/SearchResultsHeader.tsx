
import React from 'react';
import ViewToggle from './ViewToggle';

interface SearchResultsHeaderProps {
  filteredProductsCount: number;
  viewMode: 'grid' | 'list';
  setViewMode: (value: 'grid' | 'list') => void;
  loading?: boolean;
}

const SearchResultsHeader: React.FC<SearchResultsHeaderProps> = ({
  filteredProductsCount,
  viewMode,
  setViewMode,
  loading = false
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <p className="text-sm text-muted-foreground">
        {loading ? (
          <span className="animate-pulse">Filtering products...</span>
        ) : (
          `${filteredProductsCount} products found`
        )}
      </p>
      
      <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
    </div>
  );
};

export default SearchResultsHeader;
