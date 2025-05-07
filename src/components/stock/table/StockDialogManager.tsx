
import React, { useState } from 'react';
import { StockData } from '../types';
import { AddStockDialog } from './AddStockDialog';
import { EditStockDialog } from './EditStockDialog';

interface StockDialogManagerProps {
  onStockCreated: (stock: StockData) => void;
  onStockUpdated: (stock: StockData) => void;
  imageHandlingHook: (stockId: string | null) => any;
  children: (props: {
    handleEditStock: (stock: StockData) => void;
    handleAddStock: () => void;
  }) => React.ReactNode;
}

export const StockDialogManager: React.FC<StockDialogManagerProps> = ({
  onStockCreated,
  onStockUpdated,
  imageHandlingHook,
  children,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [stockToEdit, setStockToEdit] = useState<StockData | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const handleAddStock = () => {
    setStockToEdit(null);
    setAddSuccess(false);
    setIsAddDialogOpen(true);
  };

  const handleEditStock = (stock: StockData) => {
    setStockToEdit(stock);
    setIsEditDialogOpen(true);
  };

  // Create necessary image handling props from the hook
  const addDialogImageProps = imageHandlingHook(stockToEdit?.id || null);
  const editDialogImageProps = stockToEdit ? imageHandlingHook(stockToEdit.id) : imageHandlingHook(null);

  return (
    <>
      {children({
        handleEditStock,
        handleAddStock,
      })}

      <AddStockDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        stockToEdit={stockToEdit}
        setStockToEdit={setStockToEdit}
        onStockCreated={onStockCreated}
        onStockUpdated={onStockUpdated}
        addSuccess={addSuccess}
        setAddSuccess={setAddSuccess}
        analysisImages={addDialogImageProps.analysisImages}
        analysisLoading={addDialogImageProps.analysisLoading}
        selectedAnalysisImage={addDialogImageProps.selectedAnalysisImage}
        setSelectedAnalysisImage={addDialogImageProps.setSelectedAnalysisImage}
        uploadAnalysisImage={addDialogImageProps.uploadAnalysisImage}
        resultImages={addDialogImageProps.resultImages}
        resultLoading={addDialogImageProps.resultLoading}
        selectedResultImage={addDialogImageProps.selectedResultImage}
        setSelectedResultImage={addDialogImageProps.setSelectedResultImage}
        uploadResultImage={addDialogImageProps.uploadResultImage}
      />

      {stockToEdit && (
        <EditStockDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          stockToEdit={stockToEdit}
          setStockToEdit={setStockToEdit}
          onStockUpdated={onStockUpdated}
          analysisImages={editDialogImageProps.analysisImages}
          analysisLoading={editDialogImageProps.analysisLoading}
          selectedAnalysisImage={editDialogImageProps.selectedAnalysisImage}
          setSelectedAnalysisImage={editDialogImageProps.setSelectedAnalysisImage}
          uploadAnalysisImage={editDialogImageProps.uploadAnalysisImage}
          resultImages={editDialogImageProps.resultImages}
          resultLoading={editDialogImageProps.resultLoading}
          selectedResultImage={editDialogImageProps.selectedResultImage}
          setSelectedResultImage={editDialogImageProps.setSelectedResultImage}
          uploadResultImage={editDialogImageProps.uploadResultImage}
        />
      )}
    </>
  );
};
