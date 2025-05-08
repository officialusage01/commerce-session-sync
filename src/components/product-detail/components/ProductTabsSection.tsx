
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductDetails from '@/components/product/ProductDetails';
import ProductReviews from '@/components/product-detail/components/ProductReviews';
import { ProductWithRelations } from '@/lib/supabase/product-operations/types';

interface ProductTabsSectionProps {
  product: ProductWithRelations;
}

const ProductTabsSection = ({ product }: ProductTabsSectionProps) => {
  const [selectedTab, setSelectedTab] = useState("details");
  
  return (
    <div className="mt-12">
      <Tabs defaultValue="details" className="w-full" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <ProductDetails
            description={product.description}
            stock={product.stock}
            productId={product.id}
          />
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="font-semibold text-xl mb-4">Product Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                <p className="font-medium">{product.category?.name || 'Uncategorized'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Subcategory</h3>
                <p className="font-medium">{product.subcategory?.name || 'None'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Product ID</h3>
                <p className="font-medium">{product.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <p className="font-medium">
                  {new Date(product.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <ProductReviews productId={product.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductTabsSection;
