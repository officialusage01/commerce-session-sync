
import React from 'react';
import { CloudinaryImage } from '@/lib/supabase/types';
import { useImageUploader } from '@/hooks/use-image-uploader';
import UploaderHeader from './image-upload/UploaderHeader';
import UploadProgress from './image-upload/UploadProgress';
import MaxImagesWarning from './image-upload/MaxImagesWarning';
import ImagesGrid from './image-upload/ImagesGrid';
import EmptyImagesState from './image-upload/EmptyImagesState';

interface ImageUploaderProps {
  images: CloudinaryImage[];
  onImagesChange: (images: CloudinaryImage[]) => void;
  multiple?: boolean;
  maxImages?: number;
  productId: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  images: initialImages, 
  onImagesChange,
  multiple = true,
  maxImages = 10,
  productId
}) => {
  const {
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
  } = useImageUploader({
    initialImages,
    onImagesChange,
    productId,
    maxImages
  });

  return (
    <div className="space-y-4">
      <UploaderHeader 
        imagesCount={images.length}
        maxImages={maxImages}
        showClearAll={images.length > 0}
        uploading={uploading}
        canUploadMore={canUploadMore}
        multiple={multiple}
        onClearAll={clearAllImages}
        onUploadClick={triggerFileInput}
        fileInputRef={fileInputRef}
      />
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple={multiple}
        className="hidden"
        id="image-upload"
        disabled={uploading || !canUploadMore}
      />
      
      <UploadProgress 
        uploading={uploading} 
        progress={uploadProgress} 
      />
      
      <MaxImagesWarning 
        visible={!canUploadMore} 
        maxImages={maxImages} 
      />
      
      {images.length > 0 ? (
        <ImagesGrid
          images={images}
          deleting={deleting}
          onRemoveImage={removeImage}
          onViewImage={viewImage}
        />
      ) : (
        <EmptyImagesState maxImages={maxImages} />
      )}
    </div>
  );
};

export default ImageUploader;
