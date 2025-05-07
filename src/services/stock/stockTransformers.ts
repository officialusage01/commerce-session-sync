
import { StockData } from '@/components/stock/types';

// Transform database row to StockData object
export const transformDbRowToStockData = (data: any): StockData => {
  return {
    id: data.id,
    stockName: data.stock_name,
    entryPrice: data.entry_price,
    stopLossPrice: data.stop_loss_price,
    quantity: data.quantity,
    entryDate: new Date(data.entry_date),
    entryTime: data.entry_time,
    expectedTimeline: data.expected_timeline,
    exitPrice: data.exit_price,
    exitDate: data.exit_date ? new Date(data.exit_date) : undefined,
    exitTime: data.exit_time,
    profitLossPercentage: data.profit_loss_percentage,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  } as StockData;
};

// Transform StockData to database format (snake_case)
export const transformStockDataToDbFormat = (stockData: Partial<StockData>): Record<string, any> => {
  const insertData: Record<string, any> = {};
  
  if (stockData.stockName) insertData.stock_name = stockData.stockName;
  if (stockData.entryPrice !== undefined) insertData.entry_price = stockData.entryPrice;
  if (stockData.stopLossPrice !== undefined) insertData.stop_loss_price = stockData.stopLossPrice;
  if (stockData.quantity !== undefined) insertData.quantity = stockData.quantity;
  
  if (stockData.entryDate) {
    insertData.entry_date = stockData.entryDate instanceof Date 
      ? stockData.entryDate.toISOString().split('T')[0]
      : stockData.entryDate;
  }
  
  if (stockData.entryTime) insertData.entry_time = stockData.entryTime;
  if (stockData.expectedTimeline !== undefined) insertData.expected_timeline = stockData.expectedTimeline;
  if (stockData.exitPrice !== undefined) insertData.exit_price = stockData.exitPrice;
  
  if (stockData.exitDate) {
    insertData.exit_date = stockData.exitDate instanceof Date 
      ? stockData.exitDate.toISOString().split('T')[0]
      : stockData.exitDate;
  }
  
  if (stockData.exitTime) insertData.exit_time = stockData.exitTime;
  if (stockData.profitLossPercentage !== undefined) insertData.profit_loss_percentage = stockData.profitLossPercentage;
  
  return insertData;
};
