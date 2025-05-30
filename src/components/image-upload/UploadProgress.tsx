
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
  uploading: boolean;
  progress: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ uploading, progress }) => {
  if (!uploading) return null;
  
  return (
    <div className="space-y-2">
      <Progress value={progress} className="h-2 w-full" />
      <p className="text-xs text-center text-muted-foreground">
        Uploading... {progress}%
      </p>
    </div>
  );
};

export default UploadProgress;
