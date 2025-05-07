
import { supabase } from '@/lib/supabase/client';
import { StockData } from '@/components/stock/types';
import { toast } from 'sonner';
import { transformDbRowToStockData, transformStockDataToDbFormat } from './stockTransformers';
import { initStockTables } from '../stockInit';

// Create a new stock entry
export const createStock = async (stockData: Omit<StockData, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    console.log("Creating stock with data:", stockData);
    
    // Prepare the data object with proper date handling
    const insertData = transformStockDataToDbFormat(stockData);
    
    // Try to insert into stocks
    let result = await tryInsertStock(insertData);
    
    // If table doesn't exist, try to create it and then insert again
    if (!result.success && result.error && 
        typeof result.error === 'object' && 
        'code' in result.error && 
        result.error.code === '42P01') {
      console.log("Creating stocks table first...");
      
      const tableCreated = await initStockTables();
      
      if (tableCreated) {
        result = await tryInsertStock(insertData);
      }
    }
    
    if (!result.success) {
      throw result.error || new Error("Failed to create stock entry");
    }
    
    console.log("Stock created successfully:", result.data);
    
    // Transform from snake_case to camelCase
    return transformDbRowToStockData(result.data);
  } catch (err) {
    console.error("Error creating stock:", err);
    throw err;
  }
};

// Helper function to try inserting a stock
async function tryInsertStock(insertData: Record<string, any>) {
  try {
    const { data, error } = await supabase
      .from('stocks')
      .insert([insertData])
      .select('*')
      .single();
    
    if (error) {
      console.error("Supabase error creating stock:", error);
      
      // Show user-friendly error
      if (error.code === '42P01') {
        toast.error("Stock database not initialized. Please contact admin.");
      } else {
        toast.error("Failed to save stock. Try again later.");
      }
      
      return { success: false, error };
    }
    
    if (!data) {
      const err = new Error("Failed to create stock entry - no data returned");
      return { success: false, error: err };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error("Error in tryInsertStock:", err);
    return { success: false, error: err as Error };
  }
}
