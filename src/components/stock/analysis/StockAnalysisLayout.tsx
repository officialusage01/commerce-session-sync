
import React from "react";
import { StockAnalysisHeader } from "../StockAnalysisHeader";
import { StockDateNavigator } from "../StockDateNavigator";
import { DateNode, StockData, PerformanceData } from "../types";
import { StockAnalysisContent } from "../StockAnalysisContent";

interface StockAnalysisLayoutProps {
  dateNodes: DateNode[];
  loadingDateNodes: boolean;
  onSelectDate: (date: string) => void;
  selectedStock: StockData | null;
  stocks: StockData[];
  isMonthView: boolean;
  selectedDate: string | null;
  performanceData: PerformanceData;
  onStockCreated: (newStock: StockData) => void;
  onStockUpdated: (updatedStock: StockData) => void;
  updatePerformanceData: (stock: StockData) => void;
  onSelectStock: (stock: StockData) => void;
  onStocksDeleted: () => void;
  onRefresh: () => void;
  onClearAll: () => void;
  viewOnly: boolean;
  defaultTab: string;
  forceRerender: number;
}

export const StockAnalysisLayout: React.FC<StockAnalysisLayoutProps> = ({
  dateNodes,
  loadingDateNodes,
  onSelectDate,
  selectedStock,
  stocks,
  isMonthView,
  selectedDate,
  performanceData,
  onStockCreated,
  onStockUpdated,
  updatePerformanceData,
  onSelectStock,
  onStocksDeleted,
  onRefresh,
  onClearAll,
  viewOnly,
  defaultTab,
  forceRerender
}) => {
  return (
    <div className="container mx-auto pt-24 pb-12">
      <StockAnalysisHeader 
        title="Stock Market Performance Analysis" 
        onClearAll={onClearAll} 
      />
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/5 mb-4 lg:mb-0">
          <StockDateNavigator
            dateNodes={dateNodes}
            loading={loadingDateNodes}
            onSelectDate={onSelectDate}
          />
        </div>
        
        <div className="w-full lg:w-4/5">
          <StockAnalysisContent
            key={`stock-analysis-${forceRerender}`}
            selectedStock={selectedStock}
            stocks={stocks}
            isMonthView={isMonthView}
            selectedDate={selectedDate}
            performanceData={performanceData}
            onStockCreated={onStockCreated}
            onStockUpdated={onStockUpdated}
            updatePerformanceData={updatePerformanceData}
            onSelectStock={onSelectStock}
            onStocksDeleted={onStocksDeleted}
            onRefresh={onRefresh}
            viewOnly={viewOnly}
            defaultTab={defaultTab}
          />
        </div>
      </div>
    </div>
  );
};
