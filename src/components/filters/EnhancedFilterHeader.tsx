import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronUp, ChevronDown } from 'lucide-react';

interface FilterHeaderProps {
  isOpen: boolean;
  hasActiveFilters: boolean;
  activeFilterCount?: number;
  onReset: () => void;
  onToggle: () => void;
  className?: string;
}

const EnhancedFilterHeader: React.FC<FilterHeaderProps> = ({ 
  isOpen, 
  hasActiveFilters, 
  activeFilterCount = 0,
  onReset,
  onToggle,
  className = ''
}) => {
  return (
    <motion.div 
      className={`flex items-center justify-between p-4 border-b bg-background rounded-t-md ${className}`}
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h3 
        className="font-medium flex items-center text-sm"
        layout
      >
        <motion.div 
          className="mr-2 p-1 rounded-full bg-primary/10 text-primary"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--primary-rgb), 0.2)' }}
        >
          <Filter className="h-4 w-4" />
        </motion.div>
        
        <span>Filter Products</span>
        
        <AnimatePresence>
          {hasActiveFilters && activeFilterCount > 0 && (
            <motion.span 
              className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              {activeFilterCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.h3>
      
      <div className="flex gap-2">
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              className="h-8 px-2 text-xs rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center"
              onClick={onReset}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0, marginRight: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-3 w-3 mr-1" /> Clear All
            </motion.button>
          )}
        </AnimatePresence>
        
        <motion.button
          className="h-8 px-3 text-xs rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors flex items-center"
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span layout="position">
            {isOpen ? 'Hide Filters' : 'Show Filters'}
          </motion.span>
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="ml-1.5"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </motion.div>
        </motion.button>
      </div>
      
      {/* Indicator line */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div 
            className="absolute bottom-0 left-0 h-0.5 bg-primary"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            exit={{ width: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedFilterHeader;