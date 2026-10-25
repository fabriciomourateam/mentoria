-- SETUP COMPLETO DA MENTORIA (cole tudo no SQL Editor do Supabase e clique em Run).
-- É a soma das 3 migrations de supabase/migrations, na ordem. Rodar uma única vez.

-- ===== supabase/migrations/20261025120000_init.sql =====
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

-- ===== supabase/migrations/20261025120100_seed_grade.sql =====
-- Seed da grade aprovada (v1): trilha de entrada + 6 pilares, 29 aulas.
-- Ordem aprovada: Vendas (2) antes de Captação (3).
-- Só a aula "Sua oferta irresistível em uma página" vem com texto completo (aula-modelo);
-- as demais nascem com título + objetivo e o texto é escrito pelo painel admin.

insert into public.tracks (slug, position, title, promise, checkpoint, is_entry) values
  ('comece-por-aqui', 0, 'Comece por aqui',
   'Virar a chave de personal que vende hora para dono de consultoria.',
   'Diagnóstico inicial preenchido', true),
  ('posicionamento-oferta', 1, 'Posicionamento e Oferta',
   'Clareza de nicho e uma oferta que o aluno entende em 30 segundos.',
   'Oferta de 1 página escrita', false),
  ('vendas', 2, 'Vendas',
   'Fechar com naturalidade, sem insistência. Venda consultiva.',
   'Script de venda adaptado ao seu nicho', false),
  ('captacao', 3, 'Captação',
   'Encher a agenda com leads certos, de forma orgânica.',
   'Funil montado e 10 leads registrados', false),
  ('entrega-jornada', 4, 'Entrega e Jornada do aluno',
   'Uma experiência premium que faz o aluno renovar e indicar.',
   'Jornada do aluno desenhada', false),
  ('gestao-tempo', 5, 'Gestão e Tempo',
   'Crescer sem virar escravo do próprio negócio.',
   'Seus 3 processos-chave documentados', false),
  ('financas', 6, 'Finanças',
   'Saber quanto sobra de verdade e crescer com o caixa sob controle.',
   'Sua DRE e pró-labore preenchidos', false)
on conflict (slug) do nothing;

insert into public.lessons (track_id, position, title, objective)
select t.id, v.position, v.title, v.objective
from (values
  ('comece-por-aqui', 1, 'De treinador a dono de negócio', 'Mudar a identidade: você vende transformação, não hora de academia.'),
  ('comece-por-aqui', 2, 'O glossário do negócio', 'Os termos que você vai usar daqui pra frente: CAC, LTV, funil, ticket e churn.'),
  ('comece-por-aqui', 3, 'Como funciona a plataforma e o seu sistema', 'Onde você aprende aqui e onde você opera: seu MyShape e o app do aluno.'),
  ('comece-por-aqui', 4, 'Como estudar e executar', 'A fórmula pra não acumular aula: aprender, aplicar e marcar o checkpoint.'),
  ('comece-por-aqui', 5, 'Onde você está hoje', 'Diagnóstico inicial do seu negócio, o ponto de partida da sua evolução.'),

  ('posicionamento-oferta', 1, 'Seu nicho e o aluno ideal', 'Pra quem você fala: o aluno que mais aparece hoje, não o dos sonhos.'),
  ('posicionamento-oferta', 2, 'Sua oferta irresistível em uma página', 'Os 4 blocos: promessa, para quem é, o que inclui, preço e garantia.'),
  ('posicionamento-oferta', 3, 'Precificação: do preço por hora ao pacote', 'Calcular seu preço mínimo e ancorar o valor do acompanhamento.'),
  ('posicionamento-oferta', 4, 'Escada de valor', 'Do produto de entrada ao premium, pra crescer o ticket ao longo do tempo.'),

  ('vendas', 1, 'A avaliação que fecha', 'O roteiro da conversa de venda: diagnóstico e proposta no fim.'),
  ('vendas', 2, 'Quebra de objeção', 'Preço, tempo e "vou pensar": respostas prontas e honestas.'),
  ('vendas', 3, 'Fechamento no fim da avaliação', 'Conduzir pro sim sem pressão, com a oferta clara na mão.'),
  ('vendas', 4, 'Follow-up que recupera lead', 'O "não agora" vira venda depois com o acompanhamento certo.'),

  ('captacao', 1, 'Conteúdo que atrai o aluno certo', 'Tipos de post, calendário e o que postar pra gerar interesse, não só likes.'),
  ('captacao', 2, 'O funil de captação', 'Do seguidor ao lead: o caminho que transforma audiência em conversa.'),
  ('captacao', 3, 'Social selling: o direct que vira conversa', 'Abordar sem ser chato e levar pro WhatsApp e pra avaliação.'),
  ('captacao', 4, 'Seus primeiros 10 leads', 'Pôr em prática: gerar e registrar os primeiros interessados.'),

  ('entrega-jornada', 1, 'Onboarding do aluno novo', 'As boas-vindas que começam a entrega com o pé direito.'),
  ('entrega-jornada', 2, 'Montando o acompanhamento no MyShape', 'Treino e dieta no painel, e o aluno acompanha tudo pelo app.'),
  ('entrega-jornada', 3, 'O método de check-in', 'O acompanhamento periódico que mantém o aluno engajado e retido.'),
  ('entrega-jornada', 4, 'Experiência premium e renovação', 'Pontos de contato e prova de evolução que fazem o aluno continuar e indicar.'),

  ('gestao-tempo', 1, 'A rotina do dono', 'Produtividade e prioridade pra sobrar tempo no seu dia.'),
  ('gestao-tempo', 2, 'Processos e POPs', 'Padronizar o que se repete pra poder delegar depois.'),
  ('gestao-tempo', 3, 'Sua primeira contratação', 'Quando e quem contratar, e como integrar essa pessoa.'),
  ('gestao-tempo', 4, 'Os números que você acompanha', 'CAC, LTV e churn: o painel mínimo do dono de consultoria.'),

  ('financas', 1, 'Faturamento, receita e caixa', 'Parar de confundir dinheiro que entra com dinheiro que sobra.'),
  ('financas', 2, 'Pró-labore e separação PF e PJ', 'Separar o bolso da empresa do seu bolso, de um jeito simples.'),
  ('financas', 3, 'Preço certo e ponto de equilíbrio', 'Quanto você precisa vender pra pagar as contas e começar a lucrar.'),
  ('financas', 4, 'Projeção anual em cenários', 'Planejar o ano em três cenários: conservador, realista e ousado.')
) as v(slug, position, title, objective)
join public.tracks t on t.slug = v.slug;

-- Checkpoints (um por trilha) com seus checklists.
update public.lessons l set checkpoint_title = 'Diagnóstico inicial preenchido', checklist = '[
  {"id":"d1","text":"Seu faturamento médio dos últimos 3 meses","hint":"Some e divida por três. Vale o número real, não o desejado."},
  {"id":"d2","text":"Quantos alunos você atende hoje","hint":"Presenciais e online, separados."},
  {"id":"d3","text":"Quantas horas por semana você passa na academia","hint":"É o número que a gente quer reduzir."},
  {"id":"d4","text":"Sua meta de faturamento para daqui a 6 meses","hint":"Um número só. Ele vai guiar suas próximas decisões."}
]'::jsonb
from public.tracks t where l.track_id = t.id and t.slug = 'comece-por-aqui' and l.position = 5;

update public.lessons l set checkpoint_title = 'Oferta de 1 página escrita', checklist = '[
  {"id":"o1","text":"Promessa central numa frase","hint":"Quem você ajuda, o resultado e o prazo."},
  {"id":"o2","text":"Para quem é e para quem não é","hint":"Afasta curioso e atrai quem paga."},
  {"id":"o3","text":"O que está incluso","hint":"Plano, acompanhamento, app e check-ins."},
  {"id":"o4","text":"Preço e garantia","hint":"Ancora o valor e tira o risco de cima do aluno."}
]'::jsonb,
body_md = $md$
## Por que a maioria trava aqui

O personal que fatura R$ 4 mil por mês vende **aulas**. O que fatura R$ 20 mil vende um **resultado com prazo**. A diferença não está no preço. Está na clareza da oferta: ninguém paga caro por algo que não entende.

> **A regra desta aula:** sua oferta precisa caber em uma frase.
> "Eu ajudo **[quem]** a **[resultado]** em **[prazo]**, sem **[a dor]**."
> Se não cabe, ainda está confusa.

## Os 4 blocos da oferta de uma página

**1. Promessa central.** A frase única acima. Escreva três versões e fique com a mais específica.

**2. Para quem é, e para quem não é.** Dizer quem você não atende afasta o curioso e aumenta a confiança de quem é o seu aluno.

**3. O que está incluso.** Plano de treino, acompanhamento, app, check-ins e suporte. Escreva o "como" da entrega, não só o "o quê".

**4. Preço e garantia.** Ancore o valor no resultado, não na hora. A garantia tira o risco de cima do aluno.

## Como usar esta aula

Abra o **Modelo de Oferta (1 página)** nos materiais, preencha os quatro blocos e marque cada um no checklist. O checkpoint libera quando os quatro estiverem prontos.
$md$
from public.tracks t where l.track_id = t.id and t.slug = 'posicionamento-oferta' and l.position = 2;

update public.lessons l set checkpoint_title = 'Script de venda adaptado ao seu nicho', checklist = '[
  {"id":"v1","text":"Abertura: como você começa a conversa","hint":"Quebra o gelo e explica como a avaliação vai funcionar."},
  {"id":"v2","text":"Diagnóstico: as perguntas que você faz","hint":"Objetivo, histórico, rotina e o que já tentou."},
  {"id":"v3","text":"Proposta: como você apresenta a oferta","hint":"Liga a dor do aluno à sua promessa."},
  {"id":"v4","text":"Fechamento: a pergunta final","hint":"Uma pergunta direta, sem pressão."}
]'::jsonb
from public.tracks t where l.track_id = t.id and t.slug = 'vendas' and l.position = 1;

update public.lessons l set checkpoint_title = 'Funil montado e 10 leads registrados', checklist = '[
  {"id":"c1","text":"Definiu o caminho do seguidor até a conversa","hint":"Post, direct, WhatsApp, avaliação."},
  {"id":"c2","text":"Criou uma planilha ou lista de leads","hint":"Nome, origem, data e próximo passo."},
  {"id":"c3","text":"Registrou 10 interessados","hint":"Conta qualquer pessoa que pediu informação."}
]'::jsonb
from public.tracks t where l.track_id = t.id and t.slug = 'captacao' and l.position = 4;

update public.lessons l set checkpoint_title = 'Jornada do aluno desenhada', checklist = '[
  {"id":"j1","text":"Boas-vindas do primeiro dia","hint":"A mensagem e o que o aluno recebe ao fechar."},
  {"id":"j2","text":"Frequência de check-in","hint":"Semanal ou quinzenal, e o que você pergunta."},
  {"id":"j3","text":"Pontos de contato ao longo do plano","hint":"Quando você aparece sem o aluno pedir."},
  {"id":"j4","text":"Prova de evolução antes da renovação","hint":"Antes e depois, números e fotos."}
]'::jsonb
from public.tracks t where l.track_id = t.id and t.slug = 'entrega-jornada' and l.position = 4;

update public.lessons l set checkpoint_title = 'Seus 3 processos-chave documentados', checklist = '[
  {"id":"g1","text":"Processo de entrada do aluno novo","hint":"Do pagamento ao primeiro plano entregue."},
  {"id":"g2","text":"Processo de check-in","hint":"Quem faz, quando e com qual mensagem."},
  {"id":"g3","text":"Processo de renovação","hint":"Quando começa e o que você envia."}
]'::jsonb
from public.tracks t where l.track_id = t.id and t.slug = 'gestao-tempo' and l.position = 2;

update public.lessons l set checkpoint_title = 'Sua DRE e pró-labore preenchidos', checklist = '[
  {"id":"f1","text":"Abriu uma conta separada para o negócio","hint":"Nada de misturar com a conta pessoal."},
  {"id":"f2","text":"Definiu seu pró-labore mensal","hint":"Use a calculadora nos materiais."},
  {"id":"f3","text":"Preencheu a DRE do último mês","hint":"Receita, custos e o que sobrou."}
]'::jsonb
from public.tracks t where l.track_id = t.id and t.slug = 'financas' and l.position = 2;

-- Materiais por trilha (arquivos são enviados pelo admin depois).
insert into public.materials (track_id, title, description, kind, position)
select t.id, v.title, v.description, v.kind, v.position
from (values
  ('posicionamento-oferta', 'Modelo de Oferta (1 página)', 'Documento editável com os 4 blocos.', 'documento', 1),
  ('posicionamento-oferta', 'Planilha de Precificação', 'Calcula seu preço mínimo.', 'planilha', 2),
  ('posicionamento-oferta', '7 passos para definir seu público', 'Guia rápido de nicho.', 'guia', 3),
  ('vendas', 'Script de vendas', 'Roteiro da avaliação que fecha.', 'documento', 1),
  ('vendas', 'Quebra de objeção', 'Respostas para preço, tempo e "vou pensar".', 'guia', 2),
  ('vendas', 'Apresentação que converte', 'Modelo de proposta.', 'documento', 3),
  ('vendas', 'Follow-up inteligente', 'Mensagens para recuperar leads.', 'guia', 4),
  ('captacao', 'Calendário de postagens', 'Planejamento mensal de conteúdo.', 'planilha', 1),
  ('captacao', 'Funil Ampulheta', 'Aquisição e retenção num desenho só.', 'guia', 2),
  ('captacao', 'Formulário de aplicação de lead', 'Qualifica antes da avaliação.', 'documento', 3),
  ('captacao', 'Banco de referências de conteúdo', 'Ideias de posts por tipo.', 'guia', 4),
  ('entrega-jornada', 'Boas-vindas ao aluno', 'Mensagens e checklist do primeiro dia.', 'checklist', 1),
  ('entrega-jornada', 'Health Score', 'Mede o risco de cancelamento.', 'planilha', 2),
  ('entrega-jornada', 'Formulário de saída', 'Entende por que o aluno saiu.', 'documento', 3),
  ('entrega-jornada', 'Dossiê de resultados', 'Antes e depois para a renovação.', 'documento', 4),
  ('gestao-tempo', 'Modelo de POP', 'Documenta um processo em 1 página.', 'documento', 1),
  ('gestao-tempo', 'OKR', 'Metas trimestrais com resultados-chave.', 'planilha', 2),
  ('gestao-tempo', 'Reunião 1:1', 'Pauta para conversar com a equipe.', 'guia', 3),
  ('financas', 'Calculadora de Pró-labore', 'Quanto você pode retirar por mês.', 'planilha', 1),
  ('financas', 'DRE do negócio', 'Receita, custos e resultado.', 'planilha', 2),
  ('financas', 'Checklist PF e PJ', 'Separa as finanças em 15 minutos.', 'checklist', 3),
  ('financas', 'Projeção anual em 3 cenários', 'Conservador, realista e ousado.', 'planilha', 4)
) as v(slug, title, description, kind, position)
join public.tracks t on t.slug = v.slug;

-- ===== supabase/migrations/20261025120200_kiwify_access.sql =====
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
