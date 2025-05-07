
import React, { useState } from 'react';
import { Product } from '@/lib/supabase/types';

interface ProductDialogControllerProps {
  selectedSubcategory: number | null;
  onProductSaved: () => void;
}

interface ProductDialogControllerReturn {
  dialogProps: {
    isOpen: boolean;
    onClose: () => void;
    product: Partial<Product>;
    isEditing: boolean;
    subcategoryId: number | null;
    onSaved: () => void;
  };
  showDialog: boolean;
  handleAddProduct: () => void;
  handleEditProduct: (product: Product) => void;
}

// This is a custom hook, not a component
export function useProductDialogController({ 
  selectedSubcategory,
  onProductSaved
}: ProductDialogControllerProps): ProductDialogControllerReturn {
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  const handleAddProduct = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      images: [],
      subcategory_id: selectedSubcategory || undefined
    });
    setIsEditing(false);
    setShowProductDialog(true);
  };
  
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setShowProductDialog(true);
  };
  
  const handleDialogClose = () => {
    setShowProductDialog(false);
  };
  
  const handleProductSaved = () => {
    setShowProductDialog(false);
    onProductSaved();
  };
  
  return {
    dialogProps: {
      isOpen: showProductDialog,
      onClose: handleDialogClose,
      product: currentProduct,
      isEditing: isEditing,
      subcategoryId: selectedSubcategory,
      onSaved: handleProductSaved
    },
    showDialog: showProductDialog,
    handleAddProduct,
    handleEditProduct
  };
}
