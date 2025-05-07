
import React from "react";
import { StockImage } from "../types";

interface ImageCounterProps {
  selectedImage: StockImage | null;
  images: StockImage[];
}

export const ImageCounter: React.FC<ImageCounterProps> = ({ selectedImage, images }) => {
  if (!selectedImage) return null;

  const currentIndex = images.findIndex(img => img.id === selectedImage.id);
  const displayIndex = currentIndex !== -1 ? currentIndex + 1 : 0;

  return (
    <div className="text-xs flex flex-col items-center">
      <div className="flex items-center justify-center mb-1">
        <span className="font-medium">{displayIndex}</span>
        <span className="mx-1">/</span>
        <span>{images.length}</span>
      </div>
      {selectedImage.description && (
        <p className="text-center text-muted-foreground max-w-full truncate px-2">
          {selectedImage.description}
        </p>
      )}
    </div>
  );
};
