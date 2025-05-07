
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Product, getProducts } from '@/lib/supabase';
import ProductCard from './ProductCard';
import { useProductFilter } from '@/hooks/use-product-filter';
import { useSubcategories } from '@/hooks/use-subcategories';
import SubcategorySelector from './mobile/SubcategorySelector';
import FilterDialog from './mobile/FilterDialog';
import StoryNavigation from './mobile/StoryNavigation';
import MobileEmptyState from './mobile/MobileEmptyState';
import { FilterOptions } from './filters/types';

interface MobileViewProps {
  categoryId?: string;
  subcategoryId?: string;
}

const MobileView: React.FC<MobileViewProps> = ({ categoryId, subcategoryId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  
  // Use our subcategory hook
  const { 
    subcategories, 
    selectedSubcategory, 
    setSelectedSubcategory 
  } = useSubcategories(categoryId);
  
  // Initialize with provided subcategoryId if available
  useEffect(() => {
    if (subcategoryId) {
      setSelectedSubcategory(subcategoryId);
    }
  }, [subcategoryId, setSelectedSubcategory]);
  
  // Fetch products when selected subcategory changes
  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedSubcategory) {
        const productsData = await getProducts(selectedSubcategory);
        setProducts(productsData);
        setCurrentIndex(0); // Reset to first product
      }
    };
    
    if (selectedSubcategory) {
      fetchProducts();
    }
  }, [selectedSubcategory]);
  
  // Use our filtering hook
  const { filters, setFilters, filteredProducts, maxPrice } = useProductFilter(products);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentIndex(0); // Reset to first filtered product
  };
  
  const handleClearFilters = () => {
    setFilters({
      search: '',
      priceRange: [0, maxPrice],
      stockStatus: 'all',
      categories: [],
      subcategories: []
    });
    setCurrentIndex(0);
  };
  
  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex < filteredProducts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleSubcategorySelect = (subcatId: string) => {
    setSelectedSubcategory(subcatId);
    setShowSubcategories(false);
  };
  
  // Calculate active filter count
  const activeFilterCount = filters.filterCount || 
    ((filters.search ? 1 : 0) + 
    (filters.categories?.length > 0 ? 1 : 0) + 
    (filters.subcategories?.length > 0 ? 1 : 0) + 
    (filters.stockStatus !== 'all' ? 1 : 0) + 
    ((filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice)) ? 1 : 0));
  
  if (filteredProducts.length === 0) {
    return <MobileEmptyState hasProducts={products.length > 0} />;
  }
  
  return (
    <div className="mobile-story-container">
      {filteredProducts.map((product, index) => (
        <div 
          key={product.id} 
          className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-out ${
            index === currentIndex 
              ? 'translate-y-0 opacity-100 z-10' 
              : index < currentIndex 
              ? '-translate-y-full opacity-0 z-0'
              : 'translate-y-full opacity-0 z-0'
          }`}
        >
          <ProductCard product={product} isMobile={true} />
        </div>
      ))}
      
      {/* Navigation */}
      <StoryNavigation 
        currentIndex={currentIndex} 
        totalItems={filteredProducts.length} 
        onSwipe={handleSwipe} 
      />
      
      {/* Subcategories selector */}
      <div className="absolute top-4 right-4 z-30">
        <SubcategorySelector 
          subcategories={subcategories}
          selectedSubcategoryId={selectedSubcategory}
          onSelect={handleSubcategorySelect}
          open={showSubcategories}
          onOpenChange={setShowSubcategories}
        />
      </div>
      
      {/* Filter button */}
      <div className="absolute top-4 left-16 z-30">
        <FilterDialog 
          maxPrice={maxPrice}
          initialFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          open={showFilters}
          onOpenChange={setShowFilters}
          filterCount={activeFilterCount}
        />
      </div>
      
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-30 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center"
      >
        <ArrowLeft size={20} className="text-white" />
      </button>
    </div>
  );
};

export default MobileView;
