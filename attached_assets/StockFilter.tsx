
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Package } from 'lucide-react';

interface StockFilterProps {
  value: 'all' | 'in-stock' | 'out-of-stock';
  onChange: (value: 'all' | 'in-stock' | 'out-of-stock') => void;
}

const StockFilter: React.FC<StockFilterProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Package size={16} className="text-primary" />
        <Label className="text-sm font-medium">Availability</Label>
      </div>
      
      <RadioGroup 
        value={value} 
        onValueChange={onChange as (value: string) => void}
        className="flex flex-col space-y-2"
      >
        <div className="flex items-center space-x-2 p-2 rounded-md transition-colors hover:bg-muted/50">
          <RadioGroupItem value="all" id="all" />
          <Label 
            htmlFor="all" 
            className={`text-sm cursor-pointer ${value === 'all' ? 'font-medium' : ''}`}
          >
            All Products
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 p-2 rounded-md transition-colors hover:bg-muted/50">
          <RadioGroupItem value="in-stock" id="in-stock" />
          <Label 
            htmlFor="in-stock" 
            className={`text-sm cursor-pointer ${value === 'in-stock' ? 'font-medium' : ''}`}
          >
            In Stock Only
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
              Available
            </span>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 p-2 rounded-md transition-colors hover:bg-muted/50">
          <RadioGroupItem value="out-of-stock" id="out-of-stock" />
          <Label 
            htmlFor="out-of-stock" 
            className={`text-sm cursor-pointer ${value === 'out-of-stock' ? 'font-medium' : ''}`}
          >
            Out of Stock Only
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">
              Sold Out
            </span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default StockFilter;
