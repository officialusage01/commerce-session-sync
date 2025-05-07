
import React from "react";
import { StockData } from "../types";
import { toast } from "sonner";

interface StockEventHandlersProps {
  stocks: StockData[];
  setStocks: React.Dispatch<React.SetStateAction<StockData[]>>;
  setSelectedStock: React.Dispatch<React.SetStateAction<StockData | null>>;
  updatePerformanceData: (stock: StockData) => void;
  resetPerformanceData: () => void;
  refetchAllStocks: () => void;
  handleDateSelect: (date: string) => void;
  selectedDate: string | null;
  children: (handlers: {
    handleStockCreated: (newStock: StockData) => void;
    handleStockUpdated: (updatedStock: StockData) => void;
    handleRefreshData: () => void;
    handleStocksDeleted: () => void;
    handleSelectStock: (stock: StockData) => void;
    handleClearAll: () => void;
  }) => React.ReactNode;
}

export const StockEventHandlers: React.FC<StockEventHandlersProps> = ({
  stocks,
  setStocks,
  setSelectedStock,
  updatePerformanceData,
  resetPerformanceData,
  refetchAllStocks,
  handleDateSelect,
  selectedDate,
  children
}) => {
  const handleStockCreated = (newStock: StockData) => {
    setStocks(prev => [newStock, ...prev]);
    setSelectedStock(newStock);
    
    refetchAllStocks();
    
    toast.success(`Stock ${newStock.stockName} added successfully`);
  };

  const handleStockUpdated = (updatedStock: StockData) => {
    const updatedStocks = stocks.map(stock => 
      stock.id === updatedStock.id ? updatedStock : stock
    );
    
    setStocks(updatedStocks);
    setSelectedStock(updatedStock);
    
    toast.success(`Stock ${updatedStock.stockName} updated successfully`);
  };

  const handleRefreshData = () => {
    // Refetch stocks for the current date
    if (selectedDate) {
      handleDateSelect(selectedDate);
    }
    
    // Refetch all stocks for the date tree
    refetchAllStocks();
  };

  const handleStocksDeleted = () => {
    // Refetch stocks for the current date
    if (selectedDate) {
      handleDateSelect(selectedDate);
    }
    
    // Refetch all stocks for the date tree
    refetchAllStocks();
    
    // Reset selection if the selected stock was deleted
    setSelectedStock(null);
    resetPerformanceData();
    
    toast.success("Selected stocks have been deleted");
  };

  const handleSelectStock = (stock: StockData) => {
    setSelectedStock(stock);
    updatePerformanceData(stock);
  };
  
  const handleClearAll = () => {
    resetPerformanceData();
    setSelectedStock(null);
    toast.success("All form fields have been cleared");
  };

  return <>{children({
    handleStockCreated,
    handleStockUpdated,
    handleRefreshData,
    handleStocksDeleted,
    handleSelectStock,
    handleClearAll
  })}</>;
};
