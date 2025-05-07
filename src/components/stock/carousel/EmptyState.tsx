
import React from "react";

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[200px] bg-muted/20 rounded-lg border border-dashed">
      <p className="text-muted-foreground">No images uploaded yet</p>
    </div>
  );
};
