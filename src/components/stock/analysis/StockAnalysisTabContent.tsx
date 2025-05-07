
import React from "react";
import { StockData } from "../types";
import { DetailViewContent } from "../DetailViewContent";
import { TableViewContent } from "../TableViewContent";

interface StockAnalysisTabContentProps {
  selectedStock: StockData | null;
  stocks: StockData[];
  isMonthView: boolean;
  isYearView?: boolean;
  isDayView?: boolean;
  selectedDate?: string | null;
  onStockCreated: (stock: StockData) => void;
  onStockUpdated: (stock: StockData) => void;
  updatePerformanceData: (stock: StockData) => void;
  onSelectStock?: (stock: StockData) => void;
  onStocksDeleted?: () => void;
  onRefresh?: () => void;
  viewOnly?: boolean;
  tabValue: string;
  performanceData: any;
}

export const StockAnalysisTabContent: React.FC<StockAnalysisTabContentProps> = ({
  selectedStock,
  stocks,
  isMonthView,
  isYearView = false,
  isDayView = false,
  selectedDate = null,
  onStockCreated,
  onStockUpdated,
  updatePerformanceData,
  onSelectStock,
  onStocksDeleted,
  onRefresh,
  viewOnly = false,
  tabValue,
  performanceData,
}) => {
  // In the Performance tab, we'll show the table but hide the actions
  // since we're displaying them in the Card header
  const showActions = !viewOnly;

  if (tabValue === "table") {
    return (
      <TableViewContent 
        stocks={stocks}
        selectedStockId={selectedStock?.id}
        selectedDate={selectedDate}
        isMonthView={isMonthView || isYearView}
        onSelectStock={onSelectStock}
        onStocksDeleted={onStocksDeleted}
        onStockUpdated={onStockUpdated}
        onRefresh={onRefresh}
        viewOnly={viewOnly}
        showActions={showActions} // Pass down showActions
      />
    );
  }
  
  return (
    <DetailViewContent 
      selectedStock={selectedStock}
      stocks={stocks}
      performanceData={performanceData}
      onStockCreated={onStockCreated}
      onStockUpdated={onStockUpdated}
      updatePerformanceData={updatePerformanceData}
      viewOnly={viewOnly}
    />
  );
};
