
import React from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { StockImage } from "../types";
import { CarouselImage } from "./CarouselImage";

interface CarouselContentProps {
  images: StockImage[];
  selectedImage: StockImage | null;
  onSelectImage: (image: StockImage) => void;
  viewOnly: boolean;
  onImageDeleted?: () => void;
  handleImageClick: (image: StockImage, index: number) => void;
  selectionModeEnabled: boolean;
  selectedImages: StockImage[];
  onToggleImageSelection?: (image: StockImage) => void;
}

export const StockCarouselContent: React.FC<CarouselContentProps> = ({
  images,
  selectedImage,
  onSelectImage,
  viewOnly,
  onImageDeleted,
  handleImageClick,
  selectionModeEnabled,
  selectedImages,
  onToggleImageSelection
}) => {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={image.id}>
            <CarouselImage 
              image={image}
              index={index}
              isSelected={selectedImage?.id === image.id}
              onSelect={onSelectImage}
              openDialog={false}
              setOpenDialog={() => {}}
              viewOnly={viewOnly}
              onImageDeleted={onImageDeleted}
              onImageClick={() => handleImageClick(image, index)}
              // Multi-select props
              selectable={selectionModeEnabled}
              isMultiSelected={selectedImages.some(img => img.id === image.id)}
              onToggleSelection={onToggleImageSelection ? () => onToggleImageSelection(image) : undefined}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-1" />
      <CarouselNext className="right-1" />
    </Carousel>
  );
};
