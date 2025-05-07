
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Maximize2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { StockImage } from "../../types";

interface ImageViewerProps {
  image: StockImage;
  index: number;
  selectable?: boolean;
  isMultiSelected?: boolean;
  onToggleSelection?: () => void;
  onImageClick: (e: React.MouseEvent) => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  image,
  index,
  selectable = false,
  isMultiSelected = false,
  onToggleSelection,
  onImageClick,
}) => {
  return (
    <div className="relative">
      {/* Selection checkbox for multi-select */}
      {selectable && onToggleSelection && (
        <div 
          className="absolute top-1 left-1 z-10 p-1 rounded-md bg-background/80"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelection();
          }}
        >
          <Checkbox 
            checked={isMultiSelected}
            className="h-4 w-4 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
          />
        </div>
      )}
      
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <img
          src={image.url}
          alt={image.description || `${image.type} image ${index + 1}`}
          className="object-cover w-full h-full rounded-sm cursor-pointer"
          onClick={onImageClick}
        />
      </AspectRatio>
      
      {/* Enlarge button overlay if not in selection mode */}
      {!selectable && (
        <button
          onClick={onImageClick}
          className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
          aria-label="Enlarge image"
        >
          <Maximize2 size={14} />
        </button>
      )}
    </div>
  );
};
