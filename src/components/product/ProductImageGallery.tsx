
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageModal from '@/components/ui/image-modal';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  images, 
  productName 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  
  const mainImage = images && images.length > 0 
    ? images[currentImageIndex] 
    : '/placeholder.svg';
  
  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };
  
  const goToNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <div className="relative">
      <div 
        className="aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer"
        onClick={openModal}
      >
        <img 
          src={mainImage} 
          alt={productName} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Image Navigation */}
      {images && images.length > 1 && (
        <>
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full"
            onClick={goToPrevImage}
          >
            <ChevronLeft size={20} />
          </Button>
          
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
            onClick={goToNextImage}
          >
            <ChevronRight size={20} />
          </Button>
          
          {/* Image Thumbnails */}
          <div className="flex mt-4 space-x-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-16 h-16 rounded-md overflow-hidden ${
                  index === currentImageIndex 
                    ? 'ring-2 ring-primary'
                    : 'opacity-70'
                }`}
              >
                <img 
                  src={image} 
                  alt={`${productName} - ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Image Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={mainImage}
        altText={productName}
      />
    </div>
  );
};

export default ProductImageGallery;
