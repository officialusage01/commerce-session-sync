
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StockData, PerformanceData } from "./types";
import { DetailViewContent } from "./DetailViewContent";
import { TableViewContent } from "./TableViewContent";
import { GenericStockManager } from "./GenericStockManager";

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

  return (
    <Tabs defaultValue={determinedDefaultTab} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="table">Table View</TabsTrigger>
        <TabsTrigger value="details">Details View</TabsTrigger>
      </TabsList>
      
      <TabsContent value="table">
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
        />
      </TabsContent>
      
      <TabsContent value="details">
        <DetailViewContent 
          selectedStock={selectedStock}
          stocks={stocks}
          performanceData={performanceData}
          onStockCreated={onStockCreated}
          onStockUpdated={onStockUpdated}
          updatePerformanceData={updatePerformanceData}
          viewOnly={viewOnly}
        />
      </TabsContent>
    </Tabs>
  );
};
