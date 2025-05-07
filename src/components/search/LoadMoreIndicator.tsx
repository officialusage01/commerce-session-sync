
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadMoreIndicatorProps {
  loadingMore: boolean;
  hasMoreProducts: boolean;
  loadMoreRef: ((node?: Element | null) => void) | React.RefObject<HTMLDivElement>;
}

const LoadMoreIndicator: React.FC<LoadMoreIndicatorProps> = ({
  loadingMore,
  hasMoreProducts,
  loadMoreRef
}) => {
  if (!hasMoreProducts) return null;
  
  return (
    <div 
      ref={loadMoreRef as any} 
      className="w-full py-8 flex items-center justify-center"
    >
      {loadingMore ? (
        <div className="space-y-3 w-full max-w-md">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4 mx-auto" />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Scroll for more products
        </p>
      )}
    </div>
  );
};

export default LoadMoreIndicator;
