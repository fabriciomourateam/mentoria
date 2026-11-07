-- Rodar UMA vez no Supabase (SQL Editor > New query > colar tudo > Run).
-- Junta 3 migrations de 07/11: vídeo por aula, revisão/check-in/calls e a trilha Tráfego pago. Pode rodar de novo sem problema.

-- ===== supabase/migrations/20261107120000_lessons_video.sql =====
-- Vídeo da aula: link do YouTube (não listado), Vimeo, Panda Video, Bunny ou arquivo .mp4.
-- Leitura e escrita seguem as policies que já existem em public.lessons.
alter table public.lessons add column if not exists video_url text;

-- ===== supabase/migrations/20261107130000_revisoes_checkins_calls.sql =====
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

-- ===== supabase/migrations/20261107140000_trilha_trafego_pago.sql =====
-- Trilha "Tráfego pago": 1 trilha e 5 aulas com texto e checklist. Idempotente.

insert into public.tracks (slug, position, title, promise, checkpoint, is_entry, published)
select 'trafego-pago', coalesce(max(position), 0) + 1, 'Tráfego pago',
  'Anúncios que trazem conversa no WhatsApp todo dia, com um orçamento que cabe no seu caixa.',
  'Primeira campanha no ar com meta de custo por conversa', false, true
from public.tracks
on conflict (slug) do nothing;

-- Aula 1: Quando anunciar (e quando ainda não)
insert into public.lessons (track_id, position, title, objective, body_md, checklist, checkpoint_title, published)
select t.id, 1, 'Quando anunciar (e quando ainda não)', 'Calcular quanto você pode pagar por uma conversa e decidir com números se já é hora de anunciar.',
$md$
## Anúncio não conserta um negócio, ele amplia

Tráfego pago é um amplificador. Se a sua oferta é clara, o atendimento responde rápido e a venda converte, o anúncio traz mais gente para esse processo. Se qualquer uma dessas peças está quebrada, o anúncio só faz você perder dinheiro mais depressa.

> **A regra desta aula:** anuncie quando você sabe quanto vale um aluno e quanto pode pagar para conquistá-lo. Antes disso, é aposta.

## Os três pré-requisitos

Antes de colocar um real em anúncio, confirme:

- **Oferta validada:** você já vendeu o acompanhamento, pelo menos algumas vezes, para pessoas que não eram amigas. Se nunca fechou com um desconhecido, volte para a trilha de Vendas.
- **Atendimento pronto:** alguém (você ou uma pessoa da equipe) responde no WhatsApp em poucos minutos, conduz a conversa e faz o follow-up. Anúncio gera pico de mensagens, e lead esperando esfria.
- **Conta feita:** você sabe o seu ticket, quanto tempo o aluno fica e quanto sobra de cada venda. É a conta desta aula.

## A conta do que você pode pagar

Use os números reais do seu negócio. Exemplo:

1. **Ticket mensal:** R$ 300.
2. **Meses médios de permanência:** 6.
3. **LTV (receita por aluno):** R$ 300 x 6 = R$ 1.800.
4. **Margem:** sobra 70% depois de taxas, impostos e custo de entrega. Margem do aluno: R$ 1.800 x 0,70 = R$ 1.260.
5. **CAC máximo:** invista no máximo 30% dessa margem para conquistar o aluno. R$ 1.260 x 0,30 = **R$ 378**.

Esse é o teto, não a meta. Os outros 70% pagam suas contas, seu pró-labore e deixam lucro. Quem aceita pagar quase tudo da margem para vender não está crescendo, está trocando dinheiro.

## Do CAC ao custo por conversa

Você não paga por aluno, paga por clique, conversa ou lead. Então traduza o teto usando a sua taxa de conversão:

- Se 15% das conversas no WhatsApp viram aluno, uma conversa pode custar até R$ 378 x 0,15 = **R$ 56,70**.
- Se só 60% dos leads (cliques e cadastros) chegam a conversar, o lead vale R$ 378 x 0,15 x 0,60 = **R$ 34**.

Se hoje você paga R$ 20 por conversa, sobra folga. Se paga R$ 90, a conta não fecha e é preciso melhorar a oferta, o criativo ou o atendimento antes de escalar.

## Sem histórico, use estimativas conservadoras

Se você ainda não sabe a sua conversão, assuma 10% de conversa para venda e 4 meses de permanência. Depois de 20 a 30 conversas reais, troque pelas taxas verdadeiras. A Calculadora de tráfego, nos materiais desta trilha, faz essa conta por você.

## Quando ainda não anunciar

- Você nunca vendeu para desconhecidos.
- Ninguém responde o WhatsApp em horário comercial.
- O caixa não aguenta perder o orçamento do mês. Anúncio tem fase de teste, e uma parte do dinheiro vai servir para aprender.
- A margem é tão apertada que o CAC máximo fica menor que o custo mínimo de uma conversa na sua cidade.

## Um dado real para ancorar

O Fabricio investe cerca de R$ 30 mil por mês em Google Ads e acompanha a conta o tempo todo. O orçamento é grande porque a conta fecha: ele sabe quanto vale um aluno e quanto pode pagar por cada conversa. Você começa pequeno (R$ 20 a R$ 50 por dia), mas com a mesma lógica.

## Erros comuns

- Anunciar para "ver o que acontece", sem meta de custo.
- Confundir faturamento com margem na hora de calcular o teto.
- Esquecer a taxa de cancelamento e supor que o aluno fica para sempre.
- Contar só o gasto em anúncio e esquecer ferramenta, edição de vídeo e tempo de atendimento.

## Como usar esta aula

Abra a Calculadora de tráfego, preencha ticket, permanência, margem e as taxas de conversão (use as estimativas se ainda não tiver as reais) e anote o seu CAC máximo e o custo máximo por conversa. Esses dois números guiam todas as próximas aulas. Os valores em reais são exemplos de cálculo, não promessa de resultado.
$md$,
'[{"id":"tp1-1","text":"Calcular o LTV do seu aluno","hint":"Ticket mensal x meses médios de permanência. Sem histórico, use 4 meses."},{"id":"tp1-2","text":"Definir o CAC máximo","hint":"30% da margem do aluno. Use a Calculadora de tráfego."},{"id":"tp1-3","text":"Descobrir o custo máximo por conversa","hint":"CAC máximo x taxa de conversa para venda."},{"id":"tp1-4","text":"Conferir os três pré-requisitos","hint":"Oferta já vendida, atendimento rápido no WhatsApp e caixa para testar."}]'::jsonb,
null, true
from public.tracks t
where t.slug = 'trafego-pago'
  and not exists (select 1 from public.lessons x where x.track_id = t.id and x.position = 1);

-- Aula 2: Onde anunciar: Instagram ou Google
insert into public.lessons (track_id, position, title, objective, body_md, checklist, checkpoint_title, published)
select t.id, 2, 'Onde anunciar: Instagram ou Google', 'Escolher uma única plataforma para começar, com base em como o seu aluno ideal chega até você.',
$md$
## Duas formas de aparecer

Existem dois grandes caminhos para trazer gente para o seu WhatsApp, e eles funcionam de jeitos diferentes.

- **Instagram e Facebook (Meta):** você interrompe a rolagem de alguém que não estava procurando por você. A pessoa descobre que tem um problema que você resolve.
- **Google:** você aparece para quem já está procurando. A pessoa digitou "personal trainer online" ou "nutricionista online" e quer resolver agora.

> **A regra desta aula:** comece por uma plataforma só. Duas campanhas fracas ensinam menos que uma bem acompanhada.

## Meta (Instagram): gera demanda

**Pontos fortes:**

- Alcança muita gente por um custo por mil impressões baixo.
- Permite segmentar por interesse e região, e mostrar o seu rosto e o seu jeito de falar.
- Combina com quem já produz conteúdo, porque o melhor anúncio costuma ser um vídeo seu.

**Pontos de atenção:**

- A intenção de compra é menor: o lead chega mais frio e a conversa precisa esquentá-lo.
- O criativo (vídeo ou imagem) pesa mais que qualquer ajuste de público. Anúncio ruim não se salva com segmentação.
- Cansa rápido. Um vídeo bom pode perder força em 2 a 4 semanas.

## Google: captura demanda

**Pontos fortes:**

- O lead chega com intenção. Quem pesquisa "consultoria de emagrecimento online" quer resolver agora.
- A mensagem é simples: o anúncio é texto, com poucas palavras-chave.
- É estável. Uma boa campanha de pesquisa pode render por meses.

**Pontos de atenção:**

- O volume depende de quantas pessoas pesquisam o termo. Em cidades pequenas ou nichos específicos, é pouco.
- O clique pode custar mais, porque os anunciantes disputam as mesmas palavras.
- Exige cuidado com palavras-chave (evitar pesquisas que não têm a ver com o que você vende).

## O exemplo real do Fabricio

Nos últimos 30 dias, a operação dele no Google teve estes números:

- **Investimento:** R$ 31.117.
- **Cliques:** 13.532, com CTR de 5,22% e CPC médio de R$ 2,30.
- **Conversões:** 1.952 (cliques que viraram contato), com taxa de conversão de 14,43%.
- **Custo por conversão:** cerca de R$ 15,94.

Repare no encadeamento: o custo por conversão sai do CPC dividido pela taxa de conversão. R$ 2,30 / 0,1443 dá aproximadamente R$ 15,94. Se o clique encarece ou a página converte menos, o custo sobe. Esse raciocínio vale para qualquer plataforma. Os números dele refletem uma operação grande e otimizada ao longo de anos, e o seu ponto de partida será diferente.

## Como escolher

| Se o seu aluno... | Comece por... |
|---|---|
| Já pesquisa por solução ("nutricionista online") | Google |
| Precisa ser convencido de que tem um problema | Meta |
| Mora numa cidade pequena e atende só ali | Meta, com raio geográfico |
| Você já grava vídeos com frequência | Meta |
| Você não gosta de gravar e tem uma página simples | Google |

Na dúvida, Meta costuma ser mais fácil de testar com R$ 20 a R$ 50 por dia, porque o volume de impressões é alto. Google pede mais paciência no começo, com poucos cliques por dia.

## Cuidados com as regras

As plataformas têm políticas rígidas para saúde e fitness. Não prometa resultado de peso em prazo ("perca 8 kg em 30 dias"), não use antes e depois, e não aponte características pessoais ("você está acima do peso?"). Além disso, respeite as regras de publicidade do seu conselho (CREF ou CRN), que limitam promessa de resultado e sensacionalismo. Em caso de dúvida, consulte o seu conselho.

## Como usar esta aula

Responda no checklist por onde o seu aluno ideal te encontra hoje e escolha uma plataforma para os próximos 30 dias. Crie (ou confira) a conta de anúncios e a página do Instagram conectada. Os valores citados são exemplos, não promessa.
$md$,
'[{"id":"tp2-1","text":"Descrever por onde seu aluno ideal te encontra hoje","hint":"Busca no Google, Instagram, indicação. A resposta aponta a plataforma."},{"id":"tp2-2","text":"Escolher UMA plataforma para os próximos 30 dias","hint":"Meta ou Google. Registre o motivo."},{"id":"tp2-3","text":"Criar ou conferir a conta de anúncios","hint":"Forma de pagamento ativa e Instagram ou site conectado."},{"id":"tp2-4","text":"Ler as regras de anúncios de saúde e as do seu conselho","hint":"CREF ou CRN, mais a política da plataforma escolhida."}]'::jsonb,
null, true
from public.tracks t
where t.slug = 'trafego-pago'
  and not exists (select 1 from public.lessons x where x.track_id = t.id and x.position = 2);

-- Aula 3: Criativo e mensagem que geram conversa
insert into public.lessons (track_id, position, title, objective, body_md, checklist, checkpoint_title, published)
select t.id, 3, 'Criativo e mensagem que geram conversa', 'Escrever três anúncios que atraem o aluno ideal e levam direto para uma conversa no WhatsApp.',
$md$
## O criativo é 80% do resultado

Você pode acertar orçamento, público e configuração e ainda assim ter um anúncio que ninguém clica. O que a pessoa vê e ouve nos primeiros 3 segundos decide tudo. Por isso esta aula vem antes da montagem da campanha.

> **A regra desta aula:** um anúncio fala com uma pessoa, sobre um problema, e pede uma ação. Se tenta falar com todo mundo, não fala com ninguém.

## A estrutura de um anúncio que converte

1. **Gancho (3 primeiros segundos):** chama o aluno ideal pelo problema ou pela situação.
2. **Explicação (10 a 20 segundos):** mostra que você entende o caso e como resolve.
3. **Convite:** diz exatamente o que fazer em seguida.

Exemplos de gancho, sem promessa e sem apelar:

- "Se você treina há anos e o corpo não muda, o problema pode não estar no treino."
- "Mãe de dois filhos e sem tempo? Dá para treinar em casa em 30 minutos."
- "Nutricionista online: como funciona o acompanhamento semanal, na prática."

## Vídeo seu, no celular

O formato mais forte para profissional de saúde é o vídeo curto, de 20 a 45 segundos, com você falando para a câmera. Não precisa de estúdio:

- Luz natural, de frente.
- Áudio limpo (um microfone de lapela barato ajuda).
- Legenda no vídeo, porque muita gente assiste sem som.
- Formato vertical (9:16).

A confiança vem do rosto e da voz de quem vai acompanhar o aluno.

## Prova social sem antes e depois

Antes e depois de corpo é restrito pelas plataformas e pode ferir as regras do CREF e do CRN. Há outras provas:

- **Depoimento falado**, com a pessoa contando como foi o acompanhamento (com autorização por escrito).
- **Prints de conversas** com autorização e dados escondidos.
- **Números do seu método:** "acompanho meus alunos toda semana, com ajuste de plano".
- **Bastidores:** você montando um plano, atendendo um check-in.

## O texto do anúncio

Mantenha curto. Três linhas costumam bastar:

- Linha 1: o problema do aluno ideal.
- Linha 2: o que você oferece, sem prazo mágico de resultado.
- Linha 3: o convite, por exemplo "Toque em Enviar mensagem e conte seu objetivo".

## O destino: WhatsApp direto ou página simples

Dois caminhos funcionam:

- **Direto para o WhatsApp:** menos atrito e conversa mais rápida. Ideal para começar no Meta.
- **Página simples primeiro:** vale quando você quer filtrar curiosos. O Fabricio usa páginas com título claro, vídeo curto logo abaixo, selo de garantia em destaque, depoimentos, FAQ com as objeções reais e um botão fixo de WhatsApp com mensagem pré-preenchida. As melhorias que mais fazem diferença numa página assim: colocar a garantia no topo, trocar o botão genérico "Agendar" por uma chamada específica e adicionar vídeo de 60 a 90 segundos.

Para a sua primeira campanha, vá direto ao WhatsApp. Crie a página depois, quando houver volume.

## Produza três versões

Faça 3 criativos diferentes, mudando só o gancho (ou só o formato). Assim você descobre o que o seu público responde, em vez de adivinhar.

## Erros comuns

- Gravar vídeo longo demais, sem gancho.
- Usar frase de efeito do tipo "perca X kg em Y dias".
- Falar com "todo mundo que quer emagrecer".
- Não dizer o que fazer depois de assistir.

## Como usar esta aula

Grave 3 vídeos curtos com ganchos diferentes, escreva o texto de cada um e escolha o botão de ação (enviar mensagem no WhatsApp). Revise se nenhum deles usa antes e depois, promessa de prazo ou aponta característica pessoal do espectador.
$md$,
'[{"id":"tp3-1","text":"Escrever 3 ganchos para o aluno ideal","hint":"Cada um chama por um problema diferente, sem promessa de prazo."},{"id":"tp3-2","text":"Gravar 3 vídeos de 20 a 45 segundos","hint":"Vertical, com legenda e áudio limpo."},{"id":"tp3-3","text":"Escrever o texto e a chamada de cada anúncio","hint":"Três linhas: problema, oferta, convite."},{"id":"tp3-4","text":"Revisar com a lista de proibidos","hint":"Sem antes e depois, sem \"perca X kg em Y dias\", sem apontar característica pessoal."}]'::jsonb,
null, true
from public.tracks t
where t.slug = 'trafego-pago'
  and not exists (select 1 from public.lessons x where x.track_id = t.id and x.position = 3);

-- Aula 4: Montando a primeira campanha
insert into public.lessons (track_id, position, title, objective, body_md, checklist, checkpoint_title, published)
select t.id, 4, 'Montando a primeira campanha', 'Subir uma campanha simples, com orçamento pequeno, medição de conversa e atendimento pronto para responder.',
$md$
## Simples vence complexo

A primeira campanha tem um objetivo: gerar conversas para você medir. Não precisa de dez públicos nem de funis elaborados. Precisa de estrutura mínima e de acompanhamento.

> **A regra desta aula:** uma campanha, um objetivo, três criativos. Complicar antes de ter dados só atrapalha.

## A estrutura recomendada

- **1 campanha** com objetivo de gerar conversas no WhatsApp (ou, no Google, de gerar contatos).
- **1 ou 2 conjuntos de anúncios** (públicos). Exemplo: um público amplo da sua região e outro por interesse (fitness, musculação, alimentação saudável).
- **3 criativos** dentro de cada conjunto, os vídeos da aula anterior.

Resultado: 3 a 6 anúncios no total, o suficiente para comparar.

## Orçamento diário

Comece pequeno e constante:

- **R$ 20 a R$ 50 por dia.** Com R$ 30 por dia, em 7 dias você gasta R$ 210.
- Não mexa no orçamento durante os primeiros 3 a 4 dias. A plataforma precisa de tempo para aprender.
- Defina antes o limite de perda: quanto você aceita gastar até ter dados suficientes para decidir (por exemplo, R$ 300 a R$ 500).

Com R$ 30 por dia e um custo por conversa de R$ 15, você teria cerca de 2 conversas por dia, ou 60 por mês. Se 10% fecham, são 6 alunos. É um exemplo de conta, não uma promessa.

## Público

Para quem está começando:

- **Região:** a cidade e arredores, se o atendimento é local. Online, o Brasil todo ou os estados que você prefere.
- **Idade e gênero:** os do seu aluno ideal, mas deixe a plataforma ampliar se o volume for pouco.
- **Interesses:** poucos e claros. O criativo é quem filtra o público de verdade.
- **Não use** segmentação que indique condições pessoais de saúde. As políticas restringem esse tipo de uso.

## Medição

Se a plataforma não souber o que é uma conversa de verdade, ela otimiza para qualquer clique. Garanta:

- **Meta:** use o objetivo de mensagens, com destino WhatsApp, e conecte a conta comercial do WhatsApp à página.
- **Google:** instale a tag e registre a conversão de clique no botão de WhatsApp.
- **Página própria:** instale o pixel e o evento de contato.
- Use parâmetros no link (UTM) para saber de qual anúncio veio cada conversa, e pergunte "como você nos achou?" no atendimento.

## O atendimento é parte da campanha

Configure no WhatsApp Business:

- **Mensagem de boas-vindas automática:** diz quem você é e faz a primeira pergunta (por exemplo, qual é o seu objetivo hoje).
- **Horário de atendimento** e resposta fora do horário.
- **Respostas rápidas** para as dúvidas comuns.

E responda depressa. Quem chama pelo anúncio costuma estar com a decisão quente: nos primeiros 5 a 10 minutos, a chance de conversa é muito maior do que depois de horas.

## Antes de publicar

- O anúncio abre o WhatsApp certo?
- A mensagem pré-preenchida aparece?
- Alguém vai olhar as conversas hoje à noite?
- Os anúncios passaram na revisão de política da plataforma?

Faça um teste: clique no seu próprio anúncio e mande uma mensagem.

## Erros comuns

- Subir dez campanhas com R$ 5 cada.
- Mudar o orçamento ou os públicos todo dia.
- Deixar mensagem sem resposta por horas.
- Esquecer de anotar a data de início e o orçamento.

## Como usar esta aula

Suba a campanha com 3 criativos e orçamento fixo, configure a mensagem automática e teste o fluxo completo como se fosse um lead. Anote data de início, orçamento, objetivo e o limite de perda.
$md$,
'[{"id":"tp4-1","text":"Criar a campanha com 1 objetivo e 3 criativos","hint":"Mensagens no WhatsApp (Meta) ou contato (Google)."},{"id":"tp4-2","text":"Definir orçamento diário e limite de perda","hint":"De R$ 20 a R$ 50 por dia. O limite é quanto aceita gastar para aprender."},{"id":"tp4-3","text":"Configurar a mensagem de boas-vindas no WhatsApp","hint":"Quem você é e uma pergunta de abertura."},{"id":"tp4-4","text":"Testar o fluxo como se fosse um lead","hint":"Clicar no anúncio, mandar mensagem e ver quanto tempo leva para responder."}]'::jsonb,
null, true
from public.tracks t
where t.slug = 'trafego-pago'
  and not exists (select 1 from public.lessons x where x.track_id = t.id and x.position = 4);

-- Aula 5: Ler os números e escalar
insert into public.lessons (track_id, position, title, objective, body_md, checklist, checkpoint_title, published)
select t.id, 5, 'Ler os números e escalar', 'Criar uma rotina semanal de 15 minutos para cortar o que não funciona e aumentar o que funciona.',
$md$
## Número sem rotina vira enfeite

Campanha no ar não é campanha acompanhada. A diferença entre quem tem resultado e quem desiste está em olhar os mesmos números, no mesmo dia, e tomar decisões simples baseadas neles.

> **A regra desta aula:** decida com a meta de custo por conversa que você calculou na primeira aula, não com a sensação do dia.

## As métricas, em ordem

| Métrica | O que mostra | Como ler |
|---|---|---|
| **CPM** | Custo por mil impressões | Subiu muito? O público pode estar saturado |
| **CTR** | % de cliques sobre impressões | Baixo? O gancho ou a imagem não chamam |
| **CPC** | Custo por clique | Alto? Criativo fraco ou público muito disputado |
| **Custo por conversa** | Gasto dividido pelas conversas iniciadas | A métrica central da campanha |
| **Conversão conversa para venda** | Vendas sobre conversas | Baixa? O problema está no atendimento, não no anúncio |
| **CAC** | Gasto total dividido por alunos novos | Compare com o CAC máximo |

A cadeia é: CPM e CTR determinam o CPC, o CPC e a taxa de conversão determinam o custo por conversa, e a venda determina o CAC. Para melhorar, ache o elo mais fraco.

## A rotina semanal de 15 minutos

Escolha um dia fixo (por exemplo, segunda-feira) e siga:

1. **Gasto da semana** e conversas geradas (3 min).
2. **Custo por conversa** de cada anúncio comparado com a meta (4 min).
3. **Vendas** originadas dos anúncios, olhando o seu registro de leads (4 min).
4. **Decisão:** pausar, manter ou escalar (4 min).

Anote tudo em uma planilha de quatro colunas: data, gasto, conversas e vendas. Em um mês você tem uma linha de tendência.

## Regra de corte

Não decida com poucos dados, mas também não deixe dinheiro queimando:

- **Pause** o anúncio que gastou 2 vezes o custo-alvo por conversa sem gerar nenhuma conversa. Com meta de R$ 20, são R$ 40.
- **Pause** o anúncio com CTR muito abaixo dos outros após 1.000 impressões.
- **Mantenha** os que estão entre a meta e 30% acima, e dê mais tempo.
- **Troque** o criativo que caiu depois de 2 a 4 semanas de uso (cansaço).

## Quando e como escalar

Escale quando, por pelo menos 7 dias, o custo por conversa ficou abaixo da meta e você consegue atender mais gente.

- Aumente o orçamento em **20% a 30% a cada 3 a 4 dias**. Aumentos bruscos desestabilizam o aprendizado.
- Duplique o que funciona (um novo conjunto com o mesmo criativo vencedor), em vez de mexer no que já está bom.
- Se o custo por conversa subir 30% ou mais depois do aumento, volte ao orçamento anterior.

Exemplo: R$ 30 por dia, custo por conversa de R$ 14, meta de R$ 20. Vale subir para R$ 36 e depois R$ 45.

## Ligue com o funil e o check-in

O anúncio é o topo do funil: lead, conversa, avaliação, venda. Registre cada etapa e veja onde perde mais gente. Se o custo por conversa está ótimo e quase ninguém fecha, o gargalo é o atendimento. Pelo mesmo motivo, acompanhe a permanência do aluno no check-in semanal: se ele fica mais tempo, o LTV sobe e o seu CAC máximo também.

## Erros comuns

- Mexer na campanha todo dia.
- Escalar porque "foi bem ontem".
- Comemorar custo baixo por conversa sem olhar quantas viraram venda.
- Pausar tudo na primeira semana ruim.

## Como usar esta aula

Marque a rotina de 15 minutos na agenda, crie a planilha de acompanhamento e rode a primeira revisão semanal. Registre no checkpoint a meta de custo por conversa e o resultado da primeira semana. Os valores citados são exemplos, não promessa de resultado.
$md$,
'[{"id":"tp5-1","text":"Marcar a revisão semanal de 15 minutos","hint":"Dia e hora fixos, com um lembrete."},{"id":"tp5-2","text":"Montar a planilha de acompanhamento","hint":"Data, gasto, conversas e vendas, uma linha por semana."},{"id":"tp5-3","text":"Escrever suas regras de corte e de escala","hint":"Quanto gasta sem conversa para pausar, e em que condição aumenta o orçamento."},{"id":"tp5-4","text":"Registrar a meta de custo por conversa e o resultado da semana 1","hint":"Compare o real com a meta da primeira aula."}]'::jsonb,
'Primeira campanha no ar com meta de custo por conversa', true
from public.tracks t
where t.slug = 'trafego-pago'
  and not exists (select 1 from public.lessons x where x.track_id = t.id and x.position = 5);

