
import { supabase } from '@/lib/supabase/client';
import { StockData } from '@/components/stock/types';
import { toast } from 'sonner';
import { transformDbRowToStockData, transformStockDataToDbFormat } from './stockTransformers';

// Update an existing stock entry
export const updateStock = async (id: string, stockData: Partial<StockData>) => {
  try {
    console.log("Updating stock with ID:", id, "Data:", stockData);
    
    // Convert to snake_case for the database with proper date handling
    const updateData = transformStockDataToDbFormat(stockData);
    
    // Update the stock
    const { data, error } = await supabase
      .from('stocks')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error("Supabase error updating stock:", error);
      toast.error("Failed to update stock details");
      throw error;
    }
    
    if (!data) {
      throw new Error("Failed to update stock entry - no data returned");
    }
    
    console.log("Stock updated successfully:", data);
    
    // Transform from snake_case to camelCase
    return transformDbRowToStockData(data);
  } catch (err) {
    console.error("Error updating stock:", err);
    throw err;
  }
};
