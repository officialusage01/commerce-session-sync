
import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateImageDescription } from "@/services/stockImages";
import { toast } from "sonner";
import { StockImage } from "../../types";

interface ImageDescriptionProps {
  image: StockImage;
  index: number;
  viewOnly?: boolean;
  selectable?: boolean;
  onDeleteClick: (e: React.MouseEvent) => void;
}

export const ImageDescription: React.FC<ImageDescriptionProps> = ({
  image,
  index,
  viewOnly = false,
  selectable = false,
  onDeleteClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(image.description || "");

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const success = await updateImageDescription(image.id, description);
      if (success) {
        // Update the image object locally
        image.description = description;
        toast.success("Description updated successfully");
      } else {
        toast.error("Failed to update description");
      }
    } catch (error) {
      console.error("Error updating description:", error);
      toast.error("Failed to update description");
    }
    
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form 
        onSubmit={handleSaveDescription}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 flex items-center gap-1"
      >
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="h-7 text-xs bg-transparent text-white"
          autoFocus
        />
        <Button type="submit" size="sm" variant="ghost" className="h-7 px-2 text-white">
          Save
        </Button>
      </form>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 flex justify-between items-center">
      <span className="truncate">
        {image.description || `Image ${index + 1}`}
      </span>
      {!viewOnly && !selectable && (
        <div className="flex gap-1">
          <button 
            onClick={handleEditClick}
            className="p-1 hover:bg-black/30 rounded"
          >
            <Pencil size={12} />
          </button>
          <button 
            onClick={onDeleteClick}
            className="p-1 hover:bg-black/30 text-red-300 hover:text-red-200 rounded"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
};
