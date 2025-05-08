
import { toast } from "sonner";
import { sanitizeFileName, convertFileToBase64 } from './utils';
import { CLOUDINARY_CONFIG } from './config';

export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  try {
    if (!file) {
      toast.error("No file provided");
      throw new Error('No file provided');
    }

    // Convert file to base64
    const base64data = await convertFileToBase64(file);
    
    // Sanitize the filename to avoid Cloudinary errors
    const sanitizedFilename = sanitizeFileName(file.name);
    
    // Upload to Cloudinary using FormData instead of JSON for more reliable uploads
    const formData = new FormData();
    formData.append('file', base64data);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
    
    console.log('Uploading to Cloudinary with preset:', CLOUDINARY_CONFIG.uploadPreset);
    
    const response = await fetch(CLOUDINARY_CONFIG.apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cloudinary error response:', errorData);
      toast.error("Failed to upload to Cloudinary");
      throw new Error(`Failed to upload to Cloudinary: ${errorData}`);
    }

    const data = await response.json();
    console.log('Upload successful:', data.secure_url);
    console.log('Public ID:', data.public_id);
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    toast.error("Error uploading image");
    return null;
  }
};
