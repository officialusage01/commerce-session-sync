import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { uploadImage, deleteImage } from '@/lib/supabase/upload';
import { CloudinaryImage } from '@/lib/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface ImageUploaderProps {
  images: CloudinaryImage[];
  onImagesChange: (images: CloudinaryImage[]) => void;
  multiple?: boolean;
  maxImages?: number;
  productId: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  images, 
  onImagesChange,
  multiple = true,
  maxImages = 10,
  productId
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const canUploadMore = images.length < maxImages;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const totalFiles = files.length;
    const remainingSlots = maxImages - images.length;
    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (totalFiles > remainingSlots) {
      toast({
        title: 'Too many files',
        description: `Only ${remainingSlots} more image${remainingSlots === 1 ? '' : 's'} can be uploaded.`,
        variant: 'destructive',
      });
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const progress = Math.round(((i + 1) / filesToUpload.length) * 100);
        setUploadProgress(progress);

        const imageUrl = await uploadImage(file, productId);
        if (imageUrl) {
          uploadedUrls.push(imageUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        const newImages = uploadedUrls.map(url => ({
          url,
          product_id: productId,
          created_at: new Date().toISOString()
        })) as CloudinaryImage[];
        onImagesChange([...images, ...newImages]);
        toast({
          title: 'Success',
          description: `Successfully uploaded ${uploadedUrls.length} image${uploadedUrls.length === 1 ? '' : 's'}.`,
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while uploading images.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const removeImage = async (index: number) => {
    setDeleting(index);
    try {
      const imageToDelete = images[index];
      const newImages = [...images];
      newImages.splice(index, 1);
      onImagesChange(newImages);

      // Delete from database and Cloudinary
      await deleteImage(imageToDelete.url);
      
      toast({
        title: 'Success',
        description: 'Image removed successfully.',
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while removing the image.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(null);
    }
  };
  
  const clearAllImages = async () => {
    setUploading(true);
    try {
      // Delete all images from database and Cloudinary
      await Promise.all(images.map(image => deleteImage(image.url)));
      onImagesChange([]);
      toast({
        title: 'Success',
        description: 'All images removed successfully.',
      });
    } catch (error) {
      console.error('Error clearing images:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while removing images.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="flex items-center">
            Product Images
            <span className="ml-2 text-xs text-muted-foreground">
              ({images.length}/{maxImages})
            </span>
          </Label>
          {images.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Click an image to view it; hover to see delete option
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          {images.length > 0 && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={clearAllImages}
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
          
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || !canUploadMore}
            multiple={multiple}
            className="hidden"
            id="image-upload"
            ref={fileInputRef}
          />
          <Button 
            type="button" 
            variant="outline" 
            disabled={uploading || !canUploadMore}
            size="sm"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
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
        </div>
      </div>
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2 w-full" />
          <p className="text-xs text-center text-muted-foreground">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
      
      {!canUploadMore && (
        <Alert variant="warning" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You've reached the maximum of {maxImages} images. Please remove some images before uploading more.
          </AlertDescription>
        </Alert>
      )}
      
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative overflow-hidden aspect-square group">
              <img 
                src={image.url} 
                alt={`Product image ${index + 1}`} 
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => window.open(image.url, '_blank')}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeImage(index)}
                  disabled={deleting === index}
                  className="transform scale-90 group-hover:scale-100 transition-transform"
                >
                  {deleting === index ? (
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
                {index + 1}/{images.length}
              </span>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-8 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            No images uploaded yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            You can upload up to {maxImages} images
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
