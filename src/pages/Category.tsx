
import React from 'react';
import { useParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileView from '@/components/MobileView';
import DesktopView from '@/components/DesktopView';

const Category = () => {
  const { id } = useParams();
  const categoryId = id || "";  // Convert to string which our interfaces expect
  const isMobile = useIsMobile();
  
  if (!categoryId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-500 mb-2">Invalid Category</p>
          <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {isMobile ? (
        <MobileView categoryId={categoryId} />
      ) : (
        <DesktopView categoryId={categoryId} />
      )}
    </div>
  );
};

export default Category;
