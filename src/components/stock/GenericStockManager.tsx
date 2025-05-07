
import React, { useState } from 'react';
import { StockData } from './types';
import { AddStockDialog } from './table/AddStockDialog';
import { EditStockDialog } from './table/EditStockDialog';

interface GenericStockManagerProps {
  onStockCreated: (stock: StockData) => void;
  onStockUpdated: (stock: StockData) => void;
  imageHandlingHook: (stockId: string | null) => any;
  children: (props: {
    handleEditStock: (stock: StockData) => void;
    handleAddStock: () => void;
  }) => React.ReactNode;
}

export const GenericStockManager: React.FC<GenericStockManagerProps> = ({
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
    setIsAddDialogOpen(true);
  };

  const handleEditStock = (stock: StockData) => {
    setStockToEdit(stock);
    setIsEditDialogOpen(true);
  };

  // Create necessary image handling props from the hook
  const imageHandlingProps = stockToEdit ? imageHandlingHook(stockToEdit.id) : imageHandlingHook(null);

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
        analysisImages={imageHandlingProps.analysisImages}
        analysisLoading={imageHandlingProps.analysisLoading}
        selectedAnalysisImage={imageHandlingProps.selectedAnalysisImage}
        setSelectedAnalysisImage={imageHandlingProps.setSelectedAnalysisImage}
        uploadAnalysisImage={imageHandlingProps.uploadAnalysisImage}
        resultImages={imageHandlingProps.resultImages}
        resultLoading={imageHandlingProps.resultLoading}
        selectedResultImage={imageHandlingProps.selectedResultImage}
        setSelectedResultImage={imageHandlingProps.setSelectedResultImage}
        uploadResultImage={imageHandlingProps.uploadResultImage}
      />

      {stockToEdit && (
        <EditStockDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          stockToEdit={stockToEdit}
          setStockToEdit={setStockToEdit}
          onStockUpdated={onStockUpdated}
          analysisImages={imageHandlingProps.analysisImages}
          analysisLoading={imageHandlingProps.analysisLoading}
          selectedAnalysisImage={imageHandlingProps.selectedAnalysisImage}
          setSelectedAnalysisImage={imageHandlingProps.setSelectedAnalysisImage}
          uploadAnalysisImage={imageHandlingProps.uploadAnalysisImage}
          resultImages={imageHandlingProps.resultImages}
          resultLoading={imageHandlingProps.resultLoading}
          selectedResultImage={imageHandlingProps.selectedResultImage}
          setSelectedResultImage={imageHandlingProps.setSelectedResultImage}
          uploadResultImage={imageHandlingProps.uploadResultImage}
        />
      )}
    </>
  );
};
