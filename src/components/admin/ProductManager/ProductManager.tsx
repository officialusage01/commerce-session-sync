
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ProductHeader from './ProductHeader';
import CategorySelector from './CategorySelector';
import SubcategorySelector from './SubcategorySelector';
import ProductList from './ProductList';
import ProductDialog from '../ProductDialog';
import { useProductManager } from '@/hooks/use-product-manager';
import { useProductActions } from './ProductActions';
import { useProductDialogController } from './ProductDialogController';

const ProductManager: React.FC = () => {
  const {
    categories,
    subcategories,
    products,
    selectedCategory,
    selectedSubcategory,
    handleCategoryChange,
    handleSubcategoryChange,
    refreshProducts
  } = useProductManager();
  
  const { handleDeleteProduct } = useProductActions();
  
  // Use the product dialog controller hook
  const {
    dialogProps,
    showDialog,
    handleAddProduct,
    handleEditProduct
  } = useProductDialogController({
    selectedSubcategory,
    onProductSaved: refreshProducts
  });
  
  const onProductDelete = (productId: string) => {
    handleDeleteProduct(productId, refreshProducts);
  };
  
  return (
    <Card>
      <CardHeader>
        <ProductHeader
          onAddProduct={handleAddProduct}
          disabled={!selectedSubcategory}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="md:col-span-3">
            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          <div className="md:col-span-3">
            <SubcategorySelector
              subcategories={subcategories}
              selectedSubcategory={selectedSubcategory}
              onSubcategoryChange={handleSubcategoryChange}
              disabled={!selectedCategory}
            />
          </div>
        </div>
        
        <ProductList
          products={products}
          onEditProduct={handleEditProduct}
          onDeleteProduct={onProductDelete}
          onAddProduct={handleAddProduct}
          selectedSubcategory={selectedSubcategory}
        />
      </CardContent>
      
      {showDialog && <ProductDialog {...dialogProps} />}
    </Card>
  );
};

export default ProductManager;
