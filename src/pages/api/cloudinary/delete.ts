
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Server-side function to delete an image from Cloudinary
export async function deleteCloudinaryImage(public_id: string) {
  const CLOUDINARY_CLOUD_NAME = process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_API_KEY = process.env.VITE_CLOUDINARY_API_KEY;
  const CLOUDINARY_API_SECRET = process.env.VITE_CLOUDINARY_API_SECRET;

  if (!public_id) {
    throw new Error('public_id is required');
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Generate signature
    const signature = crypto
      .createHash('sha1')
      .update(`public_id=${public_id}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
      .digest('hex');

    // Make request to Cloudinary API
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_id,
        timestamp,
        api_key: CLOUDINARY_API_KEY,
        signature,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Cloudinary deletion failed:', error);
      throw new Error(`Failed to delete image: ${error}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}
