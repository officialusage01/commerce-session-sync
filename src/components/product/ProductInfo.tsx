
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductInfoProps {
  name: string;
  description: string;
  price: number;
  stock: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  name, 
  description, 
  price, 
  stock 
}) => {
  // Determine availability status
  const getAvailabilityStatus = () => {
    if (stock <= 0) {
      return { class: 'bg-red-100 text-red-800', text: 'Out of Stock' };
    } else if (stock < 5) {
      return { class: 'bg-amber-100 text-amber-800', text: `Only ${stock} left` };
    } else {
      return { class: 'bg-green-100 text-green-800', text: 'In Stock' };
    }
  };
  
  const availability = getAvailabilityStatus();
  
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
      
      <div className="flex items-center space-x-4 mt-4">
        <span className="text-2xl font-bold">${price.toFixed(2)}</span>
        <Badge variant="secondary" className={`${availability.class} border-0`}>
          {availability.text}
        </Badge>
      </div>
      
      <div className="mt-6 prose max-w-none">
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      {/* Additional Product Metadata */}
      <dl className="mt-8 grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Availability</dt>
          <dd className="mt-1 text-sm font-medium">{availability.text}</dd>
        </div>
        
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Shipping</dt>
          <dd className="mt-1 text-sm font-medium">
            {stock > 0 ? 'Usually ships within 1-2 business days' : 'Not available'}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default ProductInfo;
