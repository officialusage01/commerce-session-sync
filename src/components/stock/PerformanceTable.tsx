
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StockData } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useSelectedStocks } from "@/hooks/useSelectedStocks";
import { StockTableRow } from "./StockTableRow";
import { toast } from "sonner";
import { TableActions } from "./table/TableActions";
import { StockDialogManager } from "./table/StockDialogManager";
import { useStockImageHandling } from "@/hooks/useStockImageHandling";
import { useDataFiltering } from "@/hooks/useDataFiltering";
import { FilterControls } from "./filter/FilterControls";

interface PerformanceTableProps {
  stocks: StockData[];
  onSelectStock?: (stock: StockData) => void;
  selectedStockId?: string;
  onStocksDeleted?: () => void;
  onStockUpdated?: (stock: StockData) => void;
  onRefresh?: () => void;
  viewOnly?: boolean;
  showActions?: boolean; // Add control for table actions
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ 
  stocks, 
  onSelectStock,
  selectedStockId,
  onStocksDeleted,
  onStockUpdated,
  onRefresh,
  viewOnly = false,
  showActions = true // Default to showing actions
}) => {
  const {
    selectedStockIds,
    isDeleting,
    confirmDeleteOpen,
    handleSelectStock,
    handleSelectAll,
    openDeleteConfirmation,
    handleDeleteSelected,
    setConfirmDeleteOpen
  } = useSelectedStocks(stocks, onStocksDeleted);

  const {
    filterOpen,
    setFilterOpen,
    filterCriteria,
    setStockNameFilter,
    setStartDate,
    setEndDate,
    setPlThreshold,
    clearFilters,
    filteredData: filteredStocks
  } = useDataFiltering<StockData>(stocks);

  const handleStockCreated = (newStock: StockData) => {
    if (onStockUpdated) {
      onStockUpdated(newStock);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      toast.success("Stock data refreshed");
    }
  };

  const renderTable = (filteredItems: StockData[], handleEditStock: (stock: StockData) => void) => (
    <Table>
      <TableHeader>
        <TableRow>
          {!viewOnly && (
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={stocks.length > 0 && selectedStockIds.length === stocks.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
          )}
          <TableHead>Stock</TableHead>
          <TableHead className="text-right">Entry Price</TableHead>
          <TableHead className="text-right">Exit Price</TableHead>
          <TableHead className="text-right">Stop Loss</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead>Entry Date</TableHead>
          <TableHead>Exit Date</TableHead>
          <TableHead className="text-right">P/L %</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredItems.map((stock) => (
          <StockTableRow
            key={stock.id}
            stock={stock}
            isSelected={selectedStockId === stock.id}
            isChecked={selectedStockIds.includes(stock.id)}
            viewOnly={viewOnly}
            onSelectStock={() => onSelectStock && onSelectStock(stock)}
            onCheckStock={() => handleSelectStock(stock.id)}
            onEditStock={() => handleEditStock(stock)}
          />
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="w-full overflow-auto">
      <StockDialogManager
        onStockCreated={handleStockCreated}
        onStockUpdated={stock => onStockUpdated && onStockUpdated(stock)}
        imageHandlingHook={useStockImageHandling}
      >
        {({ handleEditStock, handleAddStock }) => (
          <>
            {showActions && (
              <TableActions
                selectedCount={selectedStockIds.length}
                viewOnly={viewOnly}
                onFilterClick={() => setFilterOpen(true)}
                onRefreshClick={handleRefresh}
                onAddClick={handleAddStock}
                onDeleteClick={openDeleteConfirmation}
                isDeleting={isDeleting}
              />
            )}
            
            {renderTable(filteredStocks, handleEditStock)}

            <DeleteConfirmationDialog
              open={confirmDeleteOpen}
              onOpenChange={setConfirmDeleteOpen}
              isDeleting={isDeleting}
              itemCount={selectedStockIds.length}
              onConfirmDelete={handleDeleteSelected}
            />
            
            <FilterControls
              open={filterOpen}
              onOpenChange={setFilterOpen}
              filterCriteria={filterCriteria}
              setStockNameFilter={setStockNameFilter}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              setPlThreshold={setPlThreshold}
              onClearFilters={clearFilters}
            />
          </>
        )}
      </StockDialogManager>
    </div>
  );
};
