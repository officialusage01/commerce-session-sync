
import { supabase } from '@/lib/supabase/client';
import { StockData } from '@/components/stock/types';

// Get all stocks
export const getAllStocks = async (): Promise<StockData[]> => {
  try {
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .order('created_at', { ascending: false });
    
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
    console.error("Error fetching stocks:", err);
    return [];
  }
};

// Get stocks by date
export const getStocksByDate = async (dateStr: string): Promise<StockData[]> => {
  try {
    // Check the format of dateStr to determine query type
    const isYearFormat = /^\d{4}$/.test(dateStr); // Year format: YYYY
    const isMonthFormat = /^\d{4}-\d{2}$/.test(dateStr); // Month format: YYYY-MM
    
    let query;
    
    if (isYearFormat) { // Year format: YYYY
      const year = dateStr;
      const startDate = `${year}-01-01`; // First day of year
      const endDate = `${parseInt(year) + 1}-01-01`; // First day of next year
      
      // Query for the entire year
      query = supabase
        .from('stocks')
        .select('*')
        .gte('entry_date', startDate)
        .lt('entry_date', endDate);
    } else if (isMonthFormat) { // Month format: YYYY-MM
      const [year, month] = dateStr.split('-');
      const startDate = `${year}-${month}-01`; // First day of month
      
      // Calculate last day of month
      const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
      const nextMonthYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
      const endDate = `${nextMonthYear}-${nextMonth.toString().padStart(2, '0')}-01`;
      
      // Query for the entire month
      query = supabase
        .from('stocks')
        .select('*')
        .gte('entry_date', startDate)
        .lt('entry_date', endDate);
    } else { // Full date: YYYY-MM-DD
      // Use the exact date as provided, no adjustment needed
      query = supabase
        .from('stocks')
        .select('*')
        .eq('entry_date', dateStr);
    }
    
    const { data, error } = await query;
    
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
    console.error("Error fetching stocks by date:", err);
    return [];
  }
};
