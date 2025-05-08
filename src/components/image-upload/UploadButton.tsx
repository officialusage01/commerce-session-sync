
import React, { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface UploadButtonProps {
  uploading: boolean;
  disabled: boolean;
  multiple: boolean;
  onClick: () => void;
}

const UploadButton = forwardRef<HTMLInputElement, UploadButtonProps>(
  ({ uploading, disabled, multiple, onClick }, ref) => {
    return (
      <>
        <Input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          disabled={uploading || disabled}
          ref={ref}
        />
        
        <Button 
          type="button" 
          variant="outline" 
          disabled={uploading || disabled}
          size="sm"
          onClick={onClick}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image{multiple ? "s" : ""}
            </>
          )}
        </Button>
      </>
    );
  }
);

UploadButton.displayName = 'UploadButton';

export default UploadButton;
