
import React, { useState } from "react";
import { useStocksByDate } from "@/hooks/useStocksByDate";
import { useStockData } from "@/hooks/useStockData";
import { StockAnalysisInitializer } from "@/components/stock/analysis/StockAnalysisInitializer";
import { InitializationWrapper } from "@/components/stock/analysis/InitializationWrapper";
import { StockEventHandlers } from "@/components/stock/analysis/StockEventHandlers";
import { StockAnalysisLayout } from "@/components/stock/analysis/StockAnalysisLayout";

const StockAnalysis = () => {
  const [viewOnly, setViewOnly] = useState(false);
  const [forceRerender, setForceRerender] = useState(0);
  const [defaultTab, setDefaultTab] = useState<string>("table");

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
    setStocks,
    loadingStocks,
    isMonthView,
    performanceData,
    handleDateSelect,
    updatePerformanceData,
    resetAllFormData,
    resetPerformanceData
  } = useStockData();

  const handleClearAllWithReset = () => {
    resetAllFormData();
    setForceRerender(prev => prev + 1);
  };

  return (
    <StockAnalysisInitializer onInitialize={handleDateSelect}>
      {({ initializing, initError, retryInitialization }) => (
        <InitializationWrapper
          initializing={initializing}
          initError={initError}
          retryInitialization={retryInitialization}
        >
          <StockEventHandlers
            stocks={stocks}
            setStocks={setStocks}
            setSelectedStock={setSelectedStock}
            updatePerformanceData={updatePerformanceData}
            resetPerformanceData={resetPerformanceData}
            refetchAllStocks={refetchAllStocks}
            handleDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          >
            {({ 
              handleStockCreated, 
              handleStockUpdated, 
              handleRefreshData, 
              handleStocksDeleted, 
              handleSelectStock, 
              handleClearAll 
            }) => (
              <StockAnalysisLayout
                dateNodes={dateNodes}
                loadingDateNodes={loadingDateNodes}
                onSelectDate={handleDateSelect}
                selectedStock={selectedStock}
                stocks={stocks}
                isMonthView={isMonthView}
                selectedDate={selectedDate}
                performanceData={performanceData}
                onStockCreated={handleStockCreated}
                onStockUpdated={handleStockUpdated}
                updatePerformanceData={updatePerformanceData}
                onSelectStock={handleSelectStock}
                onStocksDeleted={handleStocksDeleted}
                onRefresh={handleRefreshData}
                onClearAll={handleClearAllWithReset}
                viewOnly={viewOnly}
                defaultTab={defaultTab}
                forceRerender={forceRerender}
              />
            )}
          </StockEventHandlers>
        </InitializationWrapper>
      )}
    </StockAnalysisInitializer>
    );
};

export default StockAnalysis;
