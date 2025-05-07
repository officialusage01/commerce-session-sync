
import React from 'react';
import { Subcategory } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SubcategorySelectorProps {
  subcategories: Subcategory[];
  selectedSubcategoryId: string | null;
  onSelect: (subcategoryId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SubcategorySelector: React.FC<SubcategorySelectorProps> = ({
  subcategories,
  selectedSubcategoryId,
  onSelect,
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full bg-white/20 backdrop-blur-sm border-white/10 text-white">
          Subcategories
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Select Subcategory</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2 py-4">
          {subcategories.map(subcategory => (
            <Button 
              key={subcategory.id}
              variant={selectedSubcategoryId === subcategory.id ? "default" : "outline"}
              onClick={() => onSelect(subcategory.id)}
              className="justify-start"
            >
              {subcategory.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubcategorySelector;
