
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileEmptyStateProps {
  hasProducts: boolean;
}

const MobileEmptyState: React.FC<MobileEmptyStateProps> = ({ hasProducts }) => {
  const navigate = useNavigate();
  
  return (
    <div className="mobile-story-container flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          {hasProducts 
            ? 'No products match your filters' 
            : 'No products found'}
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center justify-center space-x-2 mx-auto bg-primary text-primary-foreground px-4 py-2 rounded-full"
        >
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};

export default MobileEmptyState;
