
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, RefreshCw } from "lucide-react";
import { FilterButton } from "../FilterControls";

interface TableActionsProps {
  selectedCount: number;
  viewOnly: boolean;
  onFilterClick: () => void;
  onRefreshClick: () => void;
  onAddClick: () => void;
  onDeleteClick: () => void;
  isDeleting?: boolean;
}

export const TableActions: React.FC<TableActionsProps> = ({
  selectedCount,
  viewOnly,
  onFilterClick,
  onRefreshClick,
  onAddClick,
  onDeleteClick,
  isDeleting = false
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        {!viewOnly && selectedCount > 0 && (
          <span>{selectedCount} stock{selectedCount === 1 ? '' : 's'} selected</span>
        )}
      </div>
      <div className="flex space-x-2">
        {!viewOnly && (
          <>
            <FilterButton onClick={onFilterClick} />
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefreshClick}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={onAddClick}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
            
            {selectedCount > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onDeleteClick}
                disabled={isDeleting}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
