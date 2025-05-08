
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, Subcategory } from '@/lib/supabase/types';
import { getProducts } from '@/lib/supabase/product-operations';
import { getSubcategories } from '@/lib/supabase';
import ProductCard from './ProductCard';
import { ArrowLeft } from 'lucide-react';
import ProductFilter from './ProductFilter';
import { useProductFilter } from '@/hooks/use-product-filter';

interface DesktopViewProps {
  categoryId?: string;
}

const DesktopView: React.FC<DesktopViewProps> = ({ categoryId }) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (categoryId) {
        const subcategoriesData = await getSubcategories(categoryId);
        setSubcategories(subcategoriesData);
        
        // Select first subcategory by default
        if (subcategoriesData.length > 0 && !selectedSubcategory) {
          setSelectedSubcategory(subcategoriesData[0].id);
        }
      }
    };
    
    fetchSubcategories();
  }, [categoryId, selectedSubcategory]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedSubcategory) {
        const productsData = await getProducts(selectedSubcategory);
        setProducts(productsData);
      }
    };
    
    fetchProducts();
  }, [selectedSubcategory]);
  
  // Use our custom filtering hook
  const { filters, setFilters, filteredProducts, maxPrice } = useProductFilter(products);
  
  return (
    <div className="container py-8">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-sm font-medium mb-6 hover:underline"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back to Categories
      </button>
      
      {/* Subcategories */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Subcategories</h2>
        <div className="flex flex-wrap gap-2">
          {subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => setSelectedSubcategory(subcategory.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedSubcategory === subcategory.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Product filters */}
      <ProductFilter
        maxPrice={maxPrice}
        onFilterChange={setFilters}
        initialFilters={filters}
      />
      
      {/* Products */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Products</h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {products.length > 0 
                ? 'No products match your filters' 
                : 'No products found in this subcategory'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopView;
