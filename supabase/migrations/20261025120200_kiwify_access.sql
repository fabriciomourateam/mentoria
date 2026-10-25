-- Liberação automática pela Kiwify.
-- A compra pode chegar ANTES do aluno criar a conta. Por isso guardamos o acesso
-- por e-mail em access_grants; quando a conta nasce (ou já existe), a matrícula é aplicada.

create table if not exists public.access_grants (
  email text primary key,
  status text not null check (status in ('active', 'paused', 'canceled')),
  source text not null default 'kiwify' check (source in ('manual', 'kiwify')),
  order_id text,
  updated_at timestamptz not null default now()
);
alter table public.access_grants enable row level security;
-- Só admin enxerga; a escrita vem da edge function com service role.
drop policy if exists access_grants_admin on public.access_grants;
create policy access_grants_admin on public.access_grants for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Aplica um grant ao usuário com esse e-mail (se existir).
create or replace function public.apply_access_grant(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  g public.access_grants;
  uid uuid;
begin
  select * into g from public.access_grants where email = lower(p_email);
  if not found then return; end if;
  select id into uid from auth.users where lower(email) = lower(p_email) limit 1;
  if uid is null then return; end if;
  insert into public.enrollments (user_id, status, source)
  values (uid, g.status, g.source)
  on conflict (user_id) do update set status = excluded.status, source = excluded.source;
end;
$$;
revoke execute on function public.apply_access_grant(text) from public, anon, authenticated;

-- Novo usuário: cria o perfil e aplica compra feita antes do cadastro.
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
  perform public.apply_access_grant(new.email);
  return new;
end;
$$;
