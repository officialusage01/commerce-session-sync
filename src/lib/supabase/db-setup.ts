import { supabase } from './client';
import { handleDatabaseError } from './db-utils';

// Initialize database with all necessary tables and policies
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    // Create categories table
    const { error: categoriesError } = await supabase.rpc('create_categories_table');
    if (categoriesError) {
      console.error('Error creating categories table:', categoriesError);
      return false;
    }

    // Create subcategories table
    const { error: subcategoriesError } = await supabase.rpc('create_subcategories_table');
    if (subcategoriesError) {
      console.error('Error creating subcategories table:', subcategoriesError);
      return false;
    }

    // Create products table
    const { error: productsError } = await supabase.rpc('create_products_table');
    if (productsError) {
      console.error('Error creating products table:', productsError);
      return false;
    }

    // Create images table
    const { error: imagesError } = await supabase.rpc('create_images_table');
    if (imagesError) {
      console.error('Error creating images table:', imagesError);
      return false;
    }

    // Create cart_items table
    const { error: cartItemsError } = await supabase.rpc('create_cart_items_table');
    if (cartItemsError) {
      console.error('Error creating cart_items table:', cartItemsError);
      return false;
    }

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// SQL Functions Management
export const createSQLFunctions = async (): Promise<boolean> => {
  try {
    // Create function for categories table
    const createCategoriesFunction = `
      CREATE OR REPLACE FUNCTION create_categories_table()
      RETURNS void AS $$
      BEGIN
        -- Create table if it doesn't exist
        CREATE TABLE IF NOT EXISTS categories (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          icon TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Add updated_at column if it doesn't exist
        BEGIN
          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'categories' 
            AND column_name = 'updated_at'
          ) THEN
            ALTER TABLE categories ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
          END IF;
        EXCEPTION WHEN OTHERS THEN
          -- Ignore any errors during column addition
          NULL;
        END;
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);
        
        -- Add RLS policies
        ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
        DROP POLICY IF EXISTS "Allow authenticated users to insert categories" ON categories;
        DROP POLICY IF EXISTS "Allow authenticated users to update categories" ON categories;
        DROP POLICY IF EXISTS "Allow authenticated users to delete categories" ON categories;
        
        -- Allow public read access
        CREATE POLICY "Allow public read access to categories"
          ON categories FOR SELECT
          USING (true);
        
        -- Allow authenticated users to insert
        CREATE POLICY "Allow authenticated users to insert categories"
          ON categories FOR INSERT
          TO authenticated
          WITH CHECK (auth.role() = 'authenticated');
        
        -- Allow authenticated users to update
        CREATE POLICY "Allow authenticated users to update categories"
          ON categories FOR UPDATE
          TO authenticated
          USING (auth.role() = 'authenticated')
          WITH CHECK (auth.role() = 'authenticated');
        
        -- Allow authenticated users to delete
        CREATE POLICY "Allow authenticated users to delete categories"
          ON categories FOR DELETE
          TO authenticated
          USING (auth.role() = 'authenticated');
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Create function for subcategories table
    const createSubcategoriesFunction = `
      CREATE OR REPLACE FUNCTION create_subcategories_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS subcategories (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL,
          category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
          icon TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(name, category_id)
        );
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_subcategories_category ON subcategories(category_id);
        CREATE INDEX IF NOT EXISTS idx_subcategories_name ON subcategories(name);
        
        -- Enable RLS
        ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Enable read access for all users" ON subcategories;
        DROP POLICY IF EXISTS "Enable insert for authenticated users" ON subcategories;
        DROP POLICY IF EXISTS "Enable update for authenticated users" ON subcategories;
        DROP POLICY IF EXISTS "Enable delete for authenticated users" ON subcategories;
        
        -- Create RLS policies
        CREATE POLICY "Enable read access for all users" ON subcategories
          FOR SELECT USING (true);
        
        CREATE POLICY "Enable insert for authenticated users" ON subcategories
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        
        CREATE POLICY "Enable update for authenticated users" ON subcategories
          FOR UPDATE USING (auth.role() = 'authenticated');
        
        CREATE POLICY "Enable delete for authenticated users" ON subcategories
          FOR DELETE USING (auth.role() = 'authenticated');
      END;
      $$ LANGUAGE plpgsql;
    `;

    // Create function for products table
    const createProductsFunction = `
      CREATE OR REPLACE FUNCTION create_products_table()
      RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
          subcategory_id INTEGER NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
          stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
          images JSONB NOT NULL DEFAULT '[]'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory_id);
        CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
        CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
        
        -- Enable RLS
        ALTER TABLE products ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Enable read access for all users" ON products
          FOR SELECT USING (true);
        
        CREATE POLICY "Enable insert for authenticated users" ON products
          FOR INSERT WITH CHECK (auth.role() = 'authenticated');
        
        CREATE POLICY "Enable update for authenticated users" ON products
          FOR UPDATE USING (auth.role() = 'authenticated');
        
        CREATE POLICY "Enable delete for authenticated users" ON products
          FOR DELETE USING (auth.role() = 'authenticated');
      END;
      $$ LANGUAGE plpgsql;
    `;

    // Create function for cart_items table
    const createCartItemsFunction = `
      CREATE OR REPLACE FUNCTION create_cart_items_table()
      RETURNS void AS $$
      BEGIN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Enable read access for own cart items" ON cart_items;
        DROP POLICY IF EXISTS "Enable insert for own cart items" ON cart_items;
        DROP POLICY IF EXISTS "Enable update for own cart items" ON cart_items;
        DROP POLICY IF EXISTS "Enable delete for own cart items" ON cart_items;
        
        CREATE TABLE IF NOT EXISTS cart_items (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE(user_id, product_id)
        );
        
        -- Create index for faster lookups
        CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
        CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(product_id);
        
        -- Enable RLS
        ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
        
        -- Create RLS policies
        CREATE POLICY "Enable read access for own cart items" ON cart_items
          FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Enable insert for own cart items" ON cart_items
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Enable update for own cart items" ON cart_items
          FOR UPDATE USING (auth.uid() = user_id);
        
        CREATE POLICY "Enable delete for own cart items" ON cart_items
          FOR DELETE USING (auth.uid() = user_id);
      END;
      $$ LANGUAGE plpgsql;
    `;

    const dropCartItemsFunction = `
      CREATE OR REPLACE FUNCTION drop_cart_items_table()
      RETURNS void AS $$
      BEGIN
        DROP TABLE IF EXISTS cart_items CASCADE;
      END;
      $$ LANGUAGE plpgsql;
    `;

    // Execute SQL functions
    const { error: categoriesError } = await supabase.rpc('create_categories_table');
    if (categoriesError) throw categoriesError;

    const { error: subcategoriesError } = await supabase.rpc('create_subcategories_table');
    if (subcategoriesError) throw subcategoriesError;

    const { error: productsError } = await supabase.rpc('create_products_table');
    if (productsError) throw productsError;

    // Create the drop function first
    const { error: dropFunctionError } = await supabase.rpc('create_drop_cart_items_function', {
      sql_function: dropCartItemsFunction
    });
    if (dropFunctionError) throw dropFunctionError;

    // Create the cart items function
    const { error: cartItemsFunctionError } = await supabase.rpc('create_function', {
      sql_function: createCartItemsFunction
    });
    if (cartItemsFunctionError) throw cartItemsFunctionError;

    // Create the cart items table
    const { error: cartItemsError } = await supabase.rpc('create_cart_items_table');
    if (cartItemsError) throw cartItemsError;

    return true;
  } catch (error) {
    handleDatabaseError(error, 'creating SQL functions');
    return false;
  }
};

export const recreateCartItemsTable = async (): Promise<boolean> => {
  try {
    // Drop the existing table and its dependencies
    const { error: dropError } = await supabase.rpc('drop_cart_items_table');
    if (dropError) {
      console.error('Error dropping cart_items table:', dropError);
      return false;
    }

    // Create the table with the new schema
    const { error: createError } = await supabase.rpc('create_cart_items_table');
    if (createError) {
      console.error('Error creating cart_items table:', createError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error recreating cart_items table:', error);
    return false;
  }
};

// Setup database tables
export const setupDatabase = async (): Promise<boolean> => {
  try {
    // Create tables using SQL functions
    const functionsSuccess = await createSQLFunctions();
    if (!functionsSuccess) {
      throw new Error('Failed to create database functions');
    }

    // Initialize the database
    const initSuccess = await initializeDatabase();
    if (!initSuccess) {
      throw new Error('Failed to initialize database');
    }

    return true;
  } catch (error) {
    handleDatabaseError(error, 'setting up database');
    return false;
  }
};