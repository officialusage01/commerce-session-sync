import React, { useState, useEffect } from 'react';
import { Product, getCategories, getSubcategories, getProducts } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import ProductFilter from '@/components/ProductFilter';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchContainer from '@/components/search/SearchContainer';

const Search = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialProductsLoaded, setInitialProductsLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();
  
  // Optimized product fetching with parallel requests and caching
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        // Check cache first
        const cachedProducts = sessionStorage.getItem('allProducts');
        const cacheTimestamp = sessionStorage.getItem('productsTimestamp');
        const cacheAge = cacheTimestamp ? Date.now() - parseInt(cacheTimestamp) : Infinity;
        
        // Use cache if it's less than 5 minutes old
        if (cachedProducts && cacheAge < 300000) {
          setAllProducts(JSON.parse(cachedProducts));
          setInitialProductsLoaded(true);
          setLoading(false);
          return;
        }

        // Fetch categories and subcategories in parallel
        const [categories, subcategoriesArrays] = await Promise.all([
          getCategories(),
          Promise.all((await getCategories()).map(cat => getSubcategories(cat.id)))
        ]);

        // Show UI early with loading indicators
        setInitialProductsLoaded(true);

        // Fetch products for all subcategories in parallel
        const flattenedSubcategories = subcategoriesArrays.flat();
        const productPromises = flattenedSubcategories.map(subcategory => 
          getProducts(subcategory.id)
            .catch(error => {
              console.error(`Error fetching products for subcategory ${subcategory.id}:`, error);
              return [] as Product[];
            })
        );

        const productsArrays = await Promise.all(productPromises);
        
        // Deduplicate products
        const uniqueProducts = Array.from(
          new Map(
            productsArrays.flat().map(product => [product.id, product])
          ).values()
        );

        // Update cache
        sessionStorage.setItem('allProducts', JSON.stringify(uniqueProducts));
        sessionStorage.setItem('productsTimestamp', Date.now().toString());

        setAllProducts(uniqueProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setInitialProductsLoaded(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllProducts();
  }, []);

  return (
    <div className="container py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Search Products
        </h1>
        
        <div className="flex gap-6">
          {!isMobile && showFilters && (
            <aside className="w-64 shrink-0">
              <ProductFilter
                onFilterChange={() => {}}
                initialFilters={{
                  search: '',
                  priceRange: [0, 1000],
                  stockStatus: 'all',
                  categories: [],
                  subcategories: []
                }}
              />
            </aside>
          )}
          
          <div className="flex-1 min-w-0">
            <SearchContainer 
              allProducts={allProducts}
              loading={loading}
              initialProductsLoaded={initialProductsLoaded}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
