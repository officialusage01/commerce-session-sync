import { useState, useEffect, useCallback } from 'react';
import { StockImage } from '@/components/stock/types';
import { uploadStockImage, getStockImages, deleteStockImage } from '@/services/stockImages';

export function useStockImages(stockId: string | null, type: 'analysis' | 'result', maxImages: number = 5) {
  const [images, setImages] = useState<StockImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<StockImage | null>(null);
  const [selectedImages, setSelectedImages] = useState<StockImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    if (!stockId) return;
    
    setLoading(true);
    try {
      const stockImages = await getStockImages(stockId, type);
      // Sort images by created date to maintain upload order (oldest first)
      const sortedImages = stockImages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      setImages(sortedImages);
      
      if (sortedImages.length > 0 && !selectedImage) {
        setSelectedImage(sortedImages[0]);
      } else if (sortedImages.length === 0) {
        setSelectedImage(null);
      }
      
      // Clear selected images when refetching
      setSelectedImages([]);
    } catch (err) {
      console.error(`Error fetching ${type} images:`, err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [stockId, type, selectedImage]);

  // Fetch images when stockId changes
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Refetch images function
  const refetch = useCallback(() => {
    fetchImages();
  }, [fetchImages]);

  // Select all images
  const selectAllImages = useCallback(() => {
    if (selectedImages.length === images.length) {
      // If all are already selected, deselect all
      setSelectedImages([]);
    } else {
      // Otherwise select all (up to 5)
      setSelectedImages(images.slice(0, 5));
    }
  }, [images, selectedImages]);

  // Handle image selection for multi-delete
  const toggleImageSelection = useCallback((image: StockImage) => {
    setSelectedImages(prev => {
      const isSelected = prev.some(img => img.id === image.id);
      
      if (isSelected) {
        return prev.filter(img => img.id !== image.id);
      } else {
        // Limit to 5 selections
        if (prev.length >= 5) return prev;
        return [...prev, image];
      }
    });
  }, []);

  // Clear selected images
  const clearSelectedImages = useCallback(() => {
    setSelectedImages([]);
  }, []);

  // Upload new image(s)
  const uploadImage = async (fileOrFiles: File | File[]): Promise<StockImage | StockImage[] | void> => {
    if (!stockId) {
      throw new Error('No stock selected for image upload');
    }
    
    const files = Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
    
    // Check if uploading these files would exceed the maximum
    if (images.length + files.length > maxImages) {
      throw new Error(`Maximum ${maxImages} images allowed. You can upload ${maxImages - images.length} more.`);
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const uploadPromises = files.map(file => uploadStockImage(file, stockId, type));
      const uploadedImages = await Promise.all(uploadPromises);
      
      // Update state with new images (append at the end to maintain order)
      setImages(prev => [...prev, ...uploadedImages]);
      
      // Select the first uploaded image if none is selected
      if (!selectedImage && uploadedImages.length > 0) {
        setSelectedImage(uploadedImages[0]);
      }
      
      return files.length === 1 ? uploadedImages[0] : uploadedImages;
    } catch (err) {
      console.error(`Error uploading ${type} image(s):`, err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // Delete multiple images
  const deleteImages = async (imagesToDelete: StockImage[]): Promise<boolean> => {
    if (imagesToDelete.length === 0) return true;
    
    setLoading(true);
    setError(null);
    
    try {
      const deletePromises = imagesToDelete.map(image => deleteStockImage(image.id));
      const results = await Promise.all(deletePromises);
      
      // Check if all deletions were successful
      const allSuccessful = results.every(result => result === true);
      
      if (allSuccessful) {
        // Update local state
        const deletedIds = imagesToDelete.map(img => img.id);
        setImages(prev => prev.filter(img => !deletedIds.includes(img.id)));
        
        // Update selected image if it was deleted
        if (selectedImage && deletedIds.includes(selectedImage.id)) {
          const remainingImages = images.filter(img => !deletedIds.includes(img.id));
          setSelectedImage(remainingImages.length > 0 ? remainingImages[0] : null);
        }
        
        // Clear selected images
        setSelectedImages([]);
      }
      
      return allSuccessful;
    } catch (err) {
      console.error(`Error deleting ${type} images:`, err);
      setError(err instanceof Error ? err.message : String(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { 
    images, 
    uploadImage, 
    selectedImage, 
    setSelectedImage, 
    loading, 
    error,
    refetch,
    // Multi-select features
    selectedImages,
    toggleImageSelection,
    clearSelectedImages,
    deleteImages,
    // New select all function
    selectAllImages,
    // Helper to check if all are selected
    allSelected: images.length > 0 && selectedImages.length === images.length
  };
}
