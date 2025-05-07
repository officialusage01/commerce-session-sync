
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';
import ImageModal from '@/components/ui/image-modal';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  autoPlayInterval?: number;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ 
  images, 
  productName,
  autoPlayInterval = 2000 // Changed to 2 seconds as requested
}) => {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Ensure there's at least one image
  const imageList = images && images.length > 0 
    ? images 
    : ['/placeholder.svg'];

  // Setup carousel when API is available
  useEffect(() => {
    if (!api) return;
    
    setCount(api.scrollSnapList().length);
    
    // Listen for scroll events to update the current slide
    const onScroll = () => {
      const slideIndex = api.selectedScrollSnap();
      setCurrent(slideIndex);
    };
    
    api.on('select', onScroll);
    
    // Cleanup
    return () => {
      api.off('select', onScroll);
    };
  }, [api]);

  // Handle autoplay
  useEffect(() => {
    if (!api || !autoplay) return;
    
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, autoPlayInterval);
    
    return () => clearInterval(intervalId);
  }, [api, autoplay, autoPlayInterval]);

  // Pause autoplay on user interaction
  const handleUserInteraction = useCallback(() => {
    setAutoplay(false);
    
    // Resume after a period of inactivity
    const timeout = setTimeout(() => {
      setAutoplay(true);
    }, 10000); // 10 seconds
    
    return () => clearTimeout(timeout);
  }, []);

  // Open the image modal
  const openImageModal = (src: string) => {
    setSelectedImage(src);
    setModalOpen(true);
    setAutoplay(false); // Pause autoplay when modal is open
  };

  // Close the image modal and resume autoplay
  const closeImageModal = () => {
    setModalOpen(false);
    setAutoplay(true);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
    >
      <Carousel 
        setApi={setApi} 
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {imageList.map((src, index) => (
            <CarouselItem key={index} className="overflow-hidden">
              <div 
                className="aspect-square overflow-hidden bg-muted rounded-xl cursor-pointer"
                onClick={() => openImageModal(src)}
              >
                <img 
                  src={src} 
                  alt={`${productName} - Image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {imageList.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
            
            {/* Dot Navigation */}
            <div className="absolute bottom-4 left-0 right-0">
              <div className="flex justify-center gap-2">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      api?.scrollTo(index);
                      handleUserInteraction();
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      current === index 
                        ? "bg-primary w-4" 
                        : "bg-primary/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </Carousel>
      
      {/* Thumbnail Preview (Desktop Only) */}
      {!isMobile && imageList.length > 1 && (
        <div className="hidden md:flex mt-4 gap-2 overflow-x-auto pb-2">
          {imageList.map((src, index) => (
            <button
              key={index}
              onClick={() => {
                api?.scrollTo(index);
                handleUserInteraction();
              }}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${
                current === index 
                  ? "ring-2 ring-primary"
                  : "opacity-70"
              }`}
            >
              <img 
                src={src} 
                alt={`${productName} thumbnail ${index + 1}`} 
                className="w-full h-full object-cover"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  openImageModal(src);
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Modal for enlarged view */}
      <ImageModal
        isOpen={modalOpen}
        onClose={closeImageModal}
        imageUrl={selectedImage}
        altText={`${productName} - Enlarged View`}
      />
    </div>
  );
};

export default ProductImageCarousel;
