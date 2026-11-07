-- Acompanhamento do aluno: revisão das entregas, check-in semanal e calls ao vivo.
-- Idempotente: pode rodar mais de uma vez.

-- ---------------------------------------------------------------------------
-- 1. Revisão das entregas (checkpoints). Uma linha por aluno e aula; reenviar
--    volta para "pending". Escrita só pelas funções abaixo (o aluno não consegue
--    se aprovar sozinho).
-- ---------------------------------------------------------------------------
create table if not exists public.checkpoint_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  lesson_id uuid not null references public.lessons on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'changes')),
  student_note text,
  mentor_note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (user_id, lesson_id)
);
create index if not exists checkpoint_reviews_status_idx on public.checkpoint_reviews (status, submitted_at);

alter table public.checkpoint_reviews enable row level security;
drop policy if exists reviews_read on public.checkpoint_reviews;
create policy reviews_read on public.checkpoint_reviews for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create or replace function public.submit_checkpoint(p_lesson uuid, p_note text)
returns public.checkpoint_reviews
language plpgsql
security definer
set search_path = public
as $$
declare r public.checkpoint_reviews;
begin
  if auth.uid() is null or not public.has_access() then
    raise exception 'Sem acesso.';
  end if;
  insert into public.checkpoint_reviews (user_id, lesson_id, student_note)
  values (auth.uid(), p_lesson, nullif(trim(p_note), ''))
  on conflict (user_id, lesson_id) do update
    set status = 'pending', student_note = excluded.student_note,
        submitted_at = now(), reviewed_at = null
  returning * into r;
  return r;
end;
$$;

create or replace function public.review_checkpoint(p_id uuid, p_status text, p_note text)
returns public.checkpoint_reviews
language plpgsql
security definer
set search_path = public
as $$
declare r public.checkpoint_reviews;
begin
  if not public.is_admin() then
    raise exception 'Só o mentor revisa.';
  end if;
  if p_status not in ('approved', 'changes') then
    raise exception 'Status inválido.';
  end if;
  update public.checkpoint_reviews
     set status = p_status, mentor_note = nullif(trim(p_note), ''), reviewed_at = now()
   where id = p_id
  returning * into r;
  return r;
end;
$$;

revoke all on function public.submit_checkpoint(uuid, text) from public;
revoke all on function public.review_checkpoint(uuid, text, text) from public;
grant execute on function public.submit_checkpoint(uuid, text) to authenticated;
grant execute on function public.review_checkpoint(uuid, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Check-in semanal: os números da semana (segunda a domingo, horário de
--    São Paulo). Uma linha por aluno e semana.
-- ---------------------------------------------------------------------------
create table if not exists public.weekly_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  week_start date not null,
  leads int not null default 0 check (leads >= 0),
  conversas int not null default 0 check (conversas >= 0),
  vendas int not null default 0 check (vendas >= 0),
  alunos_ativos int not null default 0 check (alunos_ativos >= 0),
  faturamento numeric(12, 2) check (faturamento is null or faturamento >= 0),
  nota text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);
create index if not exists weekly_checkins_user_idx on public.weekly_checkins (user_id, week_start);

alter table public.weekly_checkins enable row level security;
drop policy if exists checkins_own on public.weekly_checkins;
create policy checkins_own on public.weekly_checkins for all to authenticated
  using (user_id = auth.uid() and public.has_access())
  with check (user_id = auth.uid() and public.has_access());
drop policy if exists checkins_admin_read on public.weekly_checkins;
create policy checkins_admin_read on public.weekly_checkins for select to authenticated
  using (public.is_admin());

drop trigger if exists checkins_touch on public.weekly_checkins;
create trigger checkins_touch before update on public.weekly_checkins
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 3. Calls ao vivo: agenda, link do Meet, gravação e dúvidas enviadas antes.
-- ---------------------------------------------------------------------------
create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  meet_url text,
  recording_url text,
  agenda text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists calls_starts_idx on public.calls (starts_at);

alter table public.calls enable row level security;
drop policy if exists calls_read on public.calls;
create policy calls_read on public.calls for select to authenticated
  using (public.has_access());
drop policy if exists calls_write on public.calls;
create policy calls_write on public.calls for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop trigger if exists calls_touch on public.calls;
create trigger calls_touch before update on public.calls
  for each row execute function public.touch_updated_at();

create table if not exists public.call_questions (
  id uuid primary key default gen_random_uuid(),
  call_id uuid not null references public.calls on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  question text not null check (char_length(question) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists call_questions_call_idx on public.call_questions (call_id, created_at);

alter table public.call_questions enable row level security;
drop policy if exists questions_read on public.call_questions;
create policy questions_read on public.call_questions for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists questions_insert on public.call_questions;
create policy questions_insert on public.call_questions for insert to authenticated
  with check (user_id = auth.uid() and public.has_access());
drop policy if exists questions_delete on public.call_questions;
create policy questions_delete on public.call_questions for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());
