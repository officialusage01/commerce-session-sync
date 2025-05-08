
import { useState, useRef } from 'react';
import { uploadImage, deleteImage } from '@/lib/supabase/upload';
import { CloudinaryImage } from '@/lib/supabase/types';
import { useToast } from '@/hooks/use-toast';

interface UseImageUploaderProps {
  initialImages: CloudinaryImage[];
  onImagesChange: (images: CloudinaryImage[]) => void;
  productId: number;
  maxImages?: number;
}

export const useImageUploader = ({ 
  initialImages, 
  onImagesChange, 
  productId,
  maxImages = 10
}: UseImageUploaderProps) => {
  const [images, setImages] = useState<CloudinaryImage[]>(initialImages);
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
        
        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesChange(updatedImages);
        
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
      
      setImages(newImages);
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
      
      setImages([]);
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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const viewImage = (url: string) => {
    window.open(url, '_blank');
  };

  return {
    images,
    uploading,
    uploadProgress,
    deleting,
    fileInputRef,
    canUploadMore,
    handleFileChange,
    removeImage,
    clearAllImages,
    triggerFileInput,
    viewImage,
  };
};
