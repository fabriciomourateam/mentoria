-- Espaço de trabalho do aluno ("Meu Negócio"): fichas, ferramentas financeiras e leads.
-- Cada ficha/ferramenta é um documento JSON por aluno (workspace_entries); leads têm tabela própria.
-- O aluno só vê e edita o que é dele; o gestor (admin) lê tudo para acompanhar a mentoria.

create table if not exists public.workspace_entries (
  user_id uuid not null references auth.users on delete cascade,
  key text not null check (key ~ '^[a-z0-9-]{2,40}$'),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  name text not null,
  contact text,
  origin text,
  stage text not null default 'novo'
    check (stage in ('novo', 'conversa', 'avaliacao', 'proposta', 'fechou', 'perdido')),
  next_step text,
  next_date date,
  value numeric(12, 2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_user_idx on public.leads (user_id, created_at desc);

alter table public.workspace_entries enable row level security;
alter table public.leads enable row level security;

drop policy if exists workspace_own on public.workspace_entries;
create policy workspace_own on public.workspace_entries for all to authenticated
  using (user_id = auth.uid() and public.has_access())
  with check (user_id = auth.uid() and public.has_access());
drop policy if exists workspace_admin_read on public.workspace_entries;
create policy workspace_admin_read on public.workspace_entries for select to authenticated
  using (public.is_admin());

drop policy if exists leads_own on public.leads;
create policy leads_own on public.leads for all to authenticated
  using (user_id = auth.uid() and public.has_access())
  with check (user_id = auth.uid() and public.has_access());
drop policy if exists leads_admin_read on public.leads;
create policy leads_admin_read on public.leads for select to authenticated
  using (public.is_admin());

drop trigger if exists workspace_touch on public.workspace_entries;
create trigger workspace_touch before update on public.workspace_entries
  for each row execute function public.touch_updated_at();
drop trigger if exists leads_touch on public.leads;
create trigger leads_touch before update on public.leads
  for each row execute function public.touch_updated_at();
