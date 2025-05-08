import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, CheckCircle2, XCircle, CircleDot } from 'lucide-react';

interface StockFilterProps {
  value: 'all' | 'in-stock' | 'out-of-stock';
  onChange: (value: 'all' | 'in-stock' | 'out-of-stock') => void;
  className?: string;
}

const EnhancedStockFilter: React.FC<StockFilterProps> = ({ 
  value, 
  onChange,
  className = '' 
}) => {
  return (
    <motion.div 
      className={`space-y-3 p-4 rounded-lg bg-muted/30 ${className}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-2">
        <motion.div 
          className="p-1.5 rounded-full bg-amber-100 text-amber-700"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(251, 191, 36, 0.3)' }}
        >
          <Package size={16} />
        </motion.div>
        <span className="text-sm font-medium">Availability</span>
      </div>
      
      <div className="mt-2 space-y-1.5">
        <StockOption
          id="all"
          label="All Products"
          value="all"
          currentValue={value}
          onChange={onChange}
          icon={<CircleDot size={16} />}
          badge={null}
        />
        
        <StockOption
          id="in-stock"
          label="In Stock Only"
          value="in-stock"
          currentValue={value}
          onChange={onChange}
          icon={<CheckCircle2 size={16} />}
          badge={
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-green-100 text-green-800 font-medium">
              Available
            </span>
          }
        />
        
        <StockOption
          id="out-of-stock"
          label="Out of Stock Only"
          value="out-of-stock"
          currentValue={value}
          onChange={onChange}
          icon={<XCircle size={16} />}
          badge={
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">
              Sold Out
            </span>
          }
        />
      </div>
    </motion.div>
  );
};

interface StockOptionProps {
  id: string;
  label: string;
  value: 'all' | 'in-stock' | 'out-of-stock';
  currentValue: 'all' | 'in-stock' | 'out-of-stock';
  onChange: (value: 'all' | 'in-stock' | 'out-of-stock') => void;
  icon: React.ReactNode;
  badge: React.ReactNode;
}

const StockOption: React.FC<StockOptionProps> = ({
  id,
  label,
  value,
  currentValue,
  onChange,
  icon,
  badge
}) => {
  const isSelected = value === currentValue;
  
  // Different colors for each option
  const getOptionColor = () => {
    switch (value) {
      case 'in-stock': return "var(--success)";
      case 'out-of-stock': return "var(--destructive)";
      default: return "var(--primary)";
    }
  };
  
  return (
    <motion.div
      className={`relative flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer ${
        isSelected 
          ? 'bg-background shadow-sm border border-input' 
          : 'hover:bg-muted/80 hover:shadow-sm'
      }`}
      onClick={() => onChange(value)}
      whileHover={{ 
        scale: isSelected ? 1 : 1.02,
        backgroundColor: isSelected ? 'var(--background)' : 'var(--muted)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence>
        {isSelected ? (
          <motion.div 
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-md"
            style={{ backgroundColor: getOptionColor() }}
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            exit={{ height: 0 }}
          />
        ) : null}
      </AnimatePresence>
      
      <div className="relative flex-shrink-0 w-4 h-4">
        <motion.div 
          className="absolute inset-0 rounded-full border border-input"
          animate={{ 
            borderColor: isSelected ? getOptionColor() : 'var(--input)',
            borderWidth: isSelected ? '2px' : '1px'
          }}
        />
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: getOptionColor() }}
            >
              {icon}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex items-center">
        <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
          {label}
        </span>
        {badge}
      </div>
    </motion.div>
  );
};

export default EnhancedStockFilter;