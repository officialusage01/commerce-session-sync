
import React from 'react';
import { Button } from "@/components/ui/button";

interface PendingChangesFooterProps {
  pendingChanges: Record<string, string>;
  isUpdating: string | null;
  onCancel: () => void;
  onSave: () => void;
}

const PendingChangesFooter: React.FC<PendingChangesFooterProps> = ({
  pendingChanges,
  isUpdating,
  onCancel,
  onSave
}) => {
  if (Object.keys(pendingChanges).length === 0) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2 sticky bottom-0 pt-4 mt-4 border-t border-border/40 bg-background">
      <Button 
        variant="outline" 
        onClick={onCancel}
        disabled={isUpdating !== null}
      >
        Cancel
      </Button>
      <Button 
        onClick={onSave}
        disabled={isUpdating !== null}
      >
        {isUpdating === "saving" ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default PendingChangesFooter;
