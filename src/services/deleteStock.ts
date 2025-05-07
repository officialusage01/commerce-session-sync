
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export const deleteStocks = async (stockIds: string[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('stocks')
      .delete()
      .in('id', stockIds);
    
    if (error) {
      console.error("Error deleting stocks:", error);
      toast.error(`Failed to delete stocks: ${error.message}`);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Exception when deleting stocks:", err);
    toast.error("An unexpected error occurred while deleting stocks");
    return false;
  }
};
