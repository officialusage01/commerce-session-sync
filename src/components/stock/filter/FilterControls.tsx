
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FilterCriteria } from "@/hooks/useDataFiltering";

interface FilterControlsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filterCriteria: FilterCriteria;
  setStockNameFilter: (value: string) => void;
  setStartDate: (date: Date | undefined) => void;
  setEndDate: (date: Date | undefined) => void;
  setPlThreshold: (value: string) => void;
  onClearFilters: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  open,
  onOpenChange,
  filterCriteria,
  setStockNameFilter,
  setStartDate,
  setEndDate,
  setPlThreshold,
  onClearFilters,
}) => {
  const { stockNameFilter, startDate, endDate, plThreshold } = filterCriteria;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Stocks</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="stockFilter">Stock Name</Label>
            <Input
              id="stockFilter"
              placeholder="Filter by stock name..."
              value={stockNameFilter}
              onChange={(e) => setStockNameFilter(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Label className="text-xs">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex-1">
                <Label className="text-xs">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="plFilter">Minimum P/L Percentage</Label>
            <Input
              id="plFilter"
              type="number"
              placeholder="e.g. 5 for 5%"
              value={plThreshold}
              onChange={(e) => setPlThreshold(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onClearFilters}>
              Clear Filters
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const FilterButton: React.FC<{
  onClick: () => void;
  className?: string;
}> = ({ onClick, className }) => {
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={onClick}
      className={cn("flex items-center gap-1", className)}
    >
      <Filter className="h-4 w-4" />
      Filter
    </Button>
  );
};
