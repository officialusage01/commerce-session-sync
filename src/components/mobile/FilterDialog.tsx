
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ProductFilter from '@/components/ProductFilter';
import { FilterOptions } from '@/components/filters/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from 'framer-motion';

interface FilterDialogProps {
  maxPrice: number;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  initialFilters: FilterOptions;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterCount: number;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  maxPrice,
  onFilterChange,
  onClearFilters,
  initialFilters,
  open,
  onOpenChange,
  filterCount = 0
}) => {
  const handleFilterChange = (newFilters: FilterOptions) => {
    onFilterChange(newFilters);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
            <AnimatePresence mode="wait">
              {filterCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="ml-2"
                >
                  <Badge variant="default" className="h-5 min-w-5 rounded-full text-xs flex items-center justify-center px-1.5">
                    {filterCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </DrawerTitle>
          <DrawerDescription>
            Refine your product search with these filters
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <ProductFilter
            maxPrice={maxPrice}
            onFilterChange={handleFilterChange}
            initialFilters={initialFilters}
            onClearFilters={onClearFilters}
            compact
          />
        </div>
        <DrawerFooter className="flex flex-row justify-between border-t p-4">
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" /> Clear Filters
          </Button>
          <DrawerClose asChild>
            <Button>Apply Filters</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDialog;
