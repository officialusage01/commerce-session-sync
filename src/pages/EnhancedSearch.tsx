
import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/supabase/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Loader2, ArrowLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchContainer from '@/components/search/SearchContainer';
import { EnhancedFilterSystem } from '@/components/filters';
import { FilterOptions } from '@/components/filters/types';

const EnhancedSearch = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialProductsLoaded, setInitialProductsLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [initialLoadAnimation, setInitialLoadAnimation] = useState(true);
  
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
          
          // Simulate load to show animation
          setTimeout(() => {
            setInitialLoadAnimation(false);
          }, 800);
          return;
        }

        // Fetch categories and subcategories in parallel
        const [categories, subcategoriesArrays] = await Promise.all([
          getProducts(),
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
        
        // Simulate load to show animation
        setTimeout(() => {
          setInitialLoadAnimation(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching products:', error);
        setInitialProductsLoaded(true);
        setInitialLoadAnimation(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllProducts();
  }, []);

  // Define initial filters with the correct type for priceRange
  const initialFilters: FilterOptions = {
    search: '',
    priceRange: [0, 100000] as [number, number],
    stockStatus: 'all' as 'all' | 'in-stock' | 'out-of-stock',
    categories: [],
    subcategories: []
  };
  
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  
  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <AnimatePresence>
      {initialLoadAnimation ? (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-background z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop" 
              }}
            >
              <Search className="h-16 w-16 text-primary" />
            </motion.div>
            <motion.p 
              className="mt-4 text-lg font-medium text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading products...
            </motion.p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container max-w-7xl mx-auto">
            {/* Header */}
            <motion.div 
              className="mb-12 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 gradient-text">Discover Products</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Browse our extensive collection of products. Use filters to find exactly what you're looking for.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar */}
              <motion.div 
                className="lg:col-span-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="glass-card rounded-xl overflow-hidden sticky top-24">
                  <EnhancedFilterSystem
                    filters={filters}
                    onFiltersChange={handleFilterChange}
                    defaultPriceRange={[0, 100000]}
                  />
                </div>
              </motion.div>
              
              {/* Main Content */}
              <motion.div 
                className="lg:col-span-9"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-6 border border-border">
                  <SearchContainer 
                    allProducts={allProducts}
                    loading={loading}
                    initialProductsLoaded={initialProductsLoaded}
                  />
                </div>
                
                {/* Mobile-only back to top button */}
                {isMobile && (
                  <motion.button
                    className="fixed bottom-6 right-6 p-4 rounded-full bg-primary text-white shadow-lg z-10"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <ArrowLeft className="h-5 w-5 rotate-90" />
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedSearch;
