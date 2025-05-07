import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StockData } from "../types";
import { StockEntryForm } from "../form/StockEntryForm";
import { StockExitForm } from "../form/StockExitForm";
import { StockImageUploader } from "../StockImageUploader";
import { StockImageCarousel } from "../StockImageCarousel";
import { StockImage } from "../types";
import { toast } from "sonner";

interface EditStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockToEdit: StockData | null;
  setStockToEdit: (stock: StockData | null) => void;
  onStockUpdated: (updatedStock: StockData) => void;
  analysisImages: StockImage[];
  analysisLoading: boolean;
  selectedAnalysisImage: StockImage | null;
  setSelectedAnalysisImage: (image: StockImage) => void;
  uploadAnalysisImage: (file: File) => Promise<void>;
  resultImages: StockImage[];
  resultLoading: boolean;
  selectedResultImage: StockImage | null;
  setSelectedResultImage: (image: StockImage) => void;
  uploadResultImage: (file: File) => Promise<void>;
}

export const EditStockDialog: React.FC<EditStockDialogProps> = ({
  open,
  onOpenChange,
  stockToEdit,
  setStockToEdit,
  onStockUpdated,
  analysisImages,
  analysisLoading,
  selectedAnalysisImage,
  setSelectedAnalysisImage,
  uploadAnalysisImage,
  resultImages,
  resultLoading,
  selectedResultImage,
  setSelectedResultImage,
  uploadResultImage
}) => {
  const handleStockUpdated = async (updatedStockData: StockData) => {
    try {
      if (!stockToEdit) {
        console.error("No stock to update!");
        return;
      }

      onStockUpdated(updatedStockData);
      
      toast.success("Stock trade updated successfully!");
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock trade");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Stock</DialogTitle>
        </DialogHeader>
        
        {stockToEdit && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Entry Details</h3>
              <StockEntryForm 
                selectedStock={stockToEdit}
                onStockCreated={handleStockUpdated}
                onStockUpdated={handleStockUpdated}
                isEditing={true}
              />
              
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Analysis Images</h3>
                {analysisLoading ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <StockImageCarousel 
                      images={analysisImages} 
                      selectedImage={selectedAnalysisImage}
                      onSelectImage={setSelectedAnalysisImage}
                    />
                  </div>
                )}
                
                <StockImageUploader
                  onUpload={uploadAnalysisImage}
                  maxImages={5}
                  currentCount={analysisImages.length}
                  disabled={!stockToEdit}
                />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Exit Details</h3>
              <StockExitForm 
                selectedStock={stockToEdit}
                onStockUpdated={handleStockUpdated}
              />
              
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Result Images</h3>
                {resultLoading ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <StockImageCarousel 
                      images={resultImages} 
                      selectedImage={selectedResultImage}
                      onSelectImage={setSelectedResultImage}
                    />
                  </div>
                )}
                
                <StockImageUploader
                  onUpload={uploadResultImage}
                  maxImages={5}
                  currentCount={resultImages.length}
                  disabled={!stockToEdit}
                />
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
