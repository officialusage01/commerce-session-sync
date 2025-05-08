import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee } from 'lucide-react';

interface PriceRangeSliderProps {
  value: [number, number];
  min?: number;
  max: number;
  onChange: (values: [number, number]) => void;
  className?: string;
}

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const EnhancedPriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  value,
  min = 0,
  max,
  onChange,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  
  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };
  
  const leftThumbPosition = getPercentage(value[0]);
  const rightThumbPosition = getPercentage(value[1]);
  
  // Calculate preview value based on mouse position
  const getValueAtPosition = (percentage: number) => {
    return Math.round(((percentage / 100) * (max - min) + min) / 50) * 50;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging === null) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = getValueAtPosition(percentage);
    
    let newValues: [number, number] = [...value] as [number, number];
    
    if (isDragging === 0) {
      // Left thumb
      newValues[0] = Math.min(newValue, value[1] - 50);
    } else {
      // Right thumb
      newValues[1] = Math.max(newValue, value[0] + 50);
    }
    
    onChange(newValues);
  };
  
  const handleMouseUp = () => {
    setIsDragging(null);
    document.body.classList.remove('select-none');
  };
  
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    const clickedValue = getValueAtPosition(percentage);
    
    // Determine which thumb to move based on which is closer
    const leftDistance = Math.abs(clickedValue - value[0]);
    const rightDistance = Math.abs(clickedValue - value[1]);
    
    let newValues: [number, number] = [...value] as [number, number];
    
    if (leftDistance <= rightDistance) {
      newValues[0] = Math.min(clickedValue, value[1] - 50);
    } else {
      newValues[1] = Math.max(clickedValue, value[0] + 50);
    }
    
    onChange(newValues);
  };
  
  const handleTrackHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    setHoverPosition(percentage);
  };

  React.useEffect(() => {
    if (isDragging !== null) {
      document.body.classList.add('select-none');
      
      const handleGlobalMouseUp = () => {
        setIsDragging(null);
        document.body.classList.remove('select-none');
      };
      
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('mouseleave', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('mouseleave', handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <motion.div 
      className={`space-y-4 p-5 bg-muted/50 hover:bg-muted/80 rounded-lg transition-colors ${className}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <motion.div 
            className="p-1.5 rounded-full bg-primary/10 text-primary"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--primary-rgb), 0.2)' }}
          >
            <IndianRupee size={16} />
          </motion.div>
          <span className="text-sm font-medium">Price Range</span>
        </div>
        
        <AnimatePresence>
          {(value[0] > min || value[1] < max) && (
            <motion.button
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={() => onChange([min, max])}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      
      <div className="relative h-12 select-none">
        <div 
          className="absolute h-1.5 bg-muted-foreground/20 rounded-full left-0 right-0 top-1/2 -translate-y-1/2 cursor-pointer"
          onMouseMove={handleTrackHover}
          onMouseLeave={() => setHoverPosition(null)}
          onClick={handleTrackClick}
        />
        
        {/* Selected range */}
        <motion.div 
          className="absolute h-1.5 bg-primary rounded-full top-1/2 -translate-y-1/2"
          style={{ 
            left: `${leftThumbPosition}%`, 
            right: `${100 - rightThumbPosition}%` 
          }}
          animate={{
            backgroundColor: isDragging !== null ? 'var(--primary)' : 'var(--primary)',
          }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Left thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-md border border-primary/50 cursor-grab active:cursor-grabbing z-10 flex items-center justify-center"
          style={{ left: `${leftThumbPosition}%` }}
          animate={{ 
            scale: isDragging === 0 ? 1.2 : 1,
            backgroundColor: isDragging === 0 ? 'var(--primary-foreground)' : 'white',
            borderColor: isDragging === 0 ? 'var(--primary)' : 'var(--primary-300)'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1.2, cursor: 'grabbing' }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsDragging(0);
          }}
        >
          <AnimatePresence>
            {isDragging === 0 && (
              <motion.div 
                className="absolute top-8 bg-primary text-primary-foreground py-1 px-2 rounded text-xs whitespace-nowrap"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {formatCurrency(value[0])}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Right thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full shadow-md border border-primary/50 cursor-grab active:cursor-grabbing z-10 flex items-center justify-center"
          style={{ left: `${rightThumbPosition}%` }}
          animate={{ 
            scale: isDragging === 1 ? 1.2 : 1,
            backgroundColor: isDragging === 1 ? 'var(--primary-foreground)' : 'white',
            borderColor: isDragging === 1 ? 'var(--primary)' : 'var(--primary-300)'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1.2, cursor: 'grabbing' }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsDragging(1);
          }}
        >
          <AnimatePresence>
            {isDragging === 1 && (
              <motion.div 
                className="absolute top-8 bg-primary text-primary-foreground py-1 px-2 rounded text-xs whitespace-nowrap"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {formatCurrency(value[1])}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Hover preview */}
        <AnimatePresence>
          {hoverPosition !== null && isDragging === null && (
            <motion.div
              className="absolute top-[-20px] text-xs bg-background border shadow-sm rounded px-2 py-0.5 -translate-x-1/2 pointer-events-none"
              style={{ left: `${hoverPosition}%` }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              {formatCurrency(getValueAtPosition(hoverPosition))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex items-center justify-between mt-1">
        <motion.div 
          className="bg-background border px-3 py-1 rounded text-sm shadow-sm flex items-center"
          animate={{ 
            scale: isDragging === 0 ? 1.05 : 1,
            backgroundColor: isDragging === 0 ? 'var(--primary-100)' : 'var(--background)'
          }}
        >
          {formatCurrency(value[0])}
        </motion.div>
        <span className="text-muted-foreground text-xs mx-2">to</span>
        <motion.div 
          className="bg-background border px-3 py-1 rounded text-sm shadow-sm flex items-center"
          animate={{ 
            scale: isDragging === 1 ? 1.05 : 1,
            backgroundColor: isDragging === 1 ? 'var(--primary-100)' : 'var(--background)'
          }}
        >
          {formatCurrency(value[1])}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnhancedPriceRangeSlider;