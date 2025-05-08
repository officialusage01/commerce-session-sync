
// Cloudinary configuration constants
// Using demo account which is publicly available for testing
export const CLOUDINARY_CONFIG = {
  cloudName: 'demo',
  uploadPreset: 'ml_default', // Using the correct preset as requested by the user
  apiUrl: 'https://api.cloudinary.com/v1_1/demo/image/upload'
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
