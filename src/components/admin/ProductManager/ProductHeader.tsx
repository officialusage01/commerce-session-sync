
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface ProductHeaderProps {
  onAddProduct: () => void;
  disabled: boolean;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ onAddProduct, disabled }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Products</CardTitle>
        <CardDescription>Manage your product inventory</CardDescription>
      </div>
      <Button 
        disabled={disabled}
        onClick={onAddProduct}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Product
      </Button>
    </div>
  );
};

export default ProductHeader;
