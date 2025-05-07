
import React from "react";
import { Loader2, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface InitializeStockContentProps {
  initializing: boolean;
  initError: boolean;
  retryInitialization: () => void;
}

export const InitializeStockContent: React.FC<InitializeStockContentProps> = ({
  initializing,
  initError,
  retryInitialization
}) => {
  if (initializing) {
    return (
      <div className="container mx-auto pt-24 pb-12 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold">Initializing Stock Management...</h2>
          <p className="text-muted-foreground">Please wait while we set up the database</p>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="container mx-auto pt-24 pb-12 flex items-center justify-center min-h-[50vh]">
        <Alert className="max-w-lg" variant="destructive">
          <AlertTitle>Database Initialization Failed</AlertTitle>
          <AlertDescription className="mt-2">
            <p>We couldn't initialize the stock database. This could be due to a temporary connection issue.</p>
            <Button 
              onClick={retryInitialization} 
              className="mt-4"
              variant="outline"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
};
