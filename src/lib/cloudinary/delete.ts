
import { toast } from "sonner";

// Client-side delete handler for Cloudinary images
export const deleteFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    if (!publicId) {
      toast.error("No public_id provided");
      return false;
    }
    
    // In a production environment, this should call a secure server endpoint
    // that handles the deletion with proper authentication
    const response = await fetch('/api/cloudinary/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Cloudinary deletion failed:', error);
      toast.error("Failed to delete image");
      return false;
    }

    toast.success("Image deleted successfully");
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    toast.error("Error deleting image");
    return false;
  }
};
