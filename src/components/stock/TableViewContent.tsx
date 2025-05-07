
import React from "react";
import { StockData } from "./types";
import { PerformanceTable } from "./PerformanceTable";

interface TableViewContentProps {
  stocks: StockData[];
  selectedStockId?: string | null;
  selectedDate: string | null;
  isMonthView: boolean;
  onSelectStock?: (stock: StockData) => void;
  onStocksDeleted?: () => void;
  onStockUpdated?: (stock: StockData) => void;
  onRefresh?: () => void;
  viewOnly?: boolean;
  showActions?: boolean; // Add control for table actions
}

export const TableViewContent: React.FC<TableViewContentProps> = ({
  stocks,
  selectedStockId,
  onSelectStock,
  onStocksDeleted,
  onStockUpdated,
  onRefresh,
  viewOnly = false,
  showActions = true // Default to showing actions
}) => {
  return (
    <div className="space-y-4">
      <PerformanceTable
        stocks={stocks}
        selectedStockId={selectedStockId || undefined}
        onSelectStock={onSelectStock}
        onStocksDeleted={onStocksDeleted}
        onStockUpdated={onStockUpdated}
        onRefresh={onRefresh}
        viewOnly={viewOnly}
        showActions={showActions} // Pass the showActions prop
      />
    </div>
  );
};
