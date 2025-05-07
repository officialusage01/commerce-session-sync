
import React from "react";
import { StockData } from "../types";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { TradeItem } from "./TradeItem";

interface StockGroupProps {
  stockName: string;
  stocks: StockData[];
  showDetailedView: boolean;
  analysisImagesHook?: (stockId: string | null, type: 'analysis' | 'result', maxImages?: number) => any;
  resultImagesHook?: (stockId: string | null, type: 'analysis' | 'result', maxImages?: number) => any;
}

export const StockGroup: React.FC<StockGroupProps> = ({
  stockName,
  stocks,
  showDetailedView,
  analysisImagesHook,
  resultImagesHook
}) => {
  const totalTrades = stocks.length;
  
  return (
    <div className="space-y-2">
      <Accordion type="single" collapsible className="bg-card rounded-md border">
        <AccordionItem value={stockName} className="border-none">
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex justify-between w-full">
              <span className="font-medium">{stockName}</span>
              <span className="text-sm text-muted-foreground">
                {totalTrades > 1 ? `${totalTrades} trades` : "1 trade"}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <div className="space-y-4">
              {stocks.map((stock, stockIndex) => (
                <TradeItem
                  key={stock.id}
                  stock={stock}
                  index={stockIndex}
                  showDetailedView={showDetailedView}
                  analysisImagesHook={analysisImagesHook}
                  resultImagesHook={resultImagesHook}
                  isFirst={stockIndex === 0}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
