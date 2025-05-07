
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StockDateTree } from "@/components/stock/StockDateTree";
import { DateNode } from "./types";

interface StockDateNavigatorProps {
  dateNodes: DateNode[];
  loading: boolean;
  onSelectDate: (date: string) => void;
}

export const StockDateNavigator: React.FC<StockDateNavigatorProps> = ({
  dateNodes,
  loading,
  onSelectDate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Date Navigator</CardTitle>
        <CardDescription>Browse by date</CardDescription>
      </CardHeader>
      <CardContent>
        <StockDateTree 
          dateNodes={dateNodes} 
          loading={loading} 
          onSelectDate={onSelectDate} 
          expandedByDefault="current-month"
        />
      </CardContent>
    </Card>
  );
};
