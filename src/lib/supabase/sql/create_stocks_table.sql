
-- Create stocks table if it doesn't exist
create or replace function create_stocks_table()
returns void
language plpgsql
security definer
as $$
begin
  -- Check if table exists
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'stocks') then
    -- Create the stocks table
    create table public.stocks (
      id uuid primary key default uuid_generate_v4(),
      stock_name text not null,
      entry_price numeric not null,
      stop_loss_price numeric,
      quantity integer not null,
      entry_date date not null,
      entry_time time,
      expected_timeline integer,
      exit_price numeric,
      exit_date date,
      exit_time time,
      profit_loss_percentage numeric,
      success_status boolean,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    );
    
    -- Set up RLS
    alter table public.stocks enable row level security;
    
    -- Create policy for authenticated users
    create policy "Allow authenticated users full access to stocks"
      on public.stocks
      for all
      to authenticated
      using (true)
      with check (true);
      
    -- Create policy for anon users to read stocks
    create policy "Allow anon users to read stocks"
      on public.stocks
      for select
      to anon
      using (true);
      
    -- Create updated_at trigger
    create trigger set_updated_at
      before update on public.stocks
      for each row
      execute procedure moddatetime(updated_at);
  end if;
end;
$$;
