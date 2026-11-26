-- Synsera Postgres schema (run in Supabase SQL editor)
-- Brand: Synsera — recurring financial intelligence

create extension if not exists "pgcrypto";

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null default '',
  country text not null default 'KE',
  currency text not null default 'KES' check (currency in ('KES','UGX','TZS','RWF')),
  timezone text not null default 'Africa/Nairobi',
  theme text not null default 'system' check (theme in ('dark','light','system')),
  payday_day int not null default 25 check (payday_day between 1 and 28),
  notifications jsonb not null default '{"email":true,"push":true,"renewalDays":7,"quietHoursStart":"22:00","quietHoursEnd":"07:00"}'::jsonb,
  onboarding_complete boolean not null default false,
  workspaces_enabled text[] not null default array['personal'],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('personal','business','merchant')),
  name text not null,
  created_at timestamptz not null default now(),
  unique (owner_id, kind)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  workspace text not null check (workspace in ('personal','business','merchant')),
  name text not null,
  merchant text not null,
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null default 'KES',
  cycle text not null check (cycle in ('monthly','yearly','weekly','custom')),
  next_billing_date date not null,
  category text not null default 'Other',
  status text not null default 'active',
  payment_method text not null default 'Manual',
  notes text,
  confirmed boolean not null default true,
  history jsonb not null default '[]'::jsonb,
  usage_diary jsonb not null default '[]'::jsonb,
  cancellation jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists expenses_user_idx on public.expenses (user_id);
create index if not exists expenses_workspace_idx on public.expenses (user_id, workspace);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  severity text not null check (severity in ('danger','warning','info')),
  title text not null,
  detail text not null,
  expense_id uuid references public.expenses (id) on delete set null,
  read boolean not null default false,
  category text not null default 'system',
  created_at timestamptz not null default now()
);

create table if not exists public.activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  detail text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  category text not null default 'Other',
  spend numeric(14,2) not null default 0,
  contracts int not null default 0,
  owner text not null default '',
  email text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  vendor text not null,
  renews date not null,
  notice_days int not null default 30,
  value numeric(14,2) not null default 0,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  total int not null default 0,
  used int not null default 0,
  waste int not null default 0
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  dept text not null,
  limit_amount numeric(14,2) not null default 0,
  spent numeric(14,2) not null default 0
);

create table if not exists public.purchase_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  amount numeric(14,2) not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  requester text not null,
  note text,
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  role text not null default 'Member',
  dept text not null default 'Ops'
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  actor text not null,
  action text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.merchant_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  price numeric(14,2) not null,
  interval text not null default 'monthly',
  subscribers int not null default 0,
  active boolean not null default true
);

create table if not exists public.merchant_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  plan text not null,
  mrr numeric(14,2) not null default 0,
  status text not null default 'active',
  email text not null default ''
);

create table if not exists public.merchant_invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  customer text not null,
  amount numeric(14,2) not null,
  status text not null default 'open',
  due date not null
);

create table if not exists public.discounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  code text not null,
  type text not null check (type in ('percent','fixed')),
  value numeric(14,2) not null,
  uses int not null default 0,
  active boolean not null default true
);

create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  url text not null,
  events text not null default '',
  status text not null default 'active'
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  email text,
  role text not null default 'viewer',
  status text not null default 'invited',
  share_split_pct int default 0
);

create table if not exists public.blacklist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  merchant text not null,
  reason text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.graveyard (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  amount numeric(14,2) not null default 0,
  cancelled_at date not null default current_date
);

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'name', coalesce(new.raw_user_meta_data->>'full_name', ''))
  )
  on conflict (id) do nothing;
  insert into public.workspaces (owner_id, kind, name)
  values (new.id, 'personal', 'Personal')
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.expenses enable row level security;
alter table public.alerts enable row level security;
alter table public.activity enable row level security;
alter table public.vendors enable row level security;
alter table public.contracts enable row level security;
alter table public.licenses enable row level security;
alter table public.budgets enable row level security;
alter table public.purchase_requests enable row level security;
alter table public.team_members enable row level security;
alter table public.audit_log enable row level security;
alter table public.merchant_plans enable row level security;
alter table public.merchant_customers enable row level security;
alter table public.merchant_invoices enable row level security;
alter table public.discounts enable row level security;
alter table public.webhooks enable row level security;
alter table public.family_members enable row level security;
alter table public.blacklist enable row level security;
alter table public.graveyard enable row level security;

-- Owner policies (idempotent recreate)
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','workspaces','expenses','alerts','activity','vendors','contracts',
    'licenses','budgets','purchase_requests','team_members','audit_log',
    'merchant_plans','merchant_customers','merchant_invoices','discounts',
    'webhooks','family_members','blacklist','graveyard'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t||'_select', t);
    execute format('drop policy if exists %I on public.%I', t||'_insert', t);
    execute format('drop policy if exists %I on public.%I', t||'_update', t);
    execute format('drop policy if exists %I on public.%I', t||'_delete', t);
  end loop;
end $$;

create policy profiles_select on public.profiles for select using (auth.uid() = id);
create policy profiles_update on public.profiles for update using (auth.uid() = id);

create policy workspaces_select on public.workspaces for select using (auth.uid() = owner_id);
create policy workspaces_insert on public.workspaces for insert with check (auth.uid() = owner_id);
create policy workspaces_update on public.workspaces for update using (auth.uid() = owner_id);
create policy workspaces_delete on public.workspaces for delete using (auth.uid() = owner_id);

create policy expenses_select on public.expenses for select using (auth.uid() = user_id);
create policy expenses_insert on public.expenses for insert with check (auth.uid() = user_id);
create policy expenses_update on public.expenses for update using (auth.uid() = user_id);
create policy expenses_delete on public.expenses for delete using (auth.uid() = user_id);

create policy alerts_select on public.alerts for select using (auth.uid() = user_id);
create policy alerts_insert on public.alerts for insert with check (auth.uid() = user_id);
create policy alerts_update on public.alerts for update using (auth.uid() = user_id);
create policy alerts_delete on public.alerts for delete using (auth.uid() = user_id);

create policy activity_select on public.activity for select using (auth.uid() = user_id);
create policy activity_insert on public.activity for insert with check (auth.uid() = user_id);
create policy activity_delete on public.activity for delete using (auth.uid() = user_id);

create policy vendors_select on public.vendors for select using (auth.uid() = user_id);
create policy vendors_insert on public.vendors for insert with check (auth.uid() = user_id);
create policy vendors_update on public.vendors for update using (auth.uid() = user_id);
create policy vendors_delete on public.vendors for delete using (auth.uid() = user_id);

create policy contracts_select on public.contracts for select using (auth.uid() = user_id);
create policy contracts_insert on public.contracts for insert with check (auth.uid() = user_id);
create policy contracts_update on public.contracts for update using (auth.uid() = user_id);
create policy contracts_delete on public.contracts for delete using (auth.uid() = user_id);

create policy licenses_select on public.licenses for select using (auth.uid() = user_id);
create policy licenses_insert on public.licenses for insert with check (auth.uid() = user_id);
create policy licenses_update on public.licenses for update using (auth.uid() = user_id);
create policy licenses_delete on public.licenses for delete using (auth.uid() = user_id);

create policy budgets_select on public.budgets for select using (auth.uid() = user_id);
create policy budgets_insert on public.budgets for insert with check (auth.uid() = user_id);
create policy budgets_update on public.budgets for update using (auth.uid() = user_id);
create policy budgets_delete on public.budgets for delete using (auth.uid() = user_id);

create policy purchase_requests_select on public.purchase_requests for select using (auth.uid() = user_id);
create policy purchase_requests_insert on public.purchase_requests for insert with check (auth.uid() = user_id);
create policy purchase_requests_update on public.purchase_requests for update using (auth.uid() = user_id);
create policy purchase_requests_delete on public.purchase_requests for delete using (auth.uid() = user_id);

create policy team_members_select on public.team_members for select using (auth.uid() = user_id);
create policy team_members_insert on public.team_members for insert with check (auth.uid() = user_id);
create policy team_members_update on public.team_members for update using (auth.uid() = user_id);
create policy team_members_delete on public.team_members for delete using (auth.uid() = user_id);

create policy audit_log_select on public.audit_log for select using (auth.uid() = user_id);
create policy audit_log_insert on public.audit_log for insert with check (auth.uid() = user_id);
create policy audit_log_delete on public.audit_log for delete using (auth.uid() = user_id);

create policy merchant_plans_select on public.merchant_plans for select using (auth.uid() = user_id);
create policy merchant_plans_insert on public.merchant_plans for insert with check (auth.uid() = user_id);
create policy merchant_plans_update on public.merchant_plans for update using (auth.uid() = user_id);
create policy merchant_plans_delete on public.merchant_plans for delete using (auth.uid() = user_id);

create policy merchant_customers_select on public.merchant_customers for select using (auth.uid() = user_id);
create policy merchant_customers_insert on public.merchant_customers for insert with check (auth.uid() = user_id);
create policy merchant_customers_update on public.merchant_customers for update using (auth.uid() = user_id);
create policy merchant_customers_delete on public.merchant_customers for delete using (auth.uid() = user_id);

create policy merchant_invoices_select on public.merchant_invoices for select using (auth.uid() = user_id);
create policy merchant_invoices_insert on public.merchant_invoices for insert with check (auth.uid() = user_id);
create policy merchant_invoices_update on public.merchant_invoices for update using (auth.uid() = user_id);
create policy merchant_invoices_delete on public.merchant_invoices for delete using (auth.uid() = user_id);

create policy discounts_select on public.discounts for select using (auth.uid() = user_id);
create policy discounts_insert on public.discounts for insert with check (auth.uid() = user_id);
create policy discounts_update on public.discounts for update using (auth.uid() = user_id);
create policy discounts_delete on public.discounts for delete using (auth.uid() = user_id);

create policy webhooks_select on public.webhooks for select using (auth.uid() = user_id);
create policy webhooks_insert on public.webhooks for insert with check (auth.uid() = user_id);
create policy webhooks_update on public.webhooks for update using (auth.uid() = user_id);
create policy webhooks_delete on public.webhooks for delete using (auth.uid() = user_id);

create policy family_members_select on public.family_members for select using (auth.uid() = user_id);
create policy family_members_insert on public.family_members for insert with check (auth.uid() = user_id);
create policy family_members_update on public.family_members for update using (auth.uid() = user_id);
create policy family_members_delete on public.family_members for delete using (auth.uid() = user_id);

create policy blacklist_select on public.blacklist for select using (auth.uid() = user_id);
create policy blacklist_insert on public.blacklist for insert with check (auth.uid() = user_id);
create policy blacklist_update on public.blacklist for update using (auth.uid() = user_id);
create policy blacklist_delete on public.blacklist for delete using (auth.uid() = user_id);

create policy graveyard_select on public.graveyard for select using (auth.uid() = user_id);
create policy graveyard_insert on public.graveyard for insert with check (auth.uid() = user_id);
create policy graveyard_update on public.graveyard for update using (auth.uid() = user_id);
create policy graveyard_delete on public.graveyard for delete using (auth.uid() = user_id);
