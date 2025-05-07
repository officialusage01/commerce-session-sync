
-- Update stock_images table to add description column if it doesn't exist
create or replace function update_stock_images_table()
returns void
language plpgsql
security definer
as $$
begin
  -- Add description column if it doesn't exist
  if not exists (
    select from information_schema.columns 
    where table_schema = 'public' 
    and table_name = 'stock_images' 
    and column_name = 'description'
  ) then
    alter table public.stock_images
    add column description text;
  end if;
end;
$$;

-- Execute the function to update the table
select update_stock_images_table();
