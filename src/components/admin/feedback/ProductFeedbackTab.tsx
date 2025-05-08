
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { FeedbackItem, ProductFeedbackTabProps } from './types';
import ProductFeedbackDialog from './ProductFeedbackDialog';
import ProductFeedbackTable from './ProductFeedbackTable';

interface ExtendedProductFeedbackTabProps extends ProductFeedbackTabProps {
  updateFeedbackCount?: (count: number) => void;
}

const ProductFeedbackTab = ({ 
  selectedFeedback, 
  setSelectedFeedback,
  updateFeedbackCount 
}: ExtendedProductFeedbackTabProps) => {
  const [productFeedback, setProductFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    loadProductFeedback();
  }, [currentPage]);

  useEffect(() => {
    // Update parent component with total count
    if (updateFeedbackCount && totalCount > 0) {
      updateFeedbackCount(totalCount);
    }
  }, [totalCount, updateFeedbackCount]);

  const loadProductFeedback = async () => {
    try {
      setLoading(true);
      
      // Get total count
      const { count } = await supabase
        .from('product_feedbacks')
        .select('*', { count: 'exact', head: true });
      
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));

      // Get paginated feedback with product details only (no user join)
      const { data, error } = await supabase
        .from('product_feedbacks')
        .select(`
          *,
          product:products(name)
        `)
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProductFeedback(data || []);
    } catch (error) {
      console.error('Error loading product feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <ProductFeedbackTable
            productFeedback={productFeedback}
            setSelectedFeedback={setSelectedFeedback}
          />

          <div className="flex items-center justify-between space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      <ProductFeedbackDialog 
        selectedFeedback={selectedFeedback} 
        setSelectedFeedback={setSelectedFeedback} 
      />
    </>
  );
};

export default ProductFeedbackTab;
