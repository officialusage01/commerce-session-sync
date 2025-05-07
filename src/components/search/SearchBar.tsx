
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  clearSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  clearSearch
}) => {
  return (
    <form onSubmit={handleSearch} className="flex-1">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 h-12 text-lg shadow-sm transition-shadow duration-200 focus:shadow-md"
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={clearSearch}
          >
            <X size={18} />
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
