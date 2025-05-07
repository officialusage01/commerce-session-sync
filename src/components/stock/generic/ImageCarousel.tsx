import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { StockImage } from "../types";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { ImageModal } from "@/components/ui/image-modal";
import { Maximize2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ImageCarouselProps {
  images: StockImage[];
  className?: string;
  onImageClick?: (index: number) => void;
  selectable?: boolean;
  selectedImages?: StockImage[];
  onToggleSelect?: (image: StockImage) => void;
  onSelectAll?: () => void;
  allSelected?: boolean;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  images, 
  className,
  onImageClick,
  selectable = false,
  selectedImages = [],
  onToggleSelect,
  onSelectAll,
  allSelected = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  if (images.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No images available</div>;
  }

  const handleImageClick = (index: number, image: StockImage) => {
    if (selectable && onToggleSelect) {
      onToggleSelect(image);
    } else {
      setCurrentImageIndex(index);
      
      if (onImageClick) {
        // Use the callback from parent if provided
        onImageClick(index);
      } else {
        // Otherwise handle it internally
        setModalOpen(true);
      }
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const isSelected = (image: StockImage) => {
    return selectedImages.some(selected => selected.id === image.id);
  };

  return (
    <div className={className}>
      {selectable && onToggleSelect && onSelectAll && (
        <div className="flex items-center gap-2 mb-2">
          <Checkbox 
            id="select-all-generic" 
            checked={allSelected && images.length > 0} 
            onCheckedChange={onSelectAll}
            className="h-4 w-4 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
          />
          <label htmlFor="select-all-generic" className="text-xs cursor-pointer">
            Select All
          </label>
          
          {selectedImages.length > 0 && (
            <span className="text-xs text-muted-foreground ml-1">
              ({selectedImages.length} selected)
            </span>
          )}
        </div>
      )}
      
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id}>
              <Card
                className={`cursor-pointer overflow-hidden transition-all hover:opacity-90 ${
                  isSelected(image) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleImageClick(index, image)}
              >
                <CardContent className="p-1 relative">
                  {selectable && onToggleSelect && (
                    <div 
                      className="absolute top-1 left-1 z-10 p-1 rounded-md bg-background/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSelect(image);
                      }}
                    >
                      <Checkbox 
                        checked={isSelected(image)}
                        className="h-4 w-4 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
                      />
                    </div>
                  )}
                  
                  <AspectRatio ratio={16 / 9} className="bg-muted">
                    <img
                      src={image.url}
                      alt={image.description || `Image ${index + 1}`}
                      className="object-cover w-full h-full rounded-sm cursor-pointer"
                    />
                  </AspectRatio>
                  <div className="p-1 text-xs truncate">
                    {image.description || `Image ${index + 1}`}
                  </div>
                  
                  {/* Enlarge icon overlay if not in selection mode */}
                  {!selectable && (
                    <div 
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(index, image);
                      }}
                    >
                      <Maximize2 size={16} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>

      {/* Only render modal if onImageClick is not provided (prevent duplicate modals) */}
      {!onImageClick && (
        <ImageModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          imageUrl={images[currentImageIndex]?.url || ''}
          alt={images[currentImageIndex]?.description || `Image ${currentImageIndex + 1}`}
          hasMultipleImages={images.length > 1}
          onNextImage={handleNextImage}
          onPrevImage={handlePrevImage}
          currentIndex={currentImageIndex}
          totalImages={images.length}
        />
      )}
    </div>
  );
};
