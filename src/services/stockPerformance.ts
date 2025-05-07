
import { supabase } from '@/lib/supabase/client';
import { StockData, MonthlyPerformance } from '@/components/stock/types';
import { differenceInDays } from 'date-fns';

// Get stocks by month (for performance page)
export const getStocksByMonth = async (year: number, month: number): Promise<StockData[]> => {
  try {
    // Create date range for the given month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of the month
    
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    // Query stocks within the date range
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .gte('entry_date', formattedStartDate)
      .lte('entry_date', formattedEndDate)
      .order('entry_date', { ascending: false });
    
    if (error) throw error;
    
    if (data) {
      // Transform from snake_case to camelCase
      return data.map(item => ({
        id: item.id,
        stockName: item.stock_name,
        entryPrice: item.entry_price,
        stopLossPrice: item.stop_loss_price,
        quantity: item.quantity,
        entryDate: new Date(item.entry_date),
        entryTime: item.entry_time,
        expectedTimeline: item.expected_timeline,
        exitPrice: item.exit_price,
        exitDate: item.exit_date ? new Date(item.exit_date) : undefined,
        exitTime: item.exit_time,
        profitLossPercentage: item.profit_loss_percentage,
        successStatus: item.success_status,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as StockData[];
    }
    
    return [];
  } catch (err) {
    console.error("Error fetching stocks by month:", err);
    return [];
  }
};

// Calculate monthly performance summary
export const calculateMonthlyPerformance = (stocks: StockData[]): MonthlyPerformance => {
  // Initialize counters
  let totalTrades = stocks.length;
  let completedTrades = 0;
  let successTrades = 0;
  let failureTrades = 0;
  let pendingTrades = 0;
  let totalProfit = 0;
  let totalDays = 0;

  // Process each stock
  stocks.forEach(stock => {
    if (stock.exitDate) {
      completedTrades++;
      
      // Calculate profit/loss
      if (stock.profitLossPercentage !== undefined) {
        totalProfit += stock.profitLossPercentage;
        
        // Determine success or failure
        if (stock.successStatus !== undefined) {
          // Use explicit success status if available
          if (stock.successStatus) {
            successTrades++;
          } else {
            failureTrades++;
          }
        } else {
          // Otherwise use profit/loss as indicator
          if (stock.profitLossPercentage > 0) {
            successTrades++;
          } else {
            failureTrades++;
          }
        }
        
        // Calculate trade duration
        const tradeDuration = differenceInDays(
          new Date(stock.exitDate),
          new Date(stock.entryDate)
        );
        totalDays += tradeDuration > 0 ? tradeDuration : 1; // Minimum 1 day
      }
    } else {
      // Count trades without exit date as pending
      pendingTrades++;
    }
  });
  
  // Calculate averages
  const avgTradeDuration = completedTrades > 0 ? totalDays / completedTrades : 0;
  const monthlyProfitLossPercentage = completedTrades > 0 ? totalProfit / completedTrades : 0;
  
  return {
    month: '',  // Will be set by the component
    year: 0,    // Will be set by the component
    totalTrades,
    successTrades,
    failureTrades,
    pendingTrades,
    avgTradeDuration,
    monthlyProfitLossPercentage,
  };
};
