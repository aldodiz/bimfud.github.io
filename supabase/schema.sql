create table if not exists public.seats (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  row text not null,
  col integer not null,
  is_wheelchair boolean not null default false,
  occupied_by_name text,
  occupied_by_email text,
  occupied_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint seats_position_unique unique (section, row, col),
  constraint seats_col_positive check (col > 0),
  constraint seats_occupied_requires_guest check (
    occupied_at is null
    or (occupied_by_name is not null and occupied_by_email is not null)
  )
);

alter table public.seats enable row level security;

create policy "Public can read occupied seats"
  on public.seats for select
  using (true);

create policy "Public can reserve seats through RPC"
  on public.seats for insert
  with check (false);

create policy "Public cannot update seats directly"
  on public.seats for update
  using (false);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists seats_touch_updated_at on public.seats;
create trigger seats_touch_updated_at
before update on public.seats
for each row execute function public.touch_updated_at();

create or replace function public.reserve_seat(
  seat_section text,
  seat_row text,
  seat_col integer,
  guest_name text,
  guest_email text,
  wheelchair boolean default false
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.seats (
    section,
    row,
    col,
    is_wheelchair,
    occupied_by_name,
    occupied_by_email,
    occupied_at
  )
  values (
    seat_section,
    seat_row,
    seat_col,
    wheelchair,
    nullif(trim(guest_name), ''),
    lower(nullif(trim(guest_email), '')),
    now()
  )
  on conflict (section, row, col) do update
    set occupied_by_name = excluded.occupied_by_name,
        occupied_by_email = excluded.occupied_by_email,
        occupied_at = excluded.occupied_at,
        is_wheelchair = excluded.is_wheelchair
    where public.seats.occupied_at is null;

  return found;
end;
$$;

grant select on public.seats to anon, authenticated;
grant execute on function public.reserve_seat(text, text, integer, text, text, boolean) to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'seats'
  ) then
    alter publication supabase_realtime add table public.seats;
  end if;
end;
$$;
