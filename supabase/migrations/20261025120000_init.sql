-- Mentoria: schema inicial.
-- Produto separado do MyShape (projeto Supabase próprio).
-- Modelo: trilhas -> aulas (texto + checklist + checkpoint) -> materiais;
-- acesso por matrícula ativa; progresso por aluno; tema da plataforma configurável.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Perfis (1 por usuário do auth). Papel: aluno ou admin.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  email text,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Conteúdo
-- ---------------------------------------------------------------------------
create table public.tracks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  position int not null,
  title text not null,
  promise text,
  checkpoint text,
  is_entry boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.tracks on delete cascade,
  position int not null,
  title text not null,
  objective text,
  body_md text not null default '',
  -- [{ "id": "a1", "text": "...", "hint": "..." }]
  checklist jsonb not null default '[]'::jsonb,
  -- Se preenchido, a aula tem um checkpoint que só libera com o checklist completo.
  checkpoint_title text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index lessons_track_position_idx on public.lessons (track_id, position);

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  track_id uuid references public.tracks on delete cascade,
  lesson_id uuid references public.lessons on delete set null,
  title text not null,
  description text,
  kind text not null default 'documento' check (kind in ('documento', 'planilha', 'guia', 'checklist')),
  storage_path text,
  external_url text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Acesso e progresso
-- ---------------------------------------------------------------------------
create table public.enrollments (
  user_id uuid primary key references auth.users on delete cascade,
  status text not null default 'active' check (status in ('active', 'paused', 'canceled')),
  source text not null default 'manual' check (source in ('manual', 'kiwify')),
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.lesson_progress (
  user_id uuid not null references auth.users on delete cascade,
  lesson_id uuid not null references public.lessons on delete cascade,
  checked jsonb not null default '[]'::jsonb,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ---------------------------------------------------------------------------
-- Aparência da plataforma (linha única, editável no admin)
-- ---------------------------------------------------------------------------
create table public.app_settings (
  id int primary key default 1 check (id = 1),
  brand_name text not null default 'Mentoria',
  accent text not null default '#13A6E6' check (accent ~ '^#[0-9A-Fa-f]{6}$'),
  base text not null default 'light' check (base in ('light', 'graphite', 'dark')),
  myshape_url text not null default 'https://my-shape.app',
  updated_at timestamptz not null default now()
);
insert into public.app_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Helpers de autorização (SECURITY DEFINER para evitar recursão de RLS)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.has_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin() or exists (
    select 1 from public.enrollments
    where user_id = auth.uid()
      and status = 'active'
      and (expires_at is null or expires_at > now())
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.tracks enable row level security;
alter table public.lessons enable row level security;
alter table public.materials enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.app_settings enable row level security;

-- profiles: cada um vê o próprio; admin vê todos. Papel só muda por admin.
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy profiles_update_self on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_all on public.profiles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create or replace function public.guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- auth.uid() nulo = SQL Editor / service role (bootstrap do primeiro admin).
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Somente administradores podem alterar papéis.';
  end if;
  return new;
end;
$$;
create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.guard_profile_role();

-- conteúdo: lê quem tem acesso (e só o publicado); escreve só admin.
create policy tracks_read on public.tracks for select to authenticated
  using (public.is_admin() or (published and public.has_access()));
create policy tracks_write on public.tracks for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy lessons_read on public.lessons for select to authenticated
  using (public.is_admin() or (published and public.has_access()));
create policy lessons_write on public.lessons for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy materials_read on public.materials for select to authenticated
  using (public.has_access());
create policy materials_write on public.materials for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- matrícula: aluno vê a própria; admin gerencia.
create policy enrollments_select on public.enrollments for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy enrollments_admin on public.enrollments for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- progresso: aluno com acesso grava o próprio; admin lê todos.
create policy progress_select on public.lesson_progress for select to authenticated
  using ((user_id = auth.uid() and public.has_access()) or public.is_admin());
create policy progress_insert on public.lesson_progress for insert to authenticated
  with check (user_id = auth.uid() and public.has_access());
create policy progress_update on public.lesson_progress for update to authenticated
  using (user_id = auth.uid() and public.has_access())
  with check (user_id = auth.uid() and public.has_access());

-- aparência: todos leem (inclusive a tela de login); só admin altera.
create policy settings_read on public.app_settings for select to anon, authenticated
  using (true);
create policy settings_write on public.app_settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- updated_at automático
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger lessons_touch before update on public.lessons
  for each row execute function public.touch_updated_at();
create trigger enrollments_touch before update on public.enrollments
  for each row execute function public.touch_updated_at();
create trigger progress_touch before update on public.lesson_progress
  for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.app_settings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Storage: bucket privado de materiais (download por URL assinada)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('materials', 'materials', false)
on conflict (id) do nothing;

create policy materials_files_read on storage.objects for select to authenticated
  using (bucket_id = 'materials' and public.has_access());
create policy materials_files_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'materials' and public.is_admin());
create policy materials_files_update on storage.objects for update to authenticated
  using (bucket_id = 'materials' and public.is_admin());
create policy materials_files_delete on storage.objects for delete to authenticated
  using (bucket_id = 'materials' and public.is_admin());
