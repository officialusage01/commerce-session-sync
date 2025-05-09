
import { supabase } from './client';
import { CloudinaryImage } from './types';
import { CLOUDINARY_CONFIG, MAX_FILE_SIZE } from '../cloudinary/config';
import { convertFileToBase64 } from '../cloudinary/utils';
import { toast } from "sonner";

export async function uploadImage(file: File, productId: number): Promise<string | null> {
  try {
    if (!file) {
      toast.error('No file provided');
      throw new Error('No file provided');
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 10MB limit');
      throw new Error('File size exceeds 10MB limit');
    }

    if (!file.type.startsWith('image/')) {
      toast.error('File must be an image');
      throw new Error('File must be an image');
    }

    // Create FormData for direct upload
    const formData = new FormData();
    formData.append('file', await convertFileToBase64(file));
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

    console.log('Uploading with preset:', CLOUDINARY_CONFIG.uploadPreset);
    
    const response = await fetch(
      CLOUDINARY_CONFIG.apiUrl,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload error:', errorText);
      toast.error(`Upload failed: ${response.status}`);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const imageUrl = data.secure_url;

    // Store image metadata in Supabase
    const { error } = await supabase.from('images').insert({
      url: imageUrl,
      public_id: data.public_id,
      filename: file.name,
      format: data.format,
      resource_type: data.resource_type,
      product_id: productId
    });

    if (error) {
      console.error('Failed to store image metadata:', error);
      toast.error('Failed to save image information');
      throw new Error(`Failed to store image metadata: ${error.message}`);
    }

    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    toast.error('Error uploading image');
    return null;
  }
}

export async function getImages(productId: number): Promise<CloudinaryImage[]> {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as CloudinaryImage[];
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

export async function deleteImage(url: string): Promise<boolean> {
  try {
    // Skip deletion for base64 data URLs
    if (url.startsWith('data:')) {
      return true;
    }

    // Delete the image record from the database
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('url', url);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}
