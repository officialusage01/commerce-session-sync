export interface StockImage {
  id: string;
  url: string;
  type: 'analysis' | 'result';
  stockId?: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface PerformanceData {
  stockName: string;
  entryDate: Date;
  exitDate: Date;
  entryPrice: number;
  exitPrice: number;
  profitLossPercentage: number;
  isProfitable: boolean;
}

export interface StockData {
  id: string;
  stockName: string;
  entryPrice: number;
  exitPrice?: number;
  stopLossPrice?: number;
  quantity: number;
  entryDate: Date;
  entryTime?: string;
  exitDate?: Date;
  exitTime?: string;
  expectedTimeline?: number;
  profitLossPercentage?: number;
  successStatus?: boolean;
  createdAt: string;
  updatedAt: string;
}

// For organizing stocks by date in the tree view
export interface DateNode {
  year: number;
  months?: {
    month: string;
    monthNumber: number;
    days: {
      day: string;
      date: string;
      stocks: StockData[];
    }[];
  }[];
}

// For monthly performance summary
export interface MonthlyPerformance {
  month: string;
  year: number;
  totalTrades: number;
  successTrades: number;
  failureTrades: number;
  pendingTrades: number;
  avgTradeDuration: number;
  monthlyProfitLossPercentage: number;
}
