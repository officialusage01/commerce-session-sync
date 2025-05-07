
import React from 'react';
import { Grid2X2, LayoutList } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  setViewMode: (value: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, setViewMode }) => {
  return (
    <ToggleGroup 
      type="single" 
      value={viewMode}
      onValueChange={(value) => {
        if (value) setViewMode(value as 'grid' | 'list');
      }}
      className="border rounded-md"
    >
      <ToggleGroupItem value="grid" aria-label="Grid view">
        <Grid2X2 className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        <LayoutList className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ViewToggle;
