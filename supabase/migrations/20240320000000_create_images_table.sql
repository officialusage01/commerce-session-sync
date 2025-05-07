-- Create images table
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

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_images_public_id ON public.images(public_id);
CREATE INDEX IF NOT EXISTS idx_images_url ON public.images(url);
CREATE INDEX IF NOT EXISTS idx_images_product_id ON public.images(product_id);

-- Set up Row Level Security (RLS)
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
    ON public.images FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated insert"
    ON public.images FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- For now, allow authenticated users to delete any image
-- You may want to update this policy once you have the correct user reference column
CREATE POLICY "Allow authenticated delete images"
    ON public.images FOR DELETE
    USING (auth.role() = 'authenticated'); 