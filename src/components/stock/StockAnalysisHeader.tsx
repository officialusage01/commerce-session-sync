
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface StockAnalysisHeaderProps {
  title: string;
  onClearAll: () => void;
}

export const StockAnalysisHeader: React.FC<StockAnalysisHeaderProps> = ({
  title,
  onClearAll
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <Button 
        variant="outline" 
        onClick={onClearAll}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Clear All
      </Button>
    </div>
  );
};
