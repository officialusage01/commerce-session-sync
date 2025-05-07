
-- Create stock_images table if it doesn't exist
create or replace function create_stock_images_table()
returns void
language plpgsql
security definer
as $$
begin
  -- Check if table exists
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'stock_images') then
    -- Enable uuid extension if not already enabled
    create extension if not exists "uuid-ossp";
    
    -- Create the stock_images table
    create table public.stock_images (
      id uuid primary key default uuid_generate_v4(),
      stock_id uuid references public.stocks(id) on delete cascade,
      image_url text not null,
      image_type text not null check (image_type in ('analysis', 'result')),
      timestamp timestamp with time zone default now(),
      description text
    );
    
    -- Set up RLS
    alter table public.stock_images enable row level security;
    
    -- Create policy for authenticated users
    create policy "Allow authenticated users full access to stock_images"
      on public.stock_images
      for all
      to authenticated
      using (true)
      with check (true);
      
    -- Create policy for anon users to read stock_images
    create policy "Allow anon users to read stock_images"
      on public.stock_images
      for select
      to anon
      using (true);
  end if;
end;
$$;

-- Execute the function to create the table
select create_stock_images_table();
