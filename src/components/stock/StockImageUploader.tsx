
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { StockImage } from "./types";
import { Progress } from "@/components/ui/progress";

interface StockImageUploaderProps {
  onUpload: (files: File | File[]) => Promise<void | StockImage | StockImage[]>;
  maxImages: number;
  currentCount: number;
  disabled?: boolean;
  multiple?: boolean;
}

export const StockImageUploader: React.FC<StockImageUploaderProps> = ({
  onUpload,
  maxImages,
  currentCount,
  disabled = false,
  multiple = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    // Check if adding these files would exceed the maximum
    if (currentCount + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed. You can upload ${maxImages - currentCount} more.`);
      return;
    }
    
    // Convert FileList to array and validate each file
    const fileArray: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error(`File "${file.name}" is not an image.`);
        continue;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds 5MB size limit.`);
        continue;
      }
      
      fileArray.push(file);
    }
    
    // Update selected files
    if (fileArray.length > 0) {
      setSelectedFiles(fileArray);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      setUploading(true);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const increment = 90 / (selectedFiles.length * 2); // Slower progress for multiple files
          const newProgress = prev + increment;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      
      // Upload single file or multiple files based on the selectedFiles array
      if (multiple) {
        await onUpload(selectedFiles);
      } else {
        await onUpload(selectedFiles[0]);
      }
      
      // Complete progress
      clearInterval(progressInterval);
      setProgress(100);
      toast.success(`${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''} uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image(s).');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
        clearSelectedFiles();
      }, 800);
    }
  };

  const remainingSlots = maxImages - currentCount;

  return (
    <div className="w-full space-y-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        multiple={multiple}
      />
      
      {uploading ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm">Uploading {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''}...</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      ) : selectedFiles.length > 0 ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center text-xs bg-muted p-1 rounded">
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button 
                  onClick={() => {
                    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                  }}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleUpload} 
              disabled={uploading || selectedFiles.length === 0 || disabled}
              className="w-full"
              variant="default"
              size="sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
            </Button>
            <Button 
              onClick={clearSelectedFiles}
              variant="outline" 
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          onClick={handleUploadClick} 
          disabled={uploading || remainingSlots <= 0 || disabled}
          className="w-full"
          variant="outline"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Image{multiple ? 's' : ''}
        </Button>
      )}
      
      <p className="text-xs text-center mt-2 text-muted-foreground">
        {currentCount} of {maxImages} images used ({remainingSlots} remaining)
      </p>
      {disabled && !uploading && (
        <p className="text-xs text-center text-muted-foreground mt-1">
          Select or create a stock to upload images
        </p>
      )}
    </div>
  );
};
