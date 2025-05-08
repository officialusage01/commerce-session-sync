
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface FilterHeaderProps {
  isOpen: boolean;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onReset: () => void;
  onToggle?: () => void;
}

const EnhancedFilterHeader: React.FC<FilterHeaderProps> = ({
  isOpen,
  hasActiveFilters,
  activeFilterCount,
  onReset,
  onToggle
}) => {
  return (
    <motion.div
      className="flex items-center justify-between p-4 border-b"
      layout
    >
      <motion.button
        className="flex items-center gap-2"
        onClick={onToggle}
      >
        <span className="font-medium">Filters</span>
        {hasActiveFilters && (
          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {activeFilterCount}
          </span>
        )}
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground"
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </motion.div>
      </motion.button>
      
      {hasActiveFilters && (
        <motion.button
          className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground"
          onClick={onReset}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <X size={12} />
          <span>Clear all</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default EnhancedFilterHeader;
