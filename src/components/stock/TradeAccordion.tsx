
import React from "react";
import { StockData } from "./types";
import { StockGroup } from "./trade-accordion/StockGroup";

interface TradeAccordionProps {
  stocks: StockData[];
  showDetailedView?: boolean;
  analysisImagesHook?: (stockId: string | null, type: 'analysis' | 'result', maxImages?: number) => any;
  resultImagesHook?: (stockId: string | null, type: 'analysis' | 'result', maxImages?: number) => any;
}

export const TradeAccordion: React.FC<TradeAccordionProps> = ({ 
  stocks,
  showDetailedView = false,
  analysisImagesHook,
  resultImagesHook
}) => {
  // Group stocks by stockName to handle multiple trades of the same stock
  const groupedStocks = stocks.reduce((acc, stock) => {
    if (!acc[stock.stockName]) {
      acc[stock.stockName] = [];
    }
    acc[stock.stockName].push(stock);
    return acc;
  }, {} as Record<string, StockData[]>);

  const sortedStockNames = Object.keys(groupedStocks).sort();

  return (
    <div className="space-y-4">
      {sortedStockNames.map((stockName) => (
        <StockGroup
          key={stockName}
          stockName={stockName}
          stocks={groupedStocks[stockName]}
          showDetailedView={showDetailedView}
          analysisImagesHook={analysisImagesHook}
          resultImagesHook={resultImagesHook}
        />
      ))}
    </div>
  );
};
