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
