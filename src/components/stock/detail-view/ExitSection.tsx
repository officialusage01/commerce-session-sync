
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardDescription, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StockExitForm } from "../form/StockExitForm";
import { StockImageUploader } from "../StockImageUploader";
import { StockImageCarousel } from "../StockImageCarousel";
import { StockData, StockImage } from "../types";
import { ImageModal } from "@/components/ui/image-modal";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ExitSectionProps {
  selectedStock: StockData | null;
  resultImages: StockImage[];
  resultLoading: boolean;
  selectedResultImage: StockImage | null;
  setSelectedResultImage: (image: StockImage | null) => void;
  uploadResultImage: (file: File | File[]) => Promise<void>;
  onStockUpdated: (stock: StockData) => void;
  viewOnly?: boolean;
  onImageDeleted?: () => void;
  // Multi-select props
  selectedImages?: StockImage[];
  toggleImageSelection?: (image: StockImage) => void;
  deleteImages?: (images: StockImage[]) => Promise<boolean>;
}

export const ExitSection: React.FC<ExitSectionProps> = ({
  selectedStock,
  resultImages,
  resultLoading,
  selectedResultImage,
  setSelectedResultImage,
  uploadResultImage,
  onStockUpdated,
  viewOnly = false,
  onImageDeleted,
  // Multi-select props
  selectedImages = [],
  toggleImageSelection,
  deleteImages
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectionMode, setSelectionMode] = useState(false);

  const handleImageClick = (image: StockImage) => {
    if (!selectionMode) {
      // Find the index of the clicked image
      const index = resultImages.findIndex(img => img.id === image.id);
      if (index !== -1) {
        setCurrentImageIndex(index);
        setModalOpen(true);
      }
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % resultImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + resultImages.length) % resultImages.length);
  };

  const toggleSelectionMode = () => {
    if (selectionMode && selectedImages.length > 0) {
      // Clear selected images when exiting selection mode
      setSelectionMode(false);
    } else {
      setSelectionMode(!selectionMode);
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Stock Exit</CardTitle>
        <CardDescription>Trading result</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {viewOnly ? (
          <div className="space-y-4">
            {selectedStock ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Exit Price</h3>
                    <p className="font-medium">${selectedStock.exitPrice?.toFixed(2) || "Not exited"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Exit Date</h3>
                    <p className="font-medium">{selectedStock.exitDate?.toLocaleDateString() || "Not exited"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Exit Time</h3>
                    <p className="font-medium">{selectedStock.exitTime || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Success Status</h3>
                    <p className="font-medium">
                      {selectedStock.successStatus !== undefined ? 
                        (selectedStock.successStatus ? "Success" : "Failure") : 
                        (selectedStock.profitLossPercentage && selectedStock.profitLossPercentage > 0 ? "Success" : "Failure")}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                Select a stock to view details
              </div>
            )}
          </div>
        ) : (
          <StockExitForm 
            selectedStock={selectedStock} 
            onStockUpdated={onStockUpdated}
          />
        )}
        
        <div className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Result Images</h3>
            
            {!viewOnly && resultImages.length > 0 && (
              <Button 
                variant={selectionMode ? "default" : "outline"} 
                size="sm"
                onClick={toggleSelectionMode}
              >
                {selectionMode ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Select
                  </>
                )}
              </Button>
            )}
          </div>
          
          {resultLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          ) : (
            <StockImageCarousel 
              images={resultImages} 
              selectedImage={selectedResultImage}
              onSelectImage={(image) => {
                setSelectedResultImage(image);
                handleImageClick(image);
              }}
              viewOnly={viewOnly}
              onImageDeleted={onImageDeleted}
              // Multi-select props
              selectedImages={selectionMode ? selectedImages : []}
              onToggleImageSelection={selectionMode && toggleImageSelection ? toggleImageSelection : undefined}
              onDeleteSelectedImages={selectionMode && deleteImages ? deleteImages : undefined}
            />
          )}
        </div>
      </CardContent>
      {!viewOnly && (
        <CardFooter>
          <StockImageUploader
            onUpload={uploadResultImage}
            maxImages={5}
            currentCount={resultImages.length}
            disabled={!selectedStock}
            multiple={true}
          />
        </CardFooter>
      )}

      {/* Image Modal for Result Images */}
      {resultImages.length > 0 && (
        <ImageModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          imageUrl={resultImages[currentImageIndex]?.url || ''}
          alt={resultImages[currentImageIndex]?.description || `Result Image ${currentImageIndex + 1}`}
          hasMultipleImages={resultImages.length > 1}
          onNextImage={handleNextImage}
          onPrevImage={handlePrevImage}
          currentIndex={currentImageIndex}
          totalImages={resultImages.length}
        />
      )}
    </Card>
  );
};
