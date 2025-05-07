
import React, { useState } from 'react';
import { Product, CloudinaryImage } from '@/lib/supabase/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

interface ProductFormProps {
  product: Partial<Product>;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onProductChange: (updatedProduct: Partial<Product>) => void;
  isEditing: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  submitting,
  onCancel,
  onSubmit,
  onProductChange,
  isEditing
}) => {
  const [imageUploading, setImageUploading] = useState(false);

  const handleInputChange = (
    field: keyof Product,
    value: string | number | string[]
  ) => {
    onProductChange({ ...product, [field]: value });
  };

  // Create CloudinaryImage objects from string URLs
  const createCloudinaryImages = (imageUrls: string[]): CloudinaryImage[] => {
    return imageUrls.map(url => ({
      url,
      product_id: product.id || ''
    }));
  };

  // Handle image changes from ImageUploader component
  const handleImagesChange = (cloudinaryImages: CloudinaryImage[]) => {
    console.log('ProductForm: handleImagesChange called with', cloudinaryImages.length, 'images');
    // Extract URLs from CloudinaryImage objects and update the product
    const imageUrls = cloudinaryImages.map(img => img.url);
    handleInputChange('images', imageUrls);
  };

  // Convert product.images to compatible format for ImageUploader
  const imageObjects: CloudinaryImage[] = product.images && Array.isArray(product.images)
    ? createCloudinaryImages(product.images as string[])
    : [];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={product.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={product.price || ''}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
            placeholder="0.00"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={product.stock || ''}
            onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
            placeholder="0"
            required
          />
        </div>
        
        <div className="sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={product.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter product description"
            rows={4}
            required
          />
        </div>
        
        <div className="sm:col-span-2">
          <ImageUploader
            images={imageObjects}
            onImagesChange={(cloudinaryImages: CloudinaryImage[]) => {
              // Extract URLs from CloudinaryImage objects
              const urls = cloudinaryImages.map(img => img.url);
              handleInputChange('images', urls);
            }}
            multiple={true}
            maxImages={10}
            productId={product.id || ''}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={submitting || imageUploading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={submitting || imageUploading}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEditing ? 'Update Product' : 'Add Product'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProductForm;
