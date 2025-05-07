import { supabase } from './client';
import { CloudinaryImage } from './types';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.CLOUDINARY_UPLOAD_PRESET;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadImage(file: File, productId: number): Promise<string | null> {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${await response.text()}`);
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
      throw new Error(`Failed to store image metadata: ${error.message}`);
    }

    return imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
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
