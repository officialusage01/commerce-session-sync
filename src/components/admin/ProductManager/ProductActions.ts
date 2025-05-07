
import { useState } from 'react';
import { deleteProduct } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useProductActions() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  const handleDeleteProduct = async (productId: string, onSuccess?: () => void) => {
    if (!productId) return;
    
    setIsDeleting(true);
    
    try {
      const success = await deleteProduct(productId);
      
      if (success) {
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    isDeleting,
    handleDeleteProduct
  };
}
