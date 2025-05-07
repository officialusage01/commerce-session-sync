
import React, { useEffect, useState } from "react";
import { useStocksByDate } from "@/hooks/useStocksByDate";
import { useStockData } from "@/hooks/useStockData";
import { initStockTables } from "@/services/stockIndex";
import { toast } from "sonner";
import { PerformanceContent } from "@/components/stock/performance/PerformanceContent";
import { InitializeStockContent } from "@/components/stock/InitializeStockContent";

const Performance = () => {
  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState<boolean>(false);

  // Get the current year for default view
  const currentYear = new Date().getFullYear().toString();

  useEffect(() => {
    const setupTables = async () => {
      try {
        setInitializing(true);
        setInitError(false);
        const success = await initStockTables();
        
        if (!success) {
          setInitError(true);
        }
      } catch (err) {
        console.error("Failed to initialize stock tables:", err);
        setInitError(true);
      } finally {
        setInitializing(false);
      }
    };
    
    setupTables();
  }, []);

  const { 
    dateNodes, 
    loading: loadingDateNodes,
    refetch: refetchAllStocks
  } = useStocksByDate();
  
  const {
    selectedDate,
    selectedStock,
    setSelectedStock,
    stocks,
    isMonthView,
    isYearView,
    isDayView,
    loadingStocks,
    performanceData,
    handleDateSelect,
    updatePerformanceData
  } = useStockData();

  // Set default view to current year when component loads
  useEffect(() => {
    if (!loadingDateNodes && dateNodes?.length > 0 && !selectedDate) {
      handleDateSelect(currentYear);
    }
  }, [loadingDateNodes, dateNodes, selectedDate, handleDateSelect, currentYear]);

  const handleSelectStock = (stock: any) => {
    setSelectedStock(stock);
    updatePerformanceData(stock);
  };

  const handleRefreshData = () => {
    // Refetch stocks for the current date
    if (selectedDate) {
      handleDateSelect(selectedDate);
    }
    
    // Refetch all stocks for the date tree
    refetchAllStocks();
    
    toast.success("Stock data refreshed");
  };

  const retryInitialization = () => {
    setInitializing(true);
    setInitError(false);
    initStockTables()
      .then(success => {
        if (!success) {
          setInitError(true);
        }
      })
      .catch(err => {
        console.error("Failed to initialize stock tables:", err);
        setInitError(true);
      })
      .finally(() => {
        setInitializing(false);
      });
  };

  if (initializing || initError) {
    return (
      <InitializeStockContent
        initializing={initializing}
        initError={initError}
        retryInitialization={retryInitialization}
      />
    );
  }

  return (
    <PerformanceContent
      selectedDate={selectedDate}
      selectedStock={selectedStock}
      stocks={stocks}
      isMonthView={isMonthView}
      isYearView={isYearView}
      isDayView={isDayView}
      dateNodes={dateNodes}
      loadingDateNodes={loadingDateNodes}
      handleDateSelect={handleDateSelect}
      handleSelectStock={handleSelectStock}
      handleRefreshData={handleRefreshData}
    />
  );
};

export default Performance;
