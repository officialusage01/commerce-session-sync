
// Helper to sanitize filenames for Cloudinary
export const sanitizeFileName = (filename: string): string => {
  // Remove any path-like structure (slashes, backslashes)
  const sanitized = filename
    .replace(/[\/\\]/g, '-') // Replace slashes with hyphens
    .replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '_'); // Replace other special chars
  
  // Ensure unique names by adding a timestamp
  return `${Date.now()}_${sanitized}`;
};

// Convert file to base64 (imported from the old file)
export const convertFileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
