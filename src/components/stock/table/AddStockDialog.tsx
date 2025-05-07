
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { StockData } from "../types";
import { StockEntryForm } from "../form/StockEntryForm";
import { StockExitForm } from "../form/StockExitForm";
import { StockImageUploader } from "../StockImageUploader";
import { StockImageCarousel } from "../StockImageCarousel";
import { StockImage } from "../types";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockToEdit: StockData | null;
  setStockToEdit: (stock: StockData | null) => void;
  onStockCreated: (newStock: StockData) => void;
  onStockUpdated: (updatedStock: StockData) => void;
  addSuccess: boolean;
  setAddSuccess: (success: boolean) => void;
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

export const AddStockDialog: React.FC<AddStockDialogProps> = ({
  open,
  onOpenChange,
  stockToEdit,
  setStockToEdit,
  onStockCreated,
  onStockUpdated,
  addSuccess,
  setAddSuccess,
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
  const [activeTab, setActiveTab] = useState("entry");
  
  // Effect to prevent dialog from closing on success
  useEffect(() => {
    if (addSuccess) {
      // Don't close the dialog, just switch to exit tab
      setActiveTab("exit");
    }
  }, [addSuccess]);

  const handleStockCreated = (newStock: StockData) => {
    setAddSuccess(true);
    setStockToEdit(newStock);
    onStockCreated(newStock);
    toast.success("New stock trade created successfully!");
    // Automatically switch to exit tab after successful entry
    setActiveTab("exit");
  };

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
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh]">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>Add Stock Trade</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-2">
            <TabsTrigger value="entry">Entry Details</TabsTrigger>
            <TabsTrigger value="exit" disabled={!addSuccess}>Exit Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="entry" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <StockEntryForm 
                  selectedStock={stockToEdit}
                  onStockCreated={handleStockCreated}
                  isEditing={!!stockToEdit && addSuccess}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Analysis Images</h3>
                {analysisLoading ? (
                  <div className="h-[150px] flex items-center justify-center">
                    <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="mb-4 h-[150px] border rounded-md overflow-hidden bg-muted/30">
                    {analysisImages.length > 0 ? (
                      <StockImageCarousel 
                        images={analysisImages} 
                        selectedImage={selectedAnalysisImage}
                        onSelectImage={setSelectedAnalysisImage}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        No analysis images
                      </div>
                    )}
                  </div>
                )}
                
                <StockImageUploader
                  onUpload={uploadAnalysisImage}
                  maxImages={5}
                  currentCount={analysisImages.length}
                  disabled={!stockToEdit || !addSuccess}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="exit" className="space-y-6">
            {addSuccess && stockToEdit && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <StockExitForm 
                    selectedStock={stockToEdit}
                    onStockUpdated={handleStockUpdated}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Result Images</h3>
                  {resultLoading ? (
                    <div className="h-[150px] flex items-center justify-center">
                      <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <div className="mb-4 h-[150px] border rounded-md overflow-hidden bg-muted/30">
                      {resultImages.length > 0 ? (
                        <StockImageCarousel 
                          images={resultImages} 
                          selectedImage={selectedResultImage}
                          onSelectImage={setSelectedResultImage}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          No result images
                        </div>
                      )}
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
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
