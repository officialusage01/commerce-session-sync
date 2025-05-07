
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StockData, MonthlyPerformance } from './types';
import { calculateMonthlyPerformance } from '@/services/stockPerformance';
import { format, isValid, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, Clock, AlarmClock } from 'lucide-react';

interface PerformanceHeaderProps {
  stocks: StockData[];
  isMonthView: boolean;
  date: string | null;
}

export const PerformanceHeader: React.FC<PerformanceHeaderProps> = ({ 
  stocks,
  isMonthView,
  date
}) => {
  if (!date || stocks.length === 0) {
    return null;
  }

  // Parse the date string
  let displayDate = '';
  let period = '';
  let dateRange = '';
  
  // Year view (4 digits only)
  if (date.length === 4 && /^\d{4}$/.test(date)) {
    const year = parseInt(date);
    displayDate = date;
    period = 'Yearly';
    
    // Create date range for the year (Jan 1 - Dec 31)
    const startDate = new Date(year, 0, 1); // Jan 1
    const endDate = new Date(year, 11, 31); // Dec 31
    
    dateRange = `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
  }
  // Month view (YYYY-MM)
  else if (isMonthView && date.length === 7 && /^\d{4}-\d{2}$/.test(date)) {
    const [year, month] = date.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month) - 1);
    displayDate = format(dateObj, 'MMMM yyyy');
    period = 'Monthly';
  } 
  // Day view (YYYY-MM-DD)
  else {
    try {
      // Try to parse as ISO date
      const dateObj = parseISO(date);
      if (isValid(dateObj)) {
        displayDate = format(dateObj, 'MMMM d, yyyy');
        period = 'Daily';
      } else {
        displayDate = date;
        period = 'Selected Period';
      }
    } catch (error) {
      displayDate = date;
      period = 'Selected Period';
    }
  }

  // Calculate performance metrics
  const performance: MonthlyPerformance = calculateMonthlyPerformance(stocks);
  
  // Count pending trades (no exit date)
  const pendingTrades = stocks.filter(stock => !stock.exitDate).length;

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">{period} Performance Summary</h2>
            <p className="text-muted-foreground">
              {displayDate}
              {dateRange && ` (${dateRange})`}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Badge variant={performance.monthlyProfitLossPercentage >= 0 ? "success" : "destructive"} className="flex items-center gap-1 py-1.5">
                {performance.monthlyProfitLossPercentage >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span>
                  {performance.monthlyProfitLossPercentage >= 0 ? '+' : ''}
                  {performance.monthlyProfitLossPercentage.toFixed(2)}%
                </span>
              </Badge>
              
              <div className="text-sm">
                <span className="font-medium">{performance.totalTrades}</span> trades
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="py-1.5">
                <span className="text-green-600 font-medium mr-1">{performance.successTrades}</span> successes
              </Badge>
              <Badge variant="outline" className="py-1.5">
                <span className="text-red-600 font-medium mr-1">{performance.failureTrades}</span> failures
              </Badge>
              {pendingTrades > 0 && (
                <Badge variant="outline" className="py-1.5 flex items-center gap-1">
                  <AlarmClock className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-amber-500 font-medium mr-1">{pendingTrades}</span> pending
                </Badge>
              )}
            </div>
            
            <Badge variant="secondary" className="flex items-center gap-1 py-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Avg. Duration: {performance.avgTradeDuration.toFixed(1)} days</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
