
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, X } from 'lucide-react';
import UploadButton from './UploadButton';

interface UploaderHeaderProps {
  imagesCount: number;
  maxImages: number;
  showClearAll: boolean;
  uploading: boolean;
  canUploadMore: boolean;
  multiple: boolean;
  onClearAll: () => void;
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const UploaderHeader: React.FC<UploaderHeaderProps> = ({
  imagesCount,
  maxImages,
  showClearAll,
  uploading,
  canUploadMore,
  multiple,
  onClearAll,
  onUploadClick,
  fileInputRef
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label className="flex items-center">
          Product Images
          <span className="ml-2 text-xs text-muted-foreground">
            ({imagesCount}/{maxImages})
          </span>
        </Label>
        {imagesCount > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Click an image to view it; hover to see delete option
          </p>
        )}
      </div>
      
      <div className="flex gap-2">
        {showClearAll && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onClearAll}
            disabled={uploading}
            className="text-destructive hover:bg-destructive/10"
          >
            {uploading ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <X className="mr-1 h-4 w-4" />
            )}
            Clear All
          </Button>
        )}
        
        <UploadButton
          uploading={uploading}
          disabled={!canUploadMore}
          multiple={multiple}
          onClick={onUploadClick}
          ref={fileInputRef}
        />
      </div>
    </div>
  );
};

export default UploaderHeader;
