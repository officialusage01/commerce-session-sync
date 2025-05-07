
import React, { useState } from "react";
import { StockImage } from "./types";
import { EmptyState } from "./carousel/EmptyState";
import { ImageCounter } from "./carousel/ImageCounter";
import { toast } from "sonner";
import { StockCarouselContent } from "./carousel/CarouselContent";
import { CarouselControls } from "./carousel/CarouselControls";
import { CarouselModal } from "./carousel/ImageModal";

interface StockImageCarouselProps {
  images: StockImage[];
  selectedImage: StockImage | null;
  onSelectImage: (image: StockImage) => void;
  viewOnly?: boolean;
  onImageDeleted?: () => void;
  // Multi-select props
  selectedImages?: StockImage[];
  onToggleImageSelection?: (image: StockImage) => void;
  onDeleteSelectedImages?: (images: StockImage[]) => Promise<boolean>;
  onSelectAll?: () => void;
  allSelected?: boolean;
}

export const StockImageCarousel: React.FC<StockImageCarouselProps> = ({
  images,
  selectedImage,
  onSelectImage,
  viewOnly = false,
  onImageDeleted,
  // Multi-select props
  selectedImages = [],
  onToggleImageSelection,
  onDeleteSelectedImages,
  onSelectAll,
  allSelected = false
}) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectionModeEnabled = !viewOnly && !!onToggleImageSelection;

  if (images.length === 0) {
    return <EmptyState />;
  }

  const handleImageClick = (image: StockImage, index: number) => {
    if (selectionModeEnabled && onToggleImageSelection) {
      onToggleImageSelection(image);
    } else {
      onSelectImage(image);
      setActiveImageIndex(index);
      setImageModalOpen(true);
    }
  };

  const handleNextImage = () => {
    const nextIndex = (activeImageIndex + 1) % images.length;
    setActiveImageIndex(nextIndex);
    onSelectImage(images[nextIndex]);
  };

  const handlePrevImage = () => {
    const prevIndex = (activeImageIndex - 1 + images.length) % images.length;
    setActiveImageIndex(prevIndex);
    onSelectImage(images[prevIndex]);
  };

  const handleDeleteSelectedImages = async () => {
    if (!onDeleteSelectedImages || selectedImages.length === 0) return;
    
    try {
      setIsDeleting(true);
      
      const confirmed = window.confirm(
        `Are you sure you want to delete ${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''}?`
      );
      
      if (!confirmed) {
        setIsDeleting(false);
        return;
      }
      
      const success = await onDeleteSelectedImages(selectedImages);
      
      if (success) {
        toast.success(`${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} deleted successfully!`);
        if (onImageDeleted) {
          onImageDeleted();
        }
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
    <div className="space-y-2">
      <CarouselControls
        selectionModeEnabled={selectionModeEnabled}
        selectedImages={selectedImages}
        onSelectAll={onSelectAll}
        allSelected={allSelected}
        onToggleImageSelection={onToggleImageSelection}
        images={images}
        isDeleting={isDeleting}
        handleDeleteSelectedImages={handleDeleteSelectedImages}
      />
      
      <StockCarouselContent
        images={images}
        selectedImage={selectedImage}
        onSelectImage={onSelectImage}
        viewOnly={viewOnly}
        onImageDeleted={onImageDeleted}
        handleImageClick={handleImageClick}
        selectionModeEnabled={selectionModeEnabled}
        selectedImages={selectedImages}
        onToggleImageSelection={onToggleImageSelection}
      />
      
      {selectedImage && (
        <ImageCounter selectedImage={selectedImage} images={images} />
      )}

      <CarouselModal
        images={images}
        imageModalOpen={imageModalOpen}
        setImageModalOpen={setImageModalOpen}
        activeImageIndex={activeImageIndex}
        handleNextImage={handleNextImage}
        handlePrevImage={handlePrevImage}
      />
    </div>
  );
};
