
import { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '@/lib/supabase/types';
import { useDebounce } from './use-debounce';

export function useSearchContainer(products: Product[], initialProductsLoaded: boolean) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [loading, setLoading] = useState(false);
  
  // Filter products based on search term only
  const filteredProducts = products.filter(product => {
    if (!debouncedSearchTerm) return true;
    
    return (
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );
  });
  
  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [debouncedSearchTerm]);
  
  // Visible products are a slice of filtered products
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  
  // Load more products when the user scrolls to the bottom
  const hasMoreProducts = visibleCount < filteredProducts.length;
  
  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !initialProductsLoaded) return;
    
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreProducts && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            setVisibleCount(prev => prev + 12);
            setLoadingMore(false);
          }, 500); // Simulated loading time
        }
      },
      { threshold: 1.0 }
    );
    
    observer.observe(loadMoreRef.current);
    
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMoreProducts, loadingMore, initialProductsLoaded]);
  
  // Handle search form submission
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the effect above
  }, []);
  
  // Clear search
  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);
  
  return {
    searchTerm,
    setSearchTerm,
    filteredProducts,
    visibleProducts,
    viewMode,
    setViewMode,
    loadingMore,
    hasMoreProducts,
    loadMoreRef,
    handleSearch,
    clearSearch,
    loading
  };
}
