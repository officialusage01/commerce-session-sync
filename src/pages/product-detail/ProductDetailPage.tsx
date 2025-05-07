
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductDetail } from '@/hooks/use-product-detail';
import ProductImageSection from './components/ProductImageSection';
import ProductActionSection from './components/ProductActionSection';
import ProductTabsSection from './components/ProductTabsSection';
import MobileAddToCartBar from './components/MobileAddToCartBar';
import LoadingState from './components/LoadingState';
import NotFoundState from './components/NotFoundState';

const ProductDetailPage = () => {
  const { id } = useParams();
  const productId = id || "";
  const { product, loading, refetchProduct } = useProductDetail(productId);
  const navigate = useNavigate();
  
  // Handle loading state
  if (loading) {
    return <LoadingState />;
  }
  
  // Handle product not found
  if (!product) {
    return <NotFoundState onGoBack={() => navigate(-1)} />;
  }
  
  return (
    <div className="container py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6 pl-0"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back
      </Button>
      
      {/* Removed ProductHeader component that was causing duplicate info */}
      
      <ProductImageSection product={product} />
      
      <ProductActionSection product={product} />
      
      <ProductTabsSection product={product} />
      
      <MobileAddToCartBar product={product} />
    </div>
  );
};

export default ProductDetailPage;
