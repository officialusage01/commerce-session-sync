
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StockData } from "./types";
import { PerformanceTable } from "./PerformanceTable";

interface StockPerformanceCardProps {
  stocks: StockData[];
  selectedStockId?: string | null;
  isMonthView: boolean;
  onSelectStock?: (stock: StockData) => void;
  onStocksDeleted?: () => void;
  onStockUpdated?: (stock: StockData) => void;
  onRefresh?: () => void;
  viewOnly?: boolean;
  hideSummary?: boolean;
}

export const StockPerformanceCard: React.FC<StockPerformanceCardProps> = ({
  stocks,
  selectedStockId,
  isMonthView,
  onSelectStock,
  onStocksDeleted,
  onStockUpdated,
  onRefresh,
  viewOnly = false,
  hideSummary = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Performance</CardTitle>
        {!hideSummary && (
          <CardDescription>
            {isMonthView ? "Monthly performance overview" : "Daily performance details"}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <PerformanceTable 
          stocks={stocks}
          selectedStockId={selectedStockId || undefined} 
          onSelectStock={onSelectStock}
          onStocksDeleted={onStocksDeleted}
          onStockUpdated={onStockUpdated}
          onRefresh={onRefresh}
          viewOnly={viewOnly}
        />
      </CardContent>
    </Card>
  );
};
