
import React from 'react';
import { CloudinaryImage } from '@/lib/supabase/types';
import ImageThumbnail from './ImageThumbnail';

interface ImagesGridProps {
  images: CloudinaryImage[];
  deleting: number | null;
  onRemoveImage: (index: number) => void;
  onViewImage: (url: string) => void;
}

const ImagesGrid: React.FC<ImagesGridProps> = ({ 
  images, 
  deleting, 
  onRemoveImage, 
  onViewImage 
}) => {
  if (images.length === 0) return null;
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <ImageThumbnail
          key={index}
          url={image.url}
          index={index}
          totalImages={images.length}
          deleting={deleting === index}
          onRemove={() => onRemoveImage(index)}
          onView={() => onViewImage(image.url)}
        />
      ))}
    </div>
  );
};

export default ImagesGrid;
