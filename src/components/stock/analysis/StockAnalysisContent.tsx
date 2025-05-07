
import React, { useState } from "react";
import { TabSelector } from "./TabSelector";
import { StockAnalysisTabContent } from "./StockAnalysisTabContent";
import { StockData, PerformanceData } from "../types";
import { TabsContent } from "@/components/ui/tabs";

interface StockAnalysisContentProps {
  selectedStock: StockData | null;
  performanceData: PerformanceData;
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
  defaultTab?: string;
}

export const StockAnalysisContent: React.FC<StockAnalysisContentProps> = ({
  selectedStock,
  performanceData,
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
  defaultTab
}) => {
  // Determine default tab based on provided prop, view type, or fallback
  // For year/month view -> table view
  // For day view -> details view
  const determinedDefaultTab = defaultTab || (isDayView ? "details" : "table");
  
  const [activeTab, setActiveTab] = useState(determinedDefaultTab);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <TabSelector defaultTab={determinedDefaultTab} onTabChange={handleTabChange}>
      <TabsContent value="table">
        <StockAnalysisTabContent 
          tabValue="table"
          selectedStock={selectedStock}
          stocks={stocks}
          isMonthView={isMonthView}
          isYearView={isYearView}
          isDayView={isDayView}
          selectedDate={selectedDate}
          onStockCreated={onStockCreated}
          onStockUpdated={onStockUpdated}
          updatePerformanceData={updatePerformanceData}
          onSelectStock={onSelectStock}
          onStocksDeleted={onStocksDeleted}
          onRefresh={onRefresh}
          viewOnly={viewOnly}
          performanceData={performanceData}
        />
      </TabsContent>
      
      <TabsContent value="details">
        <StockAnalysisTabContent 
          tabValue="details"
          selectedStock={selectedStock}
          stocks={stocks}
          isMonthView={isMonthView}
          isYearView={isYearView}
          isDayView={isDayView}
          selectedDate={selectedDate}
          onStockCreated={onStockCreated}
          onStockUpdated={onStockUpdated}
          updatePerformanceData={updatePerformanceData}
          onSelectStock={onSelectStock}
          onStocksDeleted={onStocksDeleted}
          onRefresh={onRefresh}
          viewOnly={viewOnly}
          performanceData={performanceData}
        />
      </TabsContent>
    </TabSelector>
  );
};
