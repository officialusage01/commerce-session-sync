
// Configure Cloudinary with direct upload
import { convertFileToBase64 } from './supabase/client';
import { toast } from "sonner";

// Helper to sanitize filenames for Cloudinary
const sanitizeFileName = (filename: string): string => {
  // Remove any path-like structure (slashes, backslashes)
  const sanitized = filename
    .replace(/[\/\\]/g, '-') // Replace slashes with hyphens
    .replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '_'); // Replace other special chars
  
  // Ensure unique names by adding a timestamp
  return `${Date.now()}_${sanitized}`;
};

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
    
    // Upload to Cloudinary using the upload API with preset
    const response = await fetch('https://api.cloudinary.com/v1_1/dzf84qacp/image/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: base64data,
        upload_preset: 'pwziziv8', // Using the requested preset
        public_id: sanitizedFilename,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cloudinary error response:', errorData);
      toast.error("Failed to upload to Cloudinary");
      throw new Error('Failed to upload to Cloudinary');
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
