
import React, { useState } from 'react';
import { Product } from '@/lib/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProductForm from './ProductManager/ProductForm';
import { saveProduct, validateProduct } from './ProductManager/product-utils';

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Partial<Product>;
  isEditing: boolean;
  subcategoryId: number | null;
  onSaved: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ 
  isOpen, 
  onClose, 
  product, 
  isEditing, 
  subcategoryId,
  onSaved 
}) => {
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>(product);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateProduct(currentProduct, subcategoryId);
    if (!validation.valid) {
      toast({
        title: 'Error',
        description: validation.message,
        variant: 'destructive',
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (!subcategoryId) throw new Error('No subcategory selected');
      
      const result = await saveProduct(currentProduct, subcategoryId, isEditing);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        onSaved();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Save product error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the product details below.' 
              : 'Fill in the details to add a new product.'}
          </DialogDescription>
        </DialogHeader>
        
        <ProductForm
          product={currentProduct}
          submitting={submitting}
          onCancel={onClose}
          onSubmit={handleSaveProduct}
          onProductChange={setCurrentProduct}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
