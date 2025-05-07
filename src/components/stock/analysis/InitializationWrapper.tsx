import React from "react";
import { InitializeStockContent } from "../InitializeStockContent";

interface InitializationWrapperProps {
  initializing: boolean;
  initError: boolean;
  retryInitialization: () => void;
  children: React.ReactNode;
}

export const InitializationWrapper: React.FC<InitializationWrapperProps> = ({
  initializing,
  initError,
  retryInitialization,
  children
}) => {
  // If we're initializing or there's an error, show the initialization content
  if (initializing || initError) {
    return (
      <InitializeStockContent
        initializing={initializing}
        initError={initError}
        retryInitialization={retryInitialization}
      />
    );
  }
  
  // Otherwise, render the children
  return <>{children}</>;
};
