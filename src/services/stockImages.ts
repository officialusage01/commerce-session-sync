
import { supabase } from '@/lib/supabase/client';
import { StockImage } from '@/components/stock/types';
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinary';
import { toast } from 'sonner';

// Upload a stock image
export const uploadStockImage = async (file: File, stockId: string, type: 'analysis' | 'result'): Promise<StockImage> => {
  try {
    // Show toast for upload started
    toast.info("Uploading image to Cloudinary...");
    
    // Upload to Cloudinary first
    const cloudinaryUrl = await uploadToCloudinary(file);
    
    if (!cloudinaryUrl) {
      throw new Error("Failed to upload image to Cloudinary");
    }
    
    // Generate a default description
    const defaultDescription = `${type === 'analysis' ? 'Analysis' : 'Result'} image uploaded on ${new Date().toLocaleString()}`;
    
    const timestamp = new Date().toISOString();
    
    console.log('Saving image metadata to Supabase:', {
      stock_id: stockId,
      image_url: cloudinaryUrl,
      image_type: type,
      description: defaultDescription,
      timestamp: timestamp
    });
    
    // Save the image metadata in the stock_images table
    const { data: imageData, error: imageError } = await supabase
      .from('stock_images')
      .insert([{
        stock_id: stockId,
        image_url: cloudinaryUrl, 
        image_type: type,
        timestamp: timestamp,
        description: defaultDescription
      }])
      .select('*')
      .single();
    
    if (imageError) {
      console.error('Error saving image metadata:', imageError);
      throw imageError;
    }
    
    if (imageData) {
      toast.success("Image uploaded successfully!");
      return {
        id: imageData.id,
        url: imageData.image_url,
        type: imageData.image_type,
        stockId: imageData.stock_id,
        createdAt: imageData.timestamp,
        updatedAt: imageData.timestamp,
        description: imageData.description || ''
      };
    }
    
    throw new Error("Failed to save image metadata");
  } catch (err) {
    console.error("Error uploading stock image:", err);
    toast.error("Failed to save image metadata");
    throw err;
  }
};

// Get images for a stock
export const getStockImages = async (stockId: string, type: 'analysis' | 'result'): Promise<StockImage[]> => {
  try {
    const { data, error } = await supabase
      .from('stock_images')
      .select('*')
      .eq('stock_id', stockId)
      .eq('image_type', type)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    if (data) {
      return data.map(item => ({
        id: item.id,
        url: item.image_url,
        type: item.image_type,
        stockId: item.stock_id,
        createdAt: item.timestamp,
        updatedAt: item.timestamp,
        description: item.description || ''
      }));
    }
    
    return [];
  } catch (err) {
    console.error("Error fetching stock images:", err);
    return [];
  }
};

// Update image description
export const updateImageDescription = async (imageId: string, description: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('stock_images')
      .update({ description })
      .eq('id', imageId);
    
    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error("Error updating image description:", err);
    return false;
  }
};

// Delete an image
export const deleteStockImage = async (imageId: string): Promise<boolean> => {
  try {
    // First get the image data to extract the Cloudinary URL
    const { data: imageData, error: fetchError } = await supabase
      .from('stock_images')
      .select('image_url')
      .eq('id', imageId)
      .single();
    
    if (fetchError) throw fetchError;
    
    if (imageData && imageData.image_url) {
      // Try to delete from Cloudinary first
      try {
        await deleteFromCloudinary(imageData.image_url);
      } catch (cloudinaryError) {
        console.warn("Error deleting from Cloudinary, continuing with database deletion:", cloudinaryError);
        // We'll continue with the database deletion even if Cloudinary deletion fails
      }
    }
    
    // Delete from database
    const { error } = await supabase
      .from('stock_images')
      .delete()
      .eq('id', imageId);
    
    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error("Error deleting stock image:", err);
    return false;
  }
};

// Bulk delete images
export const bulkDeleteStockImages = async (imageIds: string[]): Promise<boolean> => {
  if (imageIds.length === 0) return true;
  
  try {
    // First get all the image URLs
    const { data: imagesData, error: fetchError } = await supabase
      .from('stock_images')
      .select('id,image_url')
      .in('id', imageIds);
    
    if (fetchError) throw fetchError;
    
    // Try to delete all images from Cloudinary
    if (imagesData && imagesData.length > 0) {
      for (const image of imagesData) {
        if (image.image_url) {
          try {
            await deleteFromCloudinary(image.image_url);
          } catch (cloudinaryError) {
            console.warn(`Error deleting image ${image.id} from Cloudinary:`, cloudinaryError);
            // Continue with the next image even if one fails
          }
        }
      }
    }
    
    // Delete all from database
    const { error } = await supabase
      .from('stock_images')
      .delete()
      .in('id', imageIds);
    
    if (error) throw error;
    
    return true;
  } catch (err) {
    console.error("Error bulk deleting stock images:", err);
    return false;
  }
};
