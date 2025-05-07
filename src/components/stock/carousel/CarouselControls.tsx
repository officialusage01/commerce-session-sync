
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { StockImage } from "../types";

interface CarouselControlsProps {
  selectionModeEnabled: boolean;
  selectedImages: StockImage[];
  onSelectAll?: () => void;
  allSelected: boolean;
  onToggleImageSelection?: (image: StockImage) => void;
  images: StockImage[];
  isDeleting: boolean;
  handleDeleteSelectedImages: () => Promise<void>;
}

export const CarouselControls: React.FC<CarouselControlsProps> = ({
  selectionModeEnabled,
  selectedImages,
  onSelectAll,
  allSelected,
  onToggleImageSelection,
  images,
  isDeleting,
  handleDeleteSelectedImages,
}) => {
  const hasSelectedImages = selectedImages.length > 0;

  if (!selectionModeEnabled) return null;

  return (
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        {onSelectAll && (
          <div className="flex items-center gap-1.5">
            <Checkbox 
              id="select-all" 
              checked={allSelected && images.length > 0} 
              onCheckedChange={onSelectAll} 
              className="h-4 w-4 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white"
            />
            <label htmlFor="select-all" className="text-xs cursor-pointer">
              Select All
            </label>
          </div>
        )}
        
        {hasSelectedImages && (
          <span className="text-xs text-muted-foreground ml-2">
            {selectedImages.length} selected
          </span>
        )}
      </div>
      
      <div className="flex gap-1.5">
        {hasSelectedImages && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteSelectedImages}
            disabled={isDeleting}
            className="h-7 px-2 text-xs"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        )}
        
        {selectionModeEnabled && onToggleImageSelection && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleImageSelection && images.length > 0 ? onToggleImageSelection(images[0]) : undefined}
            className="h-7 px-2 text-xs"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};
