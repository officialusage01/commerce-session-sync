
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';

interface ImageThumbnailProps {
  url: string;
  index: number;
  totalImages: number;
  deleting: boolean;
  onRemove: () => void;
  onView: () => void;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
  url,
  index,
  totalImages,
  deleting,
  onRemove,
  onView
}) => {
  return (
    <Card className="relative overflow-hidden aspect-square group">
      <img 
        src={url} 
        alt={`Product image ${index + 1}`} 
        className="w-full h-full object-cover cursor-pointer"
        onClick={onView}
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
          disabled={deleting}
          className="transform scale-90 group-hover:scale-100 transition-transform"
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <X className="h-4 w-4 mr-1" />
              Remove
            </>
          )}
        </Button>
      </div>
      <span className="absolute bottom-1 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
        {index + 1}/{totalImages}
      </span>
    </Card>
  );
};

export default ImageThumbnail;
