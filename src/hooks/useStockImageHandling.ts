
import { useStockImages } from './useStockImages';
import { StockImage } from '@/components/stock/types';

export function useStockImageHandling(stockId: string | null) {
  // Use the enhanced useStockImages hook for analysis images
  const { 
    images: analysisImages, 
    uploadImage: uploadAnalysisImage, 
    selectedImage: selectedAnalysisImage,
    setSelectedImage: setSelectedAnalysisImage,
    loading: analysisLoading,
    refetch: refetchAnalysisImages,
    selectedImages: selectedAnalysisImagesForDelete,
    toggleImageSelection: toggleAnalysisImageSelection,
    clearSelectedImages: clearSelectedAnalysisImages,
    deleteImages: deleteAnalysisImages,
    selectAllImages: selectAllAnalysisImages,
    allSelected: allAnalysisImagesSelected
  } = useStockImages(stockId, "analysis", 5);
  
  // Use the enhanced useStockImages hook for result images
  const { 
    images: resultImages, 
    uploadImage: uploadResultImage, 
    selectedImage: selectedResultImage,
    setSelectedImage: setSelectedResultImage,
    loading: resultLoading,
    refetch: refetchResultImages,
    selectedImages: selectedResultImagesForDelete,
    toggleImageSelection: toggleResultImageSelection,
    clearSelectedImages: clearSelectedResultImages,
    deleteImages: deleteResultImages,
    selectAllImages: selectAllResultImages,
    allSelected: allResultImagesSelected
  } = useStockImages(stockId, "result", 5);

  // Create wrapper functions to ensure Promise<void> return type
  const handleAnalysisImageUpload = (fileOrFiles: File | File[]): Promise<void> => {
    return uploadAnalysisImage(fileOrFiles).then(() => {
      return;
    });
  };
  
  const handleResultImageUpload = (fileOrFiles: File | File[]): Promise<void> => {
    return uploadResultImage(fileOrFiles).then(() => {
      return;
    });
  };

  return {
    // Analysis images
    analysisImages,
    selectedAnalysisImage,
    setSelectedAnalysisImage,
    analysisLoading,
    uploadAnalysisImage: handleAnalysisImageUpload,
    refetchAnalysisImages,
    
    // Result images
    resultImages,
    selectedResultImage,
    setSelectedResultImage,
    resultLoading,
    uploadResultImage: handleResultImageUpload,
    refetchResultImages,
    
    // Multi-select features for analysis images
    selectedAnalysisImagesForDelete,
    toggleAnalysisImageSelection,
    clearSelectedAnalysisImages,
    deleteAnalysisImages,
    selectAllAnalysisImages,
    allAnalysisImagesSelected,
    
    // Multi-select features for result images
    selectedResultImagesForDelete,
    toggleResultImageSelection,
    clearSelectedResultImages,
    deleteResultImages,
    selectAllResultImages,
    allResultImagesSelected
  };
}
