
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardDescription, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StockEntryForm } from "../form/StockEntryForm";
import { StockImageUploader } from "../StockImageUploader";
import { StockImageCarousel } from "../StockImageCarousel";
import { StockData, StockImage } from "../types";
import { ImageModal } from "@/components/ui/image-modal";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface EntrySectionProps {
  selectedStock: StockData | null;
  analysisImages: StockImage[];
  analysisLoading: boolean;
  selectedAnalysisImage: StockImage | null;
  setSelectedAnalysisImage: (image: StockImage | null) => void;
  uploadAnalysisImage: (file: File | File[]) => Promise<void>;
  onStockCreated: (stock: StockData) => void;
  viewOnly?: boolean;
  onImageDeleted?: () => void;
  // Multi-select props
  selectedImages?: StockImage[];
  toggleImageSelection?: (image: StockImage) => void;
  deleteImages?: (images: StockImage[]) => Promise<boolean>;
}

export const EntrySection: React.FC<EntrySectionProps> = ({
  selectedStock,
  analysisImages,
  analysisLoading,
  selectedAnalysisImage,
  setSelectedAnalysisImage,
  uploadAnalysisImage,
  onStockCreated,
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
      const index = analysisImages.findIndex(img => img.id === image.id);
      if (index !== -1) {
        setCurrentImageIndex(index);
        setModalOpen(true);
      }
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % analysisImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + analysisImages.length) % analysisImages.length);
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
        <CardTitle>Stock Entry</CardTitle>
        <CardDescription>Trading setup</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {viewOnly ? (
          <div className="space-y-4">
            {selectedStock ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Stock Name</h3>
                    <p className="font-medium">{selectedStock.stockName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Entry Price</h3>
                    <p className="font-medium">${selectedStock.entryPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Entry Date</h3>
                    <p className="font-medium">{selectedStock.entryDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Entry Time</h3>
                    <p className="font-medium">{selectedStock.entryTime || "N/A"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Quantity</h3>
                    <p className="font-medium">{selectedStock.quantity}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Stop Loss</h3>
                    <p className="font-medium">${selectedStock.stopLossPrice?.toFixed(2) || "Not set"}</p>
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
          <StockEntryForm 
            selectedStock={selectedStock} 
            onStockCreated={onStockCreated}
          />
        )}
        
        <div className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Analysis Images</h3>
            
            {!viewOnly && analysisImages.length > 0 && (
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
          
          {analysisLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
          ) : (
            <StockImageCarousel 
              images={analysisImages} 
              selectedImage={selectedAnalysisImage}
              onSelectImage={(image) => {
                setSelectedAnalysisImage(image);
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
            onUpload={uploadAnalysisImage}
            maxImages={5}
            currentCount={analysisImages.length}
            disabled={!selectedStock}
            multiple={true}
          />
        </CardFooter>
      )}

      {/* Image Modal for Analysis Images */}
      {analysisImages.length > 0 && (
        <ImageModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          imageUrl={analysisImages[currentImageIndex]?.url || ''}
          alt={analysisImages[currentImageIndex]?.description || `Analysis Image ${currentImageIndex + 1}`}
          hasMultipleImages={analysisImages.length > 1}
          onNextImage={handleNextImage}
          onPrevImage={handlePrevImage}
          currentIndex={currentImageIndex}
          totalImages={analysisImages.length}
        />
      )}
    </Card>
  );
};
