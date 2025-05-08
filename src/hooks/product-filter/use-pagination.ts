
import { useMemo, useEffect } from 'react';
import { Product } from '@/lib/supabase/types';
import { useSessionStorage } from '@/hooks/use-session-storage';

interface PaginationResult {
  paginatedProducts: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    setCurrentPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
}

/**
 * Hook to handle product pagination
 */
export function usePagination(filteredProducts: Product[]): PaginationResult {
  // Pagination state - using session storage for persistence
  const [currentPage, setCurrentPage] = useSessionStorage<number>('product-page', 1);
  const [pageSize, setPageSize] = useSessionStorage<number>('product-page-size', 10);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  }, [filteredProducts.length, pageSize]);
  
  // Make sure current page is valid
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage, setCurrentPage]);
  
  // Apply pagination to filtered products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);
  
  return {
    paginatedProducts,
    pagination: {
      currentPage,
      totalPages,
      pageSize,
      setCurrentPage,
      setPageSize,
    }
  };
}
