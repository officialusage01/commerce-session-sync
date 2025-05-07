
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  altText = 'Enlarged image'
}) => {
  const [zoom, setZoom] = React.useState(1);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 1));
  };

  const handleReset = () => {
    setZoom(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden bg-black/90 border-none">
        {/* Adding VisuallyHidden DialogTitle to fix accessibility warning */}
        <VisuallyHidden>
          <DialogTitle>Image Preview</DialogTitle>
        </VisuallyHidden>
        
        <div className="relative w-full h-full flex items-center justify-center">
          <div 
            className="overflow-auto max-h-[85vh] max-w-[85vw] relative"
            style={{ cursor: zoom > 1 ? 'move' : 'default' }}
            onClick={handleReset}
          >
            <img 
              src={imageUrl} 
              alt={altText} 
              className="transition-transform duration-200"
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: 'center'
              }}
            />
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="rounded-full" 
              onClick={(e) => {
                e.stopPropagation();
                handleZoomOut();
              }}
              disabled={zoom <= 1}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="rounded-full" 
              onClick={(e) => {
                e.stopPropagation();
                handleZoomIn();
              }}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Only one close button */}
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 bg-background/80 rounded-full p-2 hover:bg-background transition-colors z-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
