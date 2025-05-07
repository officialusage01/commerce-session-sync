
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabSelectorProps {
  defaultTab: string;
  children: React.ReactNode;
  onTabChange?: (tab: string) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ 
  defaultTab, 
  children,
  onTabChange
}) => {
  const handleValueChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <Tabs defaultValue={defaultTab} className="w-full" onValueChange={handleValueChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="table">Table View</TabsTrigger>
        <TabsTrigger value="details">Details View</TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};
