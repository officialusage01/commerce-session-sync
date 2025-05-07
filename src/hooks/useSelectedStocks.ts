
import { useState } from "react";
import { StockData } from "@/components/stock/types";
import { deleteStocks } from "@/services/deleteStock";

export function useSelectedStocks(stocks: StockData[], onStocksDeleted?: () => void) {
  const [selectedStockIds, setSelectedStockIds] = useState<string[]>([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectStock = (stockId: string) => {
    setSelectedStockIds(prev => 
      prev.includes(stockId)
        ? prev.filter(id => id !== stockId)
        : [...prev, stockId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStockIds(stocks.map(stock => stock.id));
    } else {
      setSelectedStockIds([]);
    }
  };

  const openDeleteConfirmation = () => {
    setConfirmDeleteOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setConfirmDeleteOpen(false);
  };

  const handleDeleteSelected = async () => {
    if (selectedStockIds.length === 0) return;
    
    setIsDeleting(true);
    const success = await deleteStocks(selectedStockIds);
    
    if (success) {
      setSelectedStockIds([]);
      if (onStocksDeleted) {
        onStocksDeleted();
      }
    }
    
    setIsDeleting(false);
    setConfirmDeleteOpen(false);
  };

  return {
    selectedStockIds,
    isDeleting,
    confirmDeleteOpen,
    handleSelectStock,
    handleSelectAll,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    handleDeleteSelected,
    setConfirmDeleteOpen
  };
}
