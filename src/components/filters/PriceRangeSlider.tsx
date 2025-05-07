
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { formatCurrency } from '@/lib/utils';
import { IndianRupee } from 'lucide-react';

interface PriceRangeSliderProps {
  value: [number, number];
  min?: number;
  max: number;
  onChange: (values: [number, number]) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  value,
  min = 0,
  max,
  onChange,
}) => {
  const handleValueChange = (values: number[]) => {
    onChange([values[0], values[1]] as [number, number]);
  };

  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center space-x-2">
        <IndianRupee size={16} className="text-primary flex-shrink-0" />
        <Label className="text-sm font-medium">Price Range</Label>
      </div>
      
      <div className="pt-6 px-2">
        <Slider
          defaultValue={value}
          min={min}
          max={max}
          step={100}
          value={value}
          onValueChange={handleValueChange}
          className="mb-10" // Increased bottom margin to fix overlap
        />
      </div>
      
      <div className="flex items-center justify-between px-1 mt-2">
        <div className="bg-background border px-3 py-1.5 rounded-md text-sm font-medium shadow-sm">
          {formatCurrency(value[0])}
        </div>
        <div className="bg-background border px-3 py-1.5 rounded-md text-sm font-medium shadow-sm">
          {formatCurrency(value[1])}
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
