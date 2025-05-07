
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { StockData } from "../types";

interface TableFilterHandlerProps {
  stocks: StockData[];
  children: (filteredStocks: StockData[]) => React.ReactNode;
}

export const TableFilterHandler: React.FC<TableFilterHandlerProps> = ({ 
  stocks,
  children 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>(stocks);
  const [showFilters, setShowFilters] = useState(false);

  // Reset filtered stocks when the source stocks change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStocks(stocks);
    } else {
      filterStocks(searchTerm);
    }
  }, [stocks, searchTerm]);

  const filterStocks = (term: string) => {
    if (!term.trim()) {
      setFilteredStocks(stocks);
      return;
    }

    const lowercasedTerm = term.toLowerCase();
    const filtered = stocks.filter(stock => {
      // Search in multiple fields
      return (
        stock.stockName.toLowerCase().includes(lowercasedTerm) ||
        (stock.exitPrice?.toString() || '').toLowerCase().includes(lowercasedTerm) ||
        (stock.entryPrice?.toString() || '').toLowerCase().includes(lowercasedTerm) ||
        (stock.profitLossPercentage?.toString() || '').toLowerCase().includes(lowercasedTerm)
      );
    });

    setFilteredStocks(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredStocks(stocks);
  };

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex gap-2 items-center mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(false)}
          >
            Hide Filters
          </Button>
        </div>
      )}

      {children(filteredStocks)}
    </div>
  );
};
