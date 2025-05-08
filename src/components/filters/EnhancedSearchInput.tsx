import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const EnhancedSearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Focus effect for better UX
  useEffect(() => {
    if (inputRef.current && isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  
  // Handle outside click to unfocus
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <motion.div 
      className={`relative rounded-md border border-input shadow-sm ${className} ${isFocused ? 'ring-2 ring-ring ring-offset-1' : ''} ${isHovered && !isFocused ? 'border-muted-foreground/50' : ''}`}
      initial={{ opacity: 0.9, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground flex items-center justify-center"
        animate={{ 
          scale: isFocused || value ? 0.9 : 1,
          color: isFocused ? 'var(--primary)' : 'var(--muted-foreground)'
        }}
      >
        <Search className="h-4 w-4" />
      </motion.div>
      
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className="w-full bg-transparent py-2 pl-9 pr-9 text-sm outline-none placeholder:text-muted-foreground"
      />
      
      <AnimatePresence>
        {value && (
          <motion.button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-6 h-6 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80"
            onClick={() => {
              onChange('');
              if (inputRef.current) inputRef.current.focus();
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            whileHover={{ backgroundColor: 'var(--muted)' }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedSearchInput;