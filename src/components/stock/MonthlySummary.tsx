
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MonthlyPerformance, StockData } from "./types";
import { TrendingUp, TrendingDown, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { calculateMonthlyPerformance } from "@/services/stockPerformance";
import { format } from "date-fns";

interface MonthlySummaryProps {
  stocks: StockData[];
}

export const MonthlySummary: React.FC<MonthlySummaryProps> = ({ stocks }) => {
  // Calculate performance metrics from stocks
  const performance = useMemo(() => {
    const metrics = calculateMonthlyPerformance(stocks);
    
    // Get month and year from the first stock (assuming all stocks are from same month)
    if (stocks.length > 0) {
      const firstStock = stocks[0];
      const monthName = format(firstStock.entryDate, 'MMMM');
      const year = firstStock.entryDate.getFullYear();
      metrics.month = monthName;
      metrics.year = year;
    }
    
    return metrics;
  }, [stocks]);
  
  const { 
    month,
    totalTrades, 
    successTrades, 
    failureTrades,
    avgTradeDuration,
    monthlyProfitLossPercentage
  } = performance;
  
  const isProfitable = monthlyProfitLossPercentage > 0;
  const successRate = totalTrades > 0 ? (successTrades / totalTrades) * 100 : 0;
  
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Month Title */}
          <div className="flex flex-col justify-center items-center md:items-start">
            <h2 className="text-2xl font-bold">{month}</h2>
            <p className="text-sm text-muted-foreground">Performance Summary</p>
          </div>
          
          {/* Monthly Profit/Loss */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center mb-1">
              {isProfitable ? (
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className="text-sm font-medium text-muted-foreground">
                Monthly P/L
              </span>
            </div>
            <p className={cn(
              "text-2xl font-bold",
              isProfitable ? "text-green-600" : "text-red-600"
            )}>
              {monthlyProfitLossPercentage > 0 ? '+' : ''}
              {monthlyProfitLossPercentage.toFixed(2)}%
            </p>
          </div>
          
          {/* Success Rate */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
              <XCircle className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm font-medium text-muted-foreground">
                Success/Failure
              </span>
            </div>
            <p className="text-2xl font-bold">
              {successTrades}/{failureTrades}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({successRate.toFixed(0)}%)
              </span>
            </p>
          </div>
          
          {/* Average Trade Duration */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium text-muted-foreground">
                Avg. Duration
              </span>
            </div>
            <p className="text-2xl font-bold">
              {avgTradeDuration.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">days</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
