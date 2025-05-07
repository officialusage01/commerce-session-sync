
import React from "react";
import { ImageModal } from "@/components/ui/image-modal";
import { StockImage } from "../types";

interface CarouselModalProps {
  images: StockImage[];
  imageModalOpen: boolean;
  setImageModalOpen: (open: boolean) => void;
  activeImageIndex: number;
  handleNextImage: () => void;
  handlePrevImage: () => void;
}

export const CarouselModal: React.FC<CarouselModalProps> = ({
  images,
  imageModalOpen,
  setImageModalOpen,
  activeImageIndex,
  handleNextImage,
  handlePrevImage
}) => {
  if (images.length === 0) return null;

  return (
    <ImageModal
      open={imageModalOpen}
      onOpenChange={setImageModalOpen}
      imageUrl={images[activeImageIndex]?.url || ''}
      alt={images[activeImageIndex]?.description || `Image ${activeImageIndex + 1}`}
      hasMultipleImages={images.length > 1}
      onNextImage={handleNextImage}
      onPrevImage={handlePrevImage}
      currentIndex={activeImageIndex}
      totalImages={images.length}
    />
  );
};
