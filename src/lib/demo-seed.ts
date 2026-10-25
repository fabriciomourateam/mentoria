import type { Lesson, Material, Track } from './types'

// Espelho da migration 20261025120100_seed_grade.sql, usado só no modo demonstração.

type T = [slug: string, title: string, promise: string, checkpoint: string]
const TRACKS: T[] = [
  ['comece-por-aqui', 'Comece por aqui', 'Virar a chave de personal que vende hora para dono de consultoria.', 'Diagnóstico inicial preenchido'],
  ['posicionamento-oferta', 'Posicionamento e Oferta', 'Clareza de nicho e uma oferta que o aluno entende em 30 segundos.', 'Oferta de 1 página escrita'],
  ['vendas', 'Vendas', 'Fechar com naturalidade, sem insistência. Venda consultiva.', 'Script de venda adaptado ao seu nicho'],
  ['captacao', 'Captação', 'Encher a agenda com leads certos, de forma orgânica.', 'Funil montado e 10 leads registrados'],
  ['entrega-jornada', 'Entrega e Jornada do aluno', 'Uma experiência premium que faz o aluno renovar e indicar.', 'Jornada do aluno desenhada'],
  ['gestao-tempo', 'Gestão e Tempo', 'Crescer sem virar escravo do próprio negócio.', 'Seus 3 processos-chave documentados'],
  ['financas', 'Finanças', 'Saber quanto sobra de verdade e crescer com o caixa sob controle.', 'Sua DRE e pró-labore preenchidos'],
]

const LESSONS: Record<string, [string, string][]> = {
  'comece-por-aqui': [
    ['De treinador a dono de negócio', 'Mudar a identidade: você vende transformação, não hora de academia.'],
    ['O glossário do negócio', 'Os termos que você vai usar daqui pra frente: CAC, LTV, funil, ticket e churn.'],
    ['Como funciona a plataforma e o seu sistema', 'Onde você aprende aqui e onde você opera: seu MyShape e o app do aluno.'],
    ['Como estudar e executar', 'A fórmula pra não acumular aula: aprender, aplicar e marcar o checkpoint.'],
    ['Onde você está hoje', 'Diagnóstico inicial do seu negócio, o ponto de partida da sua evolução.'],
  ],
  'posicionamento-oferta': [
    ['Seu nicho e o aluno ideal', 'Pra quem você fala: o aluno que mais aparece hoje, não o dos sonhos.'],
    ['Sua oferta irresistível em uma página', 'Os 4 blocos: promessa, para quem é, o que inclui, preço e garantia.'],
    ['Precificação: do preço por hora ao pacote', 'Calcular seu preço mínimo e ancorar o valor do acompanhamento.'],
    ['Escada de valor', 'Do produto de entrada ao premium, pra crescer o ticket ao longo do tempo.'],
  ],
  vendas: [
    ['A avaliação que fecha', 'O roteiro da conversa de venda: diagnóstico e proposta no fim.'],
    ['Quebra de objeção', 'Preço, tempo e "vou pensar": respostas prontas e honestas.'],
    ['Fechamento no fim da avaliação', 'Conduzir pro sim sem pressão, com a oferta clara na mão.'],
    ['Follow-up que recupera lead', 'O "não agora" vira venda depois com o acompanhamento certo.'],
  ],
  captacao: [
    ['Conteúdo que atrai o aluno certo', 'Tipos de post, calendário e o que postar pra gerar interesse, não só likes.'],
    ['O funil de captação', 'Do seguidor ao lead: o caminho que transforma audiência em conversa.'],
    ['Social selling: o direct que vira conversa', 'Abordar sem ser chato e levar pro WhatsApp e pra avaliação.'],
    ['Seus primeiros 10 leads', 'Pôr em prática: gerar e registrar os primeiros interessados.'],
  ],
  'entrega-jornada': [
    ['Onboarding do aluno novo', 'As boas-vindas que começam a entrega com o pé direito.'],
    ['Montando o acompanhamento no MyShape', 'Treino e dieta no painel, e o aluno acompanha tudo pelo app.'],
    ['O método de check-in', 'O acompanhamento periódico que mantém o aluno engajado e retido.'],
    ['Experiência premium e renovação', 'Pontos de contato e prova de evolução que fazem o aluno continuar e indicar.'],
  ],
  'gestao-tempo': [
    ['A rotina do dono', 'Produtividade e prioridade pra sobrar tempo no seu dia.'],
    ['Processos e POPs', 'Padronizar o que se repete pra poder delegar depois.'],
    ['Sua primeira contratação', 'Quando e quem contratar, e como integrar essa pessoa.'],
    ['Os números que você acompanha', 'CAC, LTV e churn: o painel mínimo do dono de consultoria.'],
  ],
  financas: [
    ['Faturamento, receita e caixa', 'Parar de confundir dinheiro que entra com dinheiro que sobra.'],
    ['Pró-labore e separação PF e PJ', 'Separar o bolso da empresa do seu bolso, de um jeito simples.'],
    ['Preço certo e ponto de equilíbrio', 'Quanto você precisa vender pra pagar as contas e começar a lucrar.'],
    ['Projeção anual em cenários', 'Planejar o ano em três cenários: conservador, realista e ousado.'],
  ],
}

type CP = { slug: string; pos: number; title: string; items: [string, string, string][] }
const CHECKPOINTS: CP[] = [
  { slug: 'comece-por-aqui', pos: 5, title: 'Diagnóstico inicial preenchido', items: [
    ['d1', 'Seu faturamento médio dos últimos 3 meses', 'Some e divida por três. Vale o número real, não o desejado.'],
    ['d2', 'Quantos alunos você atende hoje', 'Presenciais e online, separados.'],
    ['d3', 'Quantas horas por semana você passa na academia', 'É o número que a gente quer reduzir.'],
    ['d4', 'Sua meta de faturamento para daqui a 6 meses', 'Um número só. Ele vai guiar suas próximas decisões.'],
  ] },
  { slug: 'posicionamento-oferta', pos: 2, title: 'Oferta de 1 página escrita', items: [
    ['o1', 'Promessa central numa frase', 'Quem você ajuda, o resultado e o prazo.'],
    ['o2', 'Para quem é e para quem não é', 'Afasta curioso e atrai quem paga.'],
    ['o3', 'O que está incluso', 'Plano, acompanhamento, app e check-ins.'],
    ['o4', 'Preço e garantia', 'Ancora o valor e tira o risco de cima do aluno.'],
  ] },
  { slug: 'vendas', pos: 1, title: 'Script de venda adaptado ao seu nicho', items: [
    ['v1', 'Abertura: como você começa a conversa', 'Quebra o gelo e explica como a avaliação vai funcionar.'],
    ['v2', 'Diagnóstico: as perguntas que você faz', 'Objetivo, histórico, rotina e o que já tentou.'],
    ['v3', 'Proposta: como você apresenta a oferta', 'Liga a dor do aluno à sua promessa.'],
    ['v4', 'Fechamento: a pergunta final', 'Uma pergunta direta, sem pressão.'],
  ] },
  { slug: 'captacao', pos: 4, title: 'Funil montado e 10 leads registrados', items: [
    ['c1', 'Definiu o caminho do seguidor até a conversa', 'Post, direct, WhatsApp, avaliação.'],
    ['c2', 'Criou uma planilha ou lista de leads', 'Nome, origem, data e próximo passo.'],
    ['c3', 'Registrou 10 interessados', 'Conta qualquer pessoa que pediu informação.'],
  ] },
  { slug: 'entrega-jornada', pos: 4, title: 'Jornada do aluno desenhada', items: [
    ['j1', 'Boas-vindas do primeiro dia', 'A mensagem e o que o aluno recebe ao fechar.'],
    ['j2', 'Frequência de check-in', 'Semanal ou quinzenal, e o que você pergunta.'],
    ['j3', 'Pontos de contato ao longo do plano', 'Quando você aparece sem o aluno pedir.'],
    ['j4', 'Prova de evolução antes da renovação', 'Antes e depois, números e fotos.'],
  ] },
  { slug: 'gestao-tempo', pos: 2, title: 'Seus 3 processos-chave documentados', items: [
    ['g1', 'Processo de entrada do aluno novo', 'Do pagamento ao primeiro plano entregue.'],
    ['g2', 'Processo de check-in', 'Quem faz, quando e com qual mensagem.'],
    ['g3', 'Processo de renovação', 'Quando começa e o que você envia.'],
  ] },
  { slug: 'financas', pos: 2, title: 'Sua DRE e pró-labore preenchidos', items: [
    ['f1', 'Abriu uma conta separada para o negócio', 'Nada de misturar com a conta pessoal.'],
    ['f2', 'Definiu seu pró-labore mensal', 'Use a calculadora nos materiais.'],
    ['f3', 'Preencheu a DRE do último mês', 'Receita, custos e o que sobrou.'],
  ] },
]

const OFERTA_MD = `## Por que a maioria trava aqui

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
`

const MATERIALS: [string, string, string, Material['kind']][] = [
  ['posicionamento-oferta', 'Modelo de Oferta (1 página)', 'Documento editável com os 4 blocos.', 'documento'],
  ['posicionamento-oferta', 'Planilha de Precificação', 'Calcula seu preço mínimo.', 'planilha'],
  ['posicionamento-oferta', '7 passos para definir seu público', 'Guia rápido de nicho.', 'guia'],
  ['vendas', 'Script de vendas', 'Roteiro da avaliação que fecha.', 'documento'],
  ['vendas', 'Quebra de objeção', 'Respostas para preço, tempo e "vou pensar".', 'guia'],
  ['vendas', 'Apresentação que converte', 'Modelo de proposta.', 'documento'],
  ['vendas', 'Follow-up inteligente', 'Mensagens para recuperar leads.', 'guia'],
  ['captacao', 'Calendário de postagens', 'Planejamento mensal de conteúdo.', 'planilha'],
  ['captacao', 'Funil Ampulheta', 'Aquisição e retenção num desenho só.', 'guia'],
  ['captacao', 'Formulário de aplicação de lead', 'Qualifica antes da avaliação.', 'documento'],
  ['captacao', 'Banco de referências de conteúdo', 'Ideias de posts por tipo.', 'guia'],
  ['entrega-jornada', 'Boas-vindas ao aluno', 'Mensagens e checklist do primeiro dia.', 'checklist'],
  ['entrega-jornada', 'Health Score', 'Mede o risco de cancelamento.', 'planilha'],
  ['entrega-jornada', 'Formulário de saída', 'Entende por que o aluno saiu.', 'documento'],
  ['entrega-jornada', 'Dossiê de resultados', 'Antes e depois para a renovação.', 'documento'],
  ['gestao-tempo', 'Modelo de POP', 'Documenta um processo em 1 página.', 'documento'],
  ['gestao-tempo', 'OKR', 'Metas trimestrais com resultados-chave.', 'planilha'],
  ['gestao-tempo', 'Reunião 1:1', 'Pauta para conversar com a equipe.', 'guia'],
  ['financas', 'Calculadora de Pró-labore', 'Quanto você pode retirar por mês.', 'planilha'],
  ['financas', 'DRE do negócio', 'Receita, custos e resultado.', 'planilha'],
  ['financas', 'Checklist PF e PJ', 'Separa as finanças em 15 minutos.', 'checklist'],
  ['financas', 'Projeção anual em 3 cenários', 'Conservador, realista e ousado.', 'planilha'],
]

export function buildDemoContent(): { tracks: Track[]; lessons: Lesson[]; materials: Material[] } {
  const tracks: Track[] = TRACKS.map(([slug, title, promise, checkpoint], i) => ({
    id: `t-${slug}`,
    slug,
    position: i,
    title,
    promise,
    checkpoint,
    is_entry: i === 0,
    published: true,
  }))
  const lessons: Lesson[] = []
  for (const t of tracks) {
    LESSONS[t.slug].forEach(([title, objective], i) => {
      const cp = CHECKPOINTS.find((c) => c.slug === t.slug && c.pos === i + 1)
      lessons.push({
        id: `l-${t.slug}-${i + 1}`,
        track_id: t.id,
        position: i + 1,
        title,
        objective,
        body_md: t.slug === 'posicionamento-oferta' && i === 1 ? OFERTA_MD : '',
        checklist: cp ? cp.items.map(([id, text, hint]) => ({ id, text, hint })) : [],
        checkpoint_title: cp?.title ?? null,
        published: true,
      })
    })
  }
  const pos: Record<string, number> = {}
  const materials: Material[] = MATERIALS.map(([slug, title, description, kind], i) => {
    pos[slug] = (pos[slug] ?? 0) + 1
    return {
      id: `m-${i}`,
      track_id: `t-${slug}`,
      lesson_id: null,
      title,
      description,
      kind,
      storage_path: null,
      external_url: null,
      position: pos[slug],
    }
  })
  return { tracks, lessons, materials }
}
