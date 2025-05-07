
import { useState, useCallback, useMemo } from 'react';
import { StockData } from '@/components/stock/types';

export interface FilterCriteria {
  stockNameFilter: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  plThreshold: string;
}

export function useDataFiltering<T extends StockData>(data: T[]) {
  // Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    stockNameFilter: "",
    startDate: undefined,
    endDate: undefined,
    plThreshold: ""
  });

  // Individual filter setters
  const setStockNameFilter = useCallback((value: string) => {
    setFilterCriteria(prev => ({ ...prev, stockNameFilter: value }));
  }, []);

  const setStartDate = useCallback((date: Date | undefined) => {
    setFilterCriteria(prev => ({ ...prev, startDate: date }));
  }, []);

  const setEndDate = useCallback((date: Date | undefined) => {
    setFilterCriteria(prev => ({ ...prev, endDate: date }));
  }, []);

  const setPlThreshold = useCallback((value: string) => {
    setFilterCriteria(prev => ({ ...prev, plThreshold: value }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilterCriteria({
      stockNameFilter: "",
      startDate: undefined,
      endDate: undefined,
      plThreshold: ""
    });
    setFilterOpen(false);
  }, []);

  // Apply filtering logic
  const filteredData = useMemo(() => {
    return data.filter(item => {
      let matches = true;
      const { stockNameFilter, startDate, endDate, plThreshold } = filterCriteria;
      
      // Stock name filter
      if (stockNameFilter && !item.stockName.toLowerCase().includes(stockNameFilter.toLowerCase())) {
        matches = false;
      }
      
      // Date range filter
      if (startDate && item.entryDate < startDate) {
        matches = false;
      }
      
      if (endDate) {
        const endDateWithTime = new Date(endDate);
        endDateWithTime.setHours(23, 59, 59, 999);
        if (item.entryDate > endDateWithTime) {
          matches = false;
        }
      }
      
      // P/L threshold filter
      if (plThreshold) {
        const threshold = parseFloat(plThreshold);
        if (!isNaN(threshold) && item.profitLossPercentage && item.profitLossPercentage < threshold) {
          matches = false;
        }
      }
      
      return matches;
    });
  }, [data, filterCriteria]);

  return {
    filterOpen,
    setFilterOpen,
    filterCriteria,
    setFilterCriteria,
    setStockNameFilter,
    setStartDate,
    setEndDate,
    setPlThreshold,
    clearFilters,
    filteredData
  };
}
