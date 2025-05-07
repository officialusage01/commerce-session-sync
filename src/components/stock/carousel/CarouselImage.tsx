
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StockImage } from "../types";
import { deleteStockImage } from "@/services/stockImages";
import { toast } from "sonner";
import { ImageModal } from "@/components/ui/image-modal";
import { ImageViewer, ImageDescription } from "./components";

interface CarouselImageProps {
  image: StockImage;
  index: number;
  isSelected: boolean;
  onSelect: (image: StockImage) => void;
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  viewOnly?: boolean;
  onImageDeleted?: () => void;
  onImageClick?: () => void;
  // Multi-select props
  selectable?: boolean;
  isMultiSelected?: boolean;
  onToggleSelection?: () => void;
}

export const CarouselImage: React.FC<CarouselImageProps> = ({
  image,
  index,
  isSelected,
  onSelect,
  openDialog,
  setOpenDialog,
  viewOnly = false,
  onImageDeleted,
  onImageClick,
  // Multi-select props
  selectable = false,
  isMultiSelected = false,
  onToggleSelection
}) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (selectable && onToggleSelection) {
      onToggleSelection();
    } else if (onImageClick) {
      onImageClick();
    } else {
      onSelect(image);
      setImageModalOpen(true);
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        const success = await deleteStockImage(image.id);
        if (success) {
          toast.success("Image deleted successfully");
          if (onImageDeleted) {
            onImageDeleted();
          }
        } else {
          toast.error("Failed to delete image");
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Failed to delete image");
      }
    }
  };

  return (
    <>
      <Card
        className={`cursor-pointer overflow-hidden transition-all ${
          isSelected ? "ring-2 ring-primary" : ""
        } ${isMultiSelected ? "ring-2 ring-blue-500" : ""}`}
        onClick={handleImageClick}
      >
        <CardContent className="p-1 relative">
          <ImageViewer 
            image={image}
            index={index}
            selectable={selectable}
            isMultiSelected={isMultiSelected}
            onToggleSelection={onToggleSelection}
            onImageClick={handleImageClick}
          />
          
          <ImageDescription 
            image={image}
            index={index}
            viewOnly={viewOnly}
            selectable={selectable}
            onDeleteClick={handleDeleteClick}
          />
        </CardContent>
      </Card>

      {/* Only render this modal if onImageClick is not provided (to avoid duplicate modals) */}
      {!onImageClick && (
        <ImageModal
          open={imageModalOpen}
          onOpenChange={setImageModalOpen}
          imageUrl={image.url}
          alt={image.description || `${image.type} image ${index + 1}`}
        />
      )}
    </>
  );
};
