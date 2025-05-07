
// Cloudinary image upload service
import { toast } from "sonner";

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = "dvgdtzmku";
const CLOUDINARY_API_KEY = "139186693455276";
const CLOUDINARY_API_SECRET = "aeM476j8cnpvC7xqVgX6PpyvJAQ";

/**
 * Uploads an image to Cloudinary using signed upload
 * @param file The file to upload
 * @returns The Cloudinary image URL or null if upload fails
 */
export const uploadToCloudinary = async (file: File): Promise<string | null> => {
  try {
    // Create form data for upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", CLOUDINARY_API_KEY);
    
    // Generate timestamp for the signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    formData.append("timestamp", timestamp.toString());
    
    // Set folder parameter
    const folder = "stock_images";
    formData.append("folder", folder);
    
    // Generate correct signature
    // The signature is created by combining parameters in alphabetical order
    // followed by the API secret
    const signatureString = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = await generateSHA1(signatureString);
    formData.append("signature", signature);
    
    console.log("Uploading to Cloudinary with params:", {
      folder,
      timestamp,
      signatureString: `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET.substring(0, 3)}...`,
      signature
    });
    
    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary upload error:", errorData);
      throw new Error(errorData.error?.message || "Failed to upload image to Cloudinary");
    }
    
    const data = await response.json();
    console.log("Cloudinary upload successful:", data);
    
    // Return the secure URL
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    toast.error("Failed to upload image to Cloudinary");
    return null;
  }
};

/**
 * Deletes an image from Cloudinary
 * @param imageUrl The Cloudinary image URL to delete
 */
export const deleteFromCloudinary = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract the public ID from the URL
    const publicId = extractPublicIdFromUrl(imageUrl);
    
    if (!publicId) {
      throw new Error("Could not extract public ID from image URL");
    }
    
    // Generate timestamp for the signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Generate signature for deletion
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = await generateSHA1(signatureString);
    
    // Create form data for deletion
    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    
    console.log("Deleting from Cloudinary:", {
      publicId,
      timestamp,
    });
    
    // Call Cloudinary deletion API
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
      {
        method: "POST",
        body: formData
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary deletion error:", errorData);
      throw new Error(errorData.error?.message || "Failed to delete image from Cloudinary");
    }
    
    const data = await response.json();
    console.log("Cloudinary deletion response:", data);
    
    return data.result === "ok";
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
};

/**
 * Extract the public ID from a Cloudinary URL
 * @param url The Cloudinary URL
 * @returns The public ID or null if not found
 */
function extractPublicIdFromUrl(url: string): string | null {
  try {
    // Match for format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/filename.ext
    const regex = /\/v\d+\/(.+?)(\.[^.]+)?$/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return match[1]; // This is the public ID including folder
    }
    
    return null;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
}

// Helper function to generate SHA-1 hash for Cloudinary signature
async function generateSHA1(message: string): Promise<string> {
  // Encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);
  
  // Hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  
  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
