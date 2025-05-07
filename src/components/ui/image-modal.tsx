
import React, { useRef, useEffect } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogTitle 
} from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  alt?: string;
  hasMultipleImages?: boolean;
  onNextImage?: () => void;
  onPrevImage?: () => void;
  currentIndex?: number;
  totalImages?: number;
}

export function ImageModal({ 
  open, 
  onOpenChange, 
  imageUrl, 
  alt = "Image",
  hasMultipleImages = false,
  onNextImage,
  onPrevImage,
  currentIndex = 0,
  totalImages = 0
}: ImageModalProps) {
  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      } else if (hasMultipleImages) {
        if (e.key === "ArrowRight" && onNextImage) {
          e.preventDefault();
          onNextImage();
        } else if (e.key === "ArrowLeft" && onPrevImage) {
          e.preventDefault();
          onPrevImage();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange, hasMultipleImages, onNextImage, onPrevImage]);

  // Don't render if no image URL is provided
  if (!imageUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm border-none sm:rounded-lg">
        <VisuallyHidden>
          <DialogTitle>Image Viewer</DialogTitle>
        </VisuallyHidden>
        
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-2 right-2 z-50 rounded-full p-2 bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={imageUrl} 
            alt={alt} 
            className="w-full h-full object-contain rounded"
            style={{ maxHeight: "calc(100vh - 100px)" }}
          />
          
          {/* Carousel Navigation */}
          {hasMultipleImages && onNextImage && onPrevImage && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50 p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onPrevImage) onPrevImage();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-black/30 text-white hover:bg-black/50 p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onNextImage) onNextImage();
                }}
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </Button>
              
              {totalImages > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentIndex + 1} / {totalImages}
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
