
import { useState, useEffect } from 'react';
import { StockData, PerformanceData } from '@/components/stock/types';
import { getStocksByDate } from '@/services/stockQuery';

export function useStockData() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [isMonthView, setIsMonthView] = useState(false);
  const [isYearView, setIsYearView] = useState(false);
  const [isDayView, setIsDayView] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    stockName: "Select or add a stock",
    entryDate: new Date(),
    exitDate: new Date(),
    entryPrice: 0,
    exitPrice: 0,
    profitLossPercentage: 0,
    isProfitable: false
  });

  // Fetch stocks from database based on date
  const fetchStocksByDate = async (dateStr: string) => {
    try {
      setLoadingStocks(true);
      console.log("Fetching stocks for date:", dateStr);
      
      // Determine if it's a year view, month view, or day view
      const isYear = /^\d{4}$/.test(dateStr);
      const isMonth = /^\d{4}-\d{2}$/.test(dateStr);
      
      setIsYearView(isYear);
      setIsMonthView(isMonth);
      setIsDayView(!isYear && !isMonth);
      
      const fetchedStocks = await getStocksByDate(dateStr);
      
      setStocks(fetchedStocks);
      
      if (fetchedStocks.length > 0) {
        setSelectedStock(fetchedStocks[0]);
        updatePerformanceData(fetchedStocks[0]);
      } else {
        setSelectedStock(null);
        resetPerformanceData();
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      throw error;
    } finally {
      setLoadingStocks(false);
    }
  };

  // Reset performance data
  const resetPerformanceData = () => {
    setPerformanceData({
      stockName: "Select or add a stock",
      entryDate: new Date(),
      exitDate: new Date(),
      entryPrice: 0,
      exitPrice: 0,
      profitLossPercentage: 0,
      isProfitable: false
    });
  };

  // Reset all form data - improved to ensure complete reset
  const resetAllFormData = () => {
    setSelectedStock(null);
    resetPerformanceData();
    setSelectedDate(null);
    setIsMonthView(false);
    setIsYearView(false);
    setIsDayView(false);
    // Reset stocks array to clear the current view
    setStocks([]);
  };

  // Update performance data when a stock is selected
  const updatePerformanceData = (stock: StockData) => {
    const exitDate = stock.exitDate || new Date();
    const exitPrice = stock.exitPrice || 0;
    const profitLoss = ((exitPrice - stock.entryPrice) / stock.entryPrice) * 100;
    
    setPerformanceData({
      stockName: stock.stockName,
      entryDate: stock.entryDate,
      exitDate: exitDate,
      entryPrice: stock.entryPrice,
      exitPrice: exitPrice,
      profitLossPercentage: profitLoss,
      isProfitable: profitLoss > 0
    });
  };

  // Handle date selection from tree
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // Fetch stocks for the selected date
    fetchStocksByDate(date);
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedStock,
    setSelectedStock,
    stocks,
    setStocks,
    loadingStocks,
    isMonthView,
    isYearView,
    isDayView,
    performanceData,
    handleDateSelect,
    updatePerformanceData,
    resetPerformanceData,
    resetAllFormData
  };
}
