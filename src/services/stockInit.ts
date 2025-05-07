import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

// Stock table definition SQL
const CREATE_STOCKS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS stocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_name TEXT NOT NULL,
    entry_price NUMERIC NOT NULL,
    stop_loss_price NUMERIC,
    quantity INTEGER NOT NULL,
    entry_date DATE NOT NULL,
    entry_time TEXT,
    expected_timeline INTEGER,
    exit_price NUMERIC,
    exit_date DATE,
    exit_time TEXT,
    profit_loss_percentage NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Set up RLS for the stocks table
  ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;
  
  -- Create policy for authenticated users
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'stocks' AND policyname = 'Allow authenticated users full access'
    ) THEN
      CREATE POLICY "Allow authenticated users full access" 
        ON stocks 
        FOR ALL 
        TO authenticated 
        USING (true) 
        WITH CHECK (true);
    END IF;
  END
  $$;
`;

export const initStockTables = async () => {
  try {
    console.log("Initializing stocks table...");
    
    // First check if the stocks table already exists
    const { error: checkError } = await supabase
      .from('stocks')
      .select('id')
      .limit(1);
    
    if (!checkError) {
      console.log("Stocks table already exists");
      return true;
    }
    
    // If we get a table doesn't exist error, create it
    if (checkError.code === '42P01') {
      console.log("Table doesn't exist, creating it with SQL...");
      
      try {
        // Try executing the SQL to create the table
        const { error: sqlError } = await supabase.rpc('exec_sql', {
          sql_query: CREATE_STOCKS_TABLE_SQL
        });
        
        if (sqlError) {
          console.error("Error creating stocks table with RPC:", sqlError);
          
          // Try direct insert which will often auto-create the table
          try {
            const { error: insertError } = await supabase
              .from('stocks')
              .insert([{
                stock_name: 'SYSTEM_TEST',
                entry_price: 0,
                quantity: 1, 
                entry_date: new Date().toISOString().split('T')[0]
              }]);
            
            if (!insertError) {
              console.log("Successfully created stocks table via first insert");
              
              // Clean up test entry
              await supabase
                .from('stocks')
                .delete()
                .eq('stock_name', 'SYSTEM_TEST');
                
              toast.success("Stock database initialized");
              return true;
            }
            
            console.error("Direct table creation failed:", insertError);
            toast.error("Unable to initialize stock database");
            return false;
          } catch (e) {
            console.error("Error in table auto-creation:", e);
            toast.error("Failed to initialize stock database");
            return false;
          }
        } else {
          console.log("Successfully created stocks table via SQL RPC");
          toast.success("Stock database initialized");
          return true;
        }
      } catch (e) {
        console.error("Failed to create stocks table:", e);
        toast.error("Failed to create stock database");
        return false;
      }
    } else {
      // Other error occurred
      console.error("Error checking stock table:", checkError);
      toast.error("Failed to initialize stock database");
      return false;
    }
  } catch (error) {
    console.error("Error initializing stock tables:", error);
    toast.error("Database initialization failed");
    throw error;
  }
};
