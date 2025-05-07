import { useState, useEffect, useCallback } from 'react';
import { format, parse } from 'date-fns';
import { StockData, DateNode } from '@/components/stock/types';
import { getAllStocks } from '@/services/stockIndex';

export function useStocksByDate() {
  const [allStocks, setAllStocks] = useState<StockData[]>([]);
  const [dateNodes, setDateNodes] = useState<DateNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Organize stocks by date
  const organizeStocksByDate = useCallback((stocks: StockData[]) => {
    const dateMap = new Map<number, Map<number, Map<string, StockData[]>>>();
    
    // Group stocks by year, month, and day
    stocks.forEach(stock => {
      const date = stock.entryDate;
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const dateStr = format(date, 'yyyy-MM-dd');
      
      if (!dateMap.has(year)) {
        dateMap.set(year, new Map());
      }
      
      const yearMap = dateMap.get(year)!;
      if (!yearMap.has(month)) {
        yearMap.set(month, new Map());
      }
      
      const monthMap = yearMap.get(month)!;
      if (!monthMap.has(dateStr)) {
        monthMap.set(dateStr, []);
      }
      
      monthMap.get(dateStr)!.push(stock);
    });
    
    // Convert the map to DateNode array
    const nodes: DateNode[] = [];
    
    // Convert and sort by year (descending)
    Array.from(dateMap.entries())
      .sort((a, b) => b[0] - a[0])
      .forEach(([year, monthMap]) => {
        const yearNode: DateNode = { year };
        const months: DateNode['months'] = [];
        
        // Convert and sort by month (descending)
        Array.from(monthMap.entries())
          .sort((a, b) => b[0] - a[0])
          .forEach(([monthNum, dayMap]) => {
            const monthName = format(new Date(year, monthNum, 1), 'MMMM');
            const days = Array.from(dayMap.entries())
              .sort((a, b) => {
                const dateA = parse(a[0], 'yyyy-MM-dd', new Date());
                const dateB = parse(b[0], 'yyyy-MM-dd', new Date());
                return dateB.getTime() - dateA.getTime();
              })
              .map(([dateStr, stocks]) => ({
                day: format(parse(dateStr, 'yyyy-MM-dd', new Date()), 'd'),
                date: dateStr,
                stocks
              }));
            
            months.push({
              month: monthName,
              monthNumber: monthNum,
              days
            });
          });
        
        yearNode.months = months;
        nodes.push(yearNode);
      });
    
    return nodes;
  }, []);

  // Fetch stocks and organize them
  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stocks = await getAllStocks();
      setAllStocks(stocks);
      
      const nodes = organizeStocksByDate(stocks);
      setDateNodes(nodes);
    } catch (err) {
      console.error("Error fetching and organizing stocks:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [organizeStocksByDate]);

  // Initial fetch
  useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  return {
    allStocks,
    dateNodes,
    loading,
    error,
    refetch: fetchStocks
  };
}
