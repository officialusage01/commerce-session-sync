
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { StockImage } from "@/components/stock/types";
import { v4 as uuidv4 } from "uuid";

export const useImageGallery = (type: 'analysis' | 'result', maxImages: number) => {
  const [images, setImages] = useState<StockImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<StockImage | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Function to load images from storage
  const loadImages = async () => {
    try {
      setLoading(true);
      
      // Simulate loading images from Supabase
      // In a real app, you would fetch from your database
      console.log(`Loading ${type} images...`);
      
      // For development - create some sample images
      const sampleImages: StockImage[] = [];
      
      // Simulate a delay for loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setImages(sampleImages);
      
      if (sampleImages.length > 0) {
        setSelectedImage(sampleImages[0]);
      }
    } catch (error) {
      console.error(`Error loading ${type} images:`, error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to upload an image
  const uploadImage = async (file: File) => {
    if (images.length >= maxImages) {
      throw new Error(`Maximum of ${maxImages} images allowed`);
    }
    
    try {
      setLoading(true);
      
      // Generate a unique ID for the image
      const imageId = uuidv4();
      
      // In a real app, you would upload to Supabase storage
      // and then store metadata in the database
      console.log(`Uploading ${type} image:`, file.name);
      
      // Create a URL for the uploaded file (for development)
      const imageUrl = URL.createObjectURL(file);
      
      // Create a new image object
      const newImage: StockImage = {
        id: imageId,
        url: imageUrl,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type
      };
      
      // Update the images state
      const updatedImages = [...images, newImage];
      setImages(updatedImages);
      setSelectedImage(newImage);
      
      return newImage;
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Load images on component mount
  useEffect(() => {
    loadImages();
  }, [type]);
  
  return {
    images,
    selectedImage,
    setSelectedImage,
    uploadImage,
    loading,
    refresh: loadImages
  };
};
