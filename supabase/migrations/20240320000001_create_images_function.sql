-- Create function to initialize images table
CREATE OR REPLACE FUNCTION public.create_images_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create the table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.images (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        url TEXT NOT NULL,
        public_id TEXT NOT NULL,
        filename TEXT NOT NULL,
        format TEXT,
        resource_type TEXT,
        product_id INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    -- Add indexes if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'images' AND indexname = 'idx_images_public_id'
    ) THEN
        CREATE INDEX idx_images_public_id ON public.images(public_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'images' AND indexname = 'idx_images_url'
    ) THEN
        CREATE INDEX idx_images_url ON public.images(url);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'images' AND indexname = 'idx_images_product_id'
    ) THEN
        CREATE INDEX idx_images_product_id ON public.images(product_id);
    END IF;

    -- Enable RLS
    ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

    -- Create policies if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'images' AND policyname = 'Allow public read access'
    ) THEN
        CREATE POLICY "Allow public read access"
            ON public.images FOR SELECT
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'images' AND policyname = 'Allow authenticated insert'
    ) THEN
        CREATE POLICY "Allow authenticated insert"
            ON public.images FOR INSERT
            WITH CHECK (auth.role() = 'authenticated');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'images' AND policyname = 'Allow authenticated delete images'
    ) THEN
        -- For now, allow authenticated users to delete any image
        -- You may want to update this policy once you have the correct user reference column
        CREATE POLICY "Allow authenticated delete images"
            ON public.images FOR DELETE
            USING (auth.role() = 'authenticated');
    END IF;

    RETURN true;
END;
$$; 