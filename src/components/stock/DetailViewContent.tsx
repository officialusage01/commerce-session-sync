
import React, { useEffect, useState, useCallback } from "react";
import { StockData, PerformanceData } from "./types";
import { StockPerformance } from "./StockPerformance";
import { useStockImages } from "@/hooks/useStockImages";
import { TradeDetailsCard } from "./detail-view/TradeDetailsCard";
import { EntrySection } from "./detail-view/EntrySection";
import { ExitSection } from "./detail-view/ExitSection";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { GenericStockManager } from "./GenericStockManager";

interface DetailViewContentProps {
  selectedStock: StockData | null;
  performanceData: PerformanceData;
  stocks: StockData[];
  onStockCreated: (stock: StockData) => void;
  onStockUpdated: (stock: StockData) => void;
  updatePerformanceData: (stock: StockData) => void;
  viewOnly?: boolean;
}

export const DetailViewContent: React.FC<DetailViewContentProps> = ({
  selectedStock,
  performanceData,
  stocks,
  onStockCreated,
  onStockUpdated,
  updatePerformanceData,
  viewOnly = false
}) => {
  // Local state for performance data when in Performance tab view-only mode
  const [localPerformanceData, setLocalPerformanceData] = useState<PerformanceData | null>(null);

  // Update performance data when selectedStock changes
  useEffect(() => {
    if (selectedStock) {
      if (viewOnly) {
        // Generate performance data from the stock in view-only mode
        const exitDate = selectedStock.exitDate || new Date();
        const exitPrice = selectedStock.exitPrice || 0;
        const profitLoss = ((exitPrice - selectedStock.entryPrice) / selectedStock.entryPrice) * 100;
        
        setLocalPerformanceData({
          stockName: selectedStock.stockName,
          entryDate: selectedStock.entryDate,
          exitDate: exitDate,
          entryPrice: selectedStock.entryPrice,
          exitPrice: exitPrice,
          profitLossPercentage: profitLoss,
          isProfitable: profitLoss > 0
        });
      } else {
        // Use the updatePerformanceData function provided by parent
        updatePerformanceData(selectedStock);
      }
    }
  }, [selectedStock, updatePerformanceData, viewOnly]);

  // Stock image hooks with multi-selection support
  const { 
    images: analysisImages, 
    uploadImage: uploadAnalysisImage, 
    selectedImage: selectedAnalysisImage,
    setSelectedImage: setSelectedAnalysisImage,
    loading: analysisLoading,
    refetch: refetchAnalysisImages,
    // Multi-select features
    selectedImages: selectedAnalysisImagesForDelete,
    toggleImageSelection: toggleAnalysisImageSelection,
    deleteImages: deleteAnalysisImages
  } = useStockImages(selectedStock?.id || null, "analysis", 5);
  
  const { 
    images: resultImages, 
    uploadImage: uploadResultImage, 
    selectedImage: selectedResultImage,
    setSelectedImage: setSelectedResultImage,
    loading: resultLoading,
    refetch: refetchResultImages,
    // Multi-select features
    selectedImages: selectedResultImagesForDelete,
    toggleImageSelection: toggleResultImageSelection,
    deleteImages: deleteResultImages
  } = useStockImages(selectedStock?.id || null, "result", 5);

  // Define wrapped functions to ensure proper typing
  const handleUploadAnalysisImage = async (fileOrFiles: File | File[]): Promise<void> => {
    await uploadAnalysisImage(fileOrFiles);
  };
  
  const handleUploadResultImage = async (fileOrFiles: File | File[]): Promise<void> => {
    await uploadResultImage(fileOrFiles);
  };

  const handleAnalysisImageDeleted = useCallback(() => {
    refetchAnalysisImages();
  }, [refetchAnalysisImages]);

  const handleResultImageDeleted = useCallback(() => {
    refetchResultImages();
  }, [refetchResultImages]);

  // Always show the TradeDetailsCard when there are multiple stocks, regardless of viewOnly mode
  if (stocks.length > 1) {
    return <TradeDetailsCard stocks={stocks} selectedDate={selectedStock?.entryDate?.toISOString() || null} />;
  }

  // Determine which performance data to use
  const displayPerformanceData = viewOnly && localPerformanceData ? localPerformanceData : performanceData;

  // Check if we have a valid performance data object
  const hasValidPerformanceData = selectedStock && (
    (viewOnly && localPerformanceData) || 
    (!viewOnly && performanceData && performanceData.stockName !== "Select or add a stock")
  );

  // Original detailed view for single stock
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <EntrySection
        selectedStock={selectedStock}
        analysisImages={analysisImages}
        analysisLoading={analysisLoading}
        selectedAnalysisImage={selectedAnalysisImage}
        setSelectedAnalysisImage={setSelectedAnalysisImage}
        uploadAnalysisImage={handleUploadAnalysisImage}
        onStockCreated={(stock) => {
          onStockCreated(stock);
          updatePerformanceData(stock);
        }}
        viewOnly={viewOnly}
        onImageDeleted={handleAnalysisImageDeleted}
        // Multi-select props
        selectedImages={selectedAnalysisImagesForDelete}
        toggleImageSelection={toggleAnalysisImageSelection}
        deleteImages={deleteAnalysisImages}
      />
      
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Performance</CardTitle>
          <CardDescription>Trading results</CardDescription>
        </CardHeader>
        <CardContent>
          {hasValidPerformanceData ? (
            <StockPerformance data={displayPerformanceData} />
          ) : selectedStock ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading performance data...
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Select a stock to view performance
            </div>
          )}
        </CardContent>
      </Card>
      
      <ExitSection
        selectedStock={selectedStock}
        resultImages={resultImages}
        resultLoading={resultLoading}
        selectedResultImage={selectedResultImage}
        setSelectedResultImage={setSelectedResultImage}
        uploadResultImage={handleUploadResultImage}
        onStockUpdated={(stock) => {
          onStockUpdated(stock);
          updatePerformanceData(stock);
        }}
        viewOnly={viewOnly}
        onImageDeleted={handleResultImageDeleted}
        // Multi-select props
        selectedImages={selectedResultImagesForDelete}
        toggleImageSelection={toggleResultImageSelection}
        deleteImages={deleteResultImages}
      />
    </div>
  );
};
