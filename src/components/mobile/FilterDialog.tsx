
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
      <DrawerTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full bg-white/20 backdrop-blur-sm border-white/10 text-white flex items-center gap-2 h-12 w-full"
        >
          <Filter className="h-4 w-4" /> 
          <span>Filters</span>
          {filterCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 min-w-5 rounded-full text-xs flex items-center justify-center px-1.5">
              {filterCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </DrawerTitle>
          <DrawerDescription>
            Refine your product search with these filters
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="px-4 overflow-y-auto flex-1 max-h-[50vh]">
          <div className="pb-4">
            <ProductFilter
              maxPrice={maxPrice}
              onFilterChange={handleFilterChange}
              initialFilters={initialFilters}
              onClearFilters={onClearFilters}
              compact
            />
          </div>
        </ScrollArea>
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
