
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface EmptyImagesStateProps {
  maxImages: number;
}

const EmptyImagesState: React.FC<EmptyImagesStateProps> = ({ maxImages }) => {
  return (
    <div className="border border-dashed rounded-lg p-8 text-center">
      <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">
        No images uploaded yet
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        You can upload up to {maxImages} images
      </p>
    </div>
  );
};

export default EmptyImagesState;
