
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotFoundStateProps {
  onGoBack: () => void;
}

const NotFoundState = ({ onGoBack }: NotFoundStateProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl font-bold text-red-500 mb-2">Product Not Found</p>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Button onClick={onGoBack}>
          <ArrowLeft size={16} className="mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFoundState;
