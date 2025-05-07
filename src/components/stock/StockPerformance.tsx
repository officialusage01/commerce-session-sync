
import React from "react";
import { formatDistanceStrict } from "date-fns";
import { ArrowDown, ArrowUp, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { PerformanceData } from "./types";

interface StockPerformanceProps {
  data: PerformanceData;
}

export const StockPerformance: React.FC<StockPerformanceProps> = ({ data }) => {
  // Add a check to ensure data and required properties exist before calculating
  const hasValidDates = data && data.entryDate && data.exitDate;
  const holdingPeriod = hasValidDates 
    ? formatDistanceStrict(new Date(data.entryDate), new Date(data.exitDate))
    : "N/A";
  
  // Check if we have a valid exit price
  const hasCompletedTrade = data && data.exitPrice > 0;
  
  // If this is a placeholder data (empty or default values)
  const isPlaceholderData = !data || 
    (data.stockName === "Select or add a stock" && data.entryPrice === 0 && data.exitPrice === 0);
  
  if (isPlaceholderData) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No performance data available
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold">{data.stockName || "Unknown Stock"}</h3>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <p>
            Trade duration: {holdingPeriod}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Entry Price</p>
            <p className="text-lg font-medium">${data.entryPrice ? data.entryPrice.toFixed(2) : "0.00"}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <p>{data.entryDate ? new Date(data.entryDate).toLocaleDateString() : "N/A"} {data.entryDate ? new Date(data.entryDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</p>
            </div>
          </div>
          
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Exit Price</p>
            <p className="text-lg font-medium">
              {hasCompletedTrade ? `$${data.exitPrice.toFixed(2)}` : "Pending"}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <p>{data.exitDate ? new Date(data.exitDate).toLocaleDateString() : "N/A"} {data.exitDate ? new Date(data.exitDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          {hasCompletedTrade ? (
            <>
              <div className="flex justify-center items-center">
                <div className={cn(
                  "flex items-center text-2xl font-bold",
                  data.isProfitable ? "text-green-500" : "text-red-500"
                )}>
                  {data.isProfitable ? (
                    <ArrowUp className="mr-1" />
                  ) : (
                    <ArrowDown className="mr-1" />
                  )}
                  {Math.abs(data.profitLossPercentage).toFixed(2)}%
                </div>
              </div>
              
              <div className="text-center mt-2">
                <p className="text-sm text-muted-foreground">
                  {data.isProfitable ? "Profit" : "Loss"}: ${Math.abs(data.exitPrice - data.entryPrice).toFixed(2)} per share
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Enter exit price to calculate profit/loss
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
