
import React, { useState } from "react";
import { StockData, StockImage } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageCarousel } from "../generic/ImageCarousel";
import { ImageModal } from "@/components/ui/image-modal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface StockImagesContainerProps {
  stock: StockData;
  analysisImagesHook: (stockId: string | null, type: 'analysis' | 'result', maxImages?: number) => {
    images: StockImage[];
    selectedImage: StockImage | null;
    setSelectedImage: (image: StockImage | null) => void;
    loading: boolean;
    refetch: () => void;
    selectedImages?: StockImage[];
    toggleImageSelection?: (image: StockImage) => void;
    selectAllImages?: () => void;
    allSelected?: boolean;
    deleteImages?: (images: StockImage[]) => Promise<boolean>;
  };
  resultImagesHook: (stockId: string | null, type: 'analysis' | 'result', maxImages?: number) => {
    images: StockImage[];
    selectedImage: StockImage | null;
    setSelectedImage: (image: StockImage | null) => void;
    loading: boolean;
    refetch: () => void;
    selectedImages?: StockImage[];
    toggleImageSelection?: (image: StockImage) => void;
    selectAllImages?: () => void;
    allSelected?: boolean;
    deleteImages?: (images: StockImage[]) => Promise<boolean>;
  };
  viewOnly?: boolean;
}

export const StockImagesContainer: React.FC<StockImagesContainerProps> = ({ 
  stock, 
  analysisImagesHook, 
  resultImagesHook,
  viewOnly = true
}) => {
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [currentAnalysisImageIndex, setCurrentAnalysisImageIndex] = useState(0);
  const [currentResultImageIndex, setCurrentResultImageIndex] = useState(0);
  const [analysisSelectionEnabled, setAnalysisSelectionEnabled] = useState(false);
  const [resultSelectionEnabled, setResultSelectionEnabled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!analysisImagesHook || !resultImagesHook) return null;

  // Initialize hooks for this stock's images
  const { 
    images: analysisImages, 
    selectedImage: selectedAnalysisImage,
    setSelectedImage: setSelectedAnalysisImage,
    loading: analysisLoading,
    refetch: refetchAnalysisImages,
    selectedImages: selectedAnalysisImages = [],
    toggleImageSelection: toggleAnalysisImageSelection,
    selectAllImages: selectAllAnalysisImages,
    allSelected: allAnalysisImagesSelected,
    deleteImages: deleteAnalysisImages
  } = analysisImagesHook(stock.id, "analysis", 5);
  
  const { 
    images: resultImages, 
    selectedImage: selectedResultImage,
    setSelectedImage: setSelectedResultImage,
    loading: resultLoading,
    refetch: refetchResultImages,
    selectedImages: selectedResultImages = [],
    toggleImageSelection: toggleResultImageSelection,
    selectAllImages: selectAllResultImages,
    allSelected: allResultImagesSelected,
    deleteImages: deleteResultImages
  } = resultImagesHook(stock.id, "result", 5);

  const handleAnalysisImageClick = (index: number) => {
    setCurrentAnalysisImageIndex(index);
    setAnalysisModalOpen(true);
  };

  const handleResultImageClick = (index: number) => {
    setCurrentResultImageIndex(index);
    setResultModalOpen(true);
  };

  const handleAnalysisNextImage = () => {
    setCurrentAnalysisImageIndex((prev) => (prev + 1) % analysisImages.length);
  };

  const handleAnalysisPrevImage = () => {
    setCurrentAnalysisImageIndex((prev) => (prev - 1 + analysisImages.length) % analysisImages.length);
  };

  const handleResultNextImage = () => {
    setCurrentResultImageIndex((prev) => (prev + 1) % resultImages.length);
  };

  const handleResultPrevImage = () => {
    setCurrentResultImageIndex((prev) => (prev - 1 + resultImages.length) % resultImages.length);
  };

  const handleDeleteSelectedAnalysisImages = async () => {
    if (!deleteAnalysisImages || selectedAnalysisImages.length === 0) return;
    
    try {
      setIsDeleting(true);
      
      const confirmed = window.confirm(
        `Are you sure you want to delete ${selectedAnalysisImages.length} image${selectedAnalysisImages.length > 1 ? 's' : ''}?`
      );
      
      if (!confirmed) {
        setIsDeleting(false);
        return;
      }
      
      const success = await deleteAnalysisImages(selectedAnalysisImages);
      
      if (success) {
        toast.success(`${selectedAnalysisImages.length} image${selectedAnalysisImages.length > 1 ? 's' : ''} deleted successfully!`);
        refetchAnalysisImages();
        setAnalysisSelectionEnabled(false);
      } else {
        toast.error("Failed to delete some or all images");
      }
    } catch (error) {
      console.error("Error deleting images:", error);
      toast.error("An error occurred while deleting images");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelectedResultImages = async () => {
    if (!deleteResultImages || selectedResultImages.length === 0) return;
    
    try {
      setIsDeleting(true);
      
      const confirmed = window.confirm(
        `Are you sure you want to delete ${selectedResultImages.length} image${selectedResultImages.length > 1 ? 's' : ''}?`
      );
      
      if (!confirmed) {
        setIsDeleting(false);
        return;
      }
      
      const success = await deleteResultImages(selectedResultImages);
      
      if (success) {
        toast.success(`${selectedResultImages.length} image${selectedResultImages.length > 1 ? 's' : ''} deleted successfully!`);
        refetchResultImages();
        setResultSelectionEnabled(false);
      } else {
        toast.error("Failed to delete some or all images");
      }
    } catch (error) {
      console.error("Error deleting images:", error);
      toast.error("An error occurred while deleting images");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Analysis Images */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Analysis Images</h4>
            
            {!viewOnly && analysisImages.length > 0 && (
              <div className="flex items-center gap-1">
                {analysisSelectionEnabled && selectedAnalysisImages.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteSelectedAnalysisImages}
                    disabled={isDeleting}
                    className="h-7 px-2 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete {selectedAnalysisImages.length}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnalysisSelectionEnabled(!analysisSelectionEnabled)}
                  className="h-7 px-3 text-xs"
                >
                  {analysisSelectionEnabled ? "Cancel" : "Select"}
                </Button>
              </div>
            )}
          </div>
          
          {analysisLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-[150px] w-full rounded-lg" />
            </div>
          ) : analysisImages.length > 0 ? (
            <ImageCarousel 
              images={analysisImages} 
              className="w-full" 
              onImageClick={!analysisSelectionEnabled ? handleAnalysisImageClick : undefined}
              selectable={analysisSelectionEnabled}
              selectedImages={selectedAnalysisImages}
              onToggleSelect={toggleAnalysisImageSelection}
              onSelectAll={selectAllAnalysisImages}
              allSelected={allAnalysisImagesSelected}
            />
          ) : (
            <div className="text-center py-4 text-muted-foreground">No analysis images available</div>
          )}
        </CardContent>
      </Card>
      
      {/* Result Images */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Result Images</h4>
            
            {!viewOnly && resultImages.length > 0 && (
              <div className="flex items-center gap-1">
                {resultSelectionEnabled && selectedResultImages.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteSelectedResultImages}
                    disabled={isDeleting}
                    className="h-7 px-2 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete {selectedResultImages.length}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResultSelectionEnabled(!resultSelectionEnabled)}
                  className="h-7 px-3 text-xs"
                >
                  {resultSelectionEnabled ? "Cancel" : "Select"}
                </Button>
              </div>
            )}
          </div>
          
          {resultLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-[150px] w-full rounded-lg" />
            </div>
          ) : resultImages.length > 0 ? (
            <ImageCarousel 
              images={resultImages} 
              className="w-full" 
              onImageClick={!resultSelectionEnabled ? handleResultImageClick : undefined}
              selectable={resultSelectionEnabled}
              selectedImages={selectedResultImages}
              onToggleSelect={toggleResultImageSelection}
              onSelectAll={selectAllResultImages}
              allSelected={allResultImagesSelected}
            />
          ) : (
            <div className="text-center py-4 text-muted-foreground">No result images available</div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Images Modal */}
      {analysisImages.length > 0 && (
        <ImageModal
          open={analysisModalOpen}
          onOpenChange={setAnalysisModalOpen}
          imageUrl={analysisImages[currentAnalysisImageIndex]?.url || ''}
          alt={analysisImages[currentAnalysisImageIndex]?.description || `Analysis Image ${currentAnalysisImageIndex + 1}`}
          hasMultipleImages={analysisImages.length > 1}
          onNextImage={handleAnalysisNextImage}
          onPrevImage={handleAnalysisPrevImage}
          currentIndex={currentAnalysisImageIndex}
          totalImages={analysisImages.length}
        />
      )}

      {/* Result Images Modal */}
      {resultImages.length > 0 && (
        <ImageModal
          open={resultModalOpen}
          onOpenChange={setResultModalOpen}
          imageUrl={resultImages[currentResultImageIndex]?.url || ''}
          alt={resultImages[currentResultImageIndex]?.description || `Result Image ${currentResultImageIndex + 1}`}
          hasMultipleImages={resultImages.length > 1}
          onNextImage={handleResultNextImage}
          onPrevImage={handleResultPrevImage}
          currentIndex={currentResultImageIndex}
          totalImages={resultImages.length}
        />
      )}
    </div>
  );
};
