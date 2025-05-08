
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface MaxImagesWarningProps {
  visible: boolean;
  maxImages: number;
}

const MaxImagesWarning: React.FC<MaxImagesWarningProps> = ({ visible, maxImages }) => {
  if (!visible) return null;
  
  return (
    <Alert variant="warning" className="mt-2">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        You've reached the maximum of {maxImages} images. Please remove some images before uploading more.
      </AlertDescription>
    </Alert>
  );
};

export default MaxImagesWarning;
