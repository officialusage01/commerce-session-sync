
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { initStockTables } from "@/services/stockIndex";

interface StockAnalysisInitializerProps {
  onInitialize: (date: string) => void;
  children: (state: {
    initializing: boolean;
    initError: boolean;
    retryInitialization: () => void;
  }) => React.ReactNode;
}

export const StockAnalysisInitializer: React.FC<StockAnalysisInitializerProps> = ({
  onInitialize,
  children
}) => {
  const [initializing, setInitializing] = useState(true);
  const [initError, setInitError] = useState<boolean>(false);

  const setupTables = async () => {
    try {
      setInitializing(true);
      setInitError(false);
      const success = await initStockTables();
      
      if (!success) {
        setInitError(true);
        toast.error("Failed to initialize stock tables. Try refreshing the page.");
      } else {
        // Set default to current year on page load
        const currentYear = new Date().getFullYear().toString();
        onInitialize(currentYear);
      }
    } catch (err) {
      console.error("Failed to initialize stock tables:", err);
      setInitError(true);
      toast.error("Failed to initialize database tables");
    } finally {
      setInitializing(false);
    }
  };
  
  const retryInitialization = () => {
    toast.info("Retrying database initialization...");
    setInitializing(true);
    setInitError(false);
    initStockTables()
      .then(success => {
        if (!success) {
          setInitError(true);
          toast.error("Failed to initialize stock tables. Try refreshing the page.");
        } else {
          toast.success("Database initialized successfully");
          const currentYear = new Date().getFullYear().toString();
          onInitialize(currentYear);
        }
      })
      .catch(err => {
        console.error("Failed to initialize stock tables:", err);
        setInitError(true);
        toast.error("Failed to initialize database tables");
      })
      .finally(() => {
        setInitializing(false);
      });
  };

  useEffect(() => {
    setupTables();
  }, []);

  return <>{children({
    initializing,
    initError,
    retryInitialization
  })}</>;
};
