
import React from "react";
import { StockData } from "../types";
import { Separator } from "@/components/ui/separator";
import { formatDistance } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StockImagesContainer } from "./StockImagesContainer";

interface TradeItemProps {
  stock: StockData;
  index: number;
  showDetailedView: boolean;
  analysisImagesHook?: (stockId: string | null, type: 'analysis' | 'result', maxImages?: number) => any;
  resultImagesHook?: (stockId: string | null, type: 'analysis' | 'result', maxImages?: number) => any;
  isFirst: boolean;
}

export const TradeItem: React.FC<TradeItemProps> = ({
  stock,
  index,
  showDetailedView,
  analysisImagesHook,
  resultImagesHook,
  isFirst
}) => {
  const profitLoss = stock.profitLossPercentage || 0;
  const isProfitable = profitLoss > 0;
  const tradeDuration = stock.exitDate && stock.entryDate 
    ? formatDistance(new Date(stock.exitDate), new Date(stock.entryDate))
    : 'Ongoing';
  
  return (
    <div className="space-y-3">
      {!isFirst && <Separator />}
      <h4 className="font-medium mt-3">
        Trade {index + 1} {stock.exitDate && isProfitable ? 
          <CheckCircle className="h-4 w-4 text-green-500 inline ml-1" /> :
          stock.exitDate ? <XCircle className="h-4 w-4 text-red-500 inline ml-1" /> : null
        }
      </h4>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Entry Price</p>
          <p className="font-medium">${stock.entryPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Exit Price</p>
          <p className="font-medium">
            {stock.exitPrice 
              ? `$${stock.exitPrice.toFixed(2)}` 
              : 'Pending'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Entry Date</p>
          <p className="font-medium">{new Date(stock.entryDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Exit Date</p>
          <p className="font-medium">
            {stock.exitDate 
              ? new Date(stock.exitDate).toLocaleDateString()
              : 'Pending'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Quantity</p>
          <p className="font-medium">{stock.quantity}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Stop Loss</p>
          <p className="font-medium">
            {stock.stopLossPrice 
              ? `$${stock.stopLossPrice.toFixed(2)}`
              : 'Not set'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Profit/Loss</p>
          <p className={cn(
            "font-medium",
            isProfitable ? "text-green-600" : "text-red-600"
          )}>
            {stock.profitLossPercentage 
              ? `${stock.profitLossPercentage > 0 ? '+' : ''}${stock.profitLossPercentage.toFixed(2)}%`
              : 'Pending'}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Duration</p>
          <p className="font-medium">{tradeDuration}</p>
        </div>
      </div>
      
      {/* Render detailed view with images if needed */}
      {showDetailedView && analysisImagesHook && resultImagesHook && (
        <StockImagesContainer 
          stock={stock}
          analysisImagesHook={analysisImagesHook}
          resultImagesHook={resultImagesHook}
          viewOnly={true}
        />
      )}
    </div>
  );
};
