
import React from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { TradeAccordion } from "../TradeAccordion";
import { StockData } from "../types";
import { useStockImages } from "@/hooks/useStockImages";

interface TradeDetailsCardProps {
  stocks: StockData[];
  selectedDate: string | null;
}

export const TradeDetailsCard: React.FC<TradeDetailsCardProps> = ({
  stocks,
  selectedDate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Details</CardTitle>
        <CardDescription>
          {selectedDate && new Date(selectedDate).toLocaleDateString()} - {stocks.length} trades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TradeAccordion 
          stocks={stocks} 
          showDetailedView={true}
          analysisImagesHook={useStockImages}
          resultImagesHook={useStockImages}
        />
      </CardContent>
    </Card>
  );
};
