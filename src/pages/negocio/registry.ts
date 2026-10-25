// Catálogo das ferramentas do "Meu Negócio". A ordem aqui é a ordem na tela.
import { formProgress } from './forms'
import type { ToolDef, ToolGroup } from './types'
import { schema as alunoIdeal } from './fichas/aluno-ideal'
import { schema as calendario } from './fichas/calendario'
import { schema as diagnostico } from './fichas/diagnostico'
import { schema as funil } from './fichas/funil'
import { schema as objecoes } from './fichas/objecoes'
import { schema as oferta } from './fichas/oferta'
import { schema as okr } from './fichas/okr'
import { schema as pfPj } from './fichas/pf-pj'
import { schema as processos } from './fichas/processos'
import { schema as script } from './fichas/script'
import Dre, { progress as dreProgress } from './financas/Dre'
import Equilibrio, { progress as equilibrioProgress } from './financas/Equilibrio'
import Precificacao, { progress as precificacaoProgress } from './financas/Precificacao'
import ProLabore, { progress as proLaboreProgress } from './financas/ProLabore'
import Projecao, { progress as projecaoProgress } from './financas/Projecao'
import Leads, { progress as leadsProgress } from './leads/Leads'
import { md as gBoasVindas } from './guias/boas-vindas'
import { md as gFollowUp } from './guias/follow-up'
import { md as gIdeias } from './guias/ideias-conteudo'
import { md as gObjecoes } from './guias/objecoes-respostas'
import { md as gReuniao } from './guias/reuniao-1-1'

export const GROUPS: { id: ToolGroup; title: string; desc: string }[] = [
  { id: 'plano', title: 'Seu plano de negócio', desc: 'Oferta, público e venda, preenchidos uma vez e revisados sempre que mudar.' },
  { id: 'financas', title: 'Minhas finanças', desc: 'Os números conversam entre si: o pró-labore alimenta o preço, que alimenta a projeção.' },
  { id: 'rotina', title: 'Rotina do negócio', desc: 'O que você usa toda semana para vender, postar e organizar.' },
  { id: 'consulta', title: 'Consulta rápida', desc: 'Mensagens e roteiros prontos para copiar e usar.' },
]

const form = (d: Omit<ToolDef, 'type' | 'progress'> & { schema: NonNullable<ToolDef['schema']> }): ToolDef => ({
  ...d,
  type: 'form',
  progress: (get) => formProgress(d.schema, get(d.key)),
})

export const TOOLS: ToolDef[] = [
  // plano
  form({ key: 'diagnostico', title: 'Meu ponto de partida', desc: 'Os números de hoje e a meta de 6 meses.', group: 'plano', icon: 'target', lesson: { slug: 'comece-por-aqui', position: 5 }, schema: diagnostico }),
  form({ key: 'aluno-ideal', title: 'Meu aluno ideal', desc: 'Quem você atende melhor, a dor e onde ele está.', group: 'plano', icon: 'users', lesson: { slug: 'posicionamento-oferta', position: 1 }, schema: alunoIdeal }),
  form({ key: 'oferta', title: 'Minha oferta', desc: 'Os 4 blocos da oferta de uma página.', group: 'plano', icon: 'star', lesson: { slug: 'posicionamento-oferta', position: 2 }, schema: oferta }),
  form({ key: 'script', title: 'Meu script de vendas', desc: 'Abertura, diagnóstico, proposta e fechamento.', group: 'plano', icon: 'chat', lesson: { slug: 'vendas', position: 1 }, schema: script }),
  form({ key: 'objecoes', title: 'Meu banco de objeções', desc: 'As objeções que você ouve e como responde.', group: 'plano', icon: 'guide', lesson: { slug: 'vendas', position: 2 }, schema: objecoes }),
  form({ key: 'funil', title: 'Meu funil', desc: 'O caminho do seguidor até a venda, com os números de cada etapa.', group: 'plano', icon: 'funnel', lesson: { slug: 'captacao', position: 2 }, schema: funil }),
  // finanças
  { key: 'prolabore', title: 'Pró-labore', desc: 'Quanto você precisa tirar e se a empresa consegue pagar.', group: 'financas', icon: 'coin', lesson: { slug: 'financas', position: 2 }, type: 'custom', Component: ProLabore, progress: proLaboreProgress },
  { key: 'precificacao', title: 'Precificação', desc: 'Seu preço mínimo e os planos que fazem sentido.', group: 'financas', icon: 'sheet', lesson: { slug: 'posicionamento-oferta', position: 3 }, type: 'custom', Component: Precificacao, progress: precificacaoProgress },
  { key: 'dre', title: 'DRE do mês', desc: 'Receita, custos e o que sobrou de verdade.', group: 'financas', icon: 'chart', lesson: { slug: 'financas', position: 1 }, type: 'custom', Component: Dre, progress: dreProgress },
  { key: 'equilibrio', title: 'Ponto de equilíbrio', desc: 'Quantos alunos você precisa para pagar tudo.', group: 'financas', icon: 'target', lesson: { slug: 'financas', position: 3 }, type: 'custom', Component: Equilibrio, progress: equilibrioProgress },
  { key: 'projecao', title: 'Projeção do ano', desc: 'Três cenários e o caminho da meta até o caixa.', group: 'financas', icon: 'layers', lesson: { slug: 'financas', position: 4 }, type: 'custom', Component: Projecao, progress: projecaoProgress },
  form({ key: 'pf-pj', title: 'Separação PF e PJ', desc: 'O checklist de 15 minutos para separar os bolsos.', group: 'financas', icon: 'list', lesson: { slug: 'financas', position: 2 }, schema: pfPj }),
  // rotina
  { key: 'leads', title: 'Meus leads', desc: 'Quem pediu informação, em que etapa está e o próximo passo.', group: 'rotina', icon: 'users', lesson: { slug: 'captacao', position: 4 }, type: 'custom', Component: Leads, progress: leadsProgress },
  form({ key: 'calendario', title: 'Calendário de conteúdo', desc: 'O que postar no mês, com objetivo em cada post.', group: 'rotina', icon: 'book', lesson: { slug: 'captacao', position: 1 }, schema: calendario }),
  form({ key: 'okr', title: 'Metas do trimestre', desc: 'Um objetivo e três resultados-chave para acompanhar.', group: 'rotina', icon: 'chart', lesson: { slug: 'gestao-tempo', position: 4 }, schema: okr }),
  form({ key: 'processos', title: 'Meus processos', desc: 'Entrada do aluno, check-in e renovação no papel.', group: 'rotina', icon: 'route', lesson: { slug: 'gestao-tempo', position: 2 }, schema: processos }),
  // consulta
  { key: 'g-follow-up', title: 'Mensagens de follow-up', desc: 'A cadência e as mensagens para cada toque.', group: 'consulta', icon: 'chat', lesson: { slug: 'vendas', position: 4 }, type: 'guide', guide: gFollowUp },
  { key: 'g-objecoes', title: 'Respostas de objeção', desc: 'Preço, tempo, vou pensar e as outras.', group: 'consulta', icon: 'guide', lesson: { slug: 'vendas', position: 2 }, type: 'guide', guide: gObjecoes },
  { key: 'g-ideias', title: 'Ideias de conteúdo', desc: 'Ganchos e ideias de post por tipo.', group: 'consulta', icon: 'sparkle', lesson: { slug: 'captacao', position: 1 }, type: 'guide', guide: gIdeias },
  { key: 'g-boas-vindas', title: 'Boas-vindas ao aluno', desc: 'O checklist e as mensagens do primeiro dia.', group: 'consulta', icon: 'star', lesson: { slug: 'entrega-jornada', position: 1 }, type: 'guide', guide: gBoasVindas },
  { key: 'g-reuniao', title: 'Reunião 1:1', desc: 'O roteiro da conversa semanal com sua equipe.', group: 'consulta', icon: 'users', lesson: { slug: 'gestao-tempo', position: 3 }, type: 'guide', guide: gReuniao },
]

/** Some da tela enquanto a ferramenta ainda não tem conteúdo (fichas vazias, guias vazios). */
export const isReady = (t: ToolDef) =>
  t.type === 'custom' ? true : t.type === 'guide' ? !!t.guide?.trim() : !!t.schema?.sections.length

export const toolByKey = (key: string) => TOOLS.find((t) => t.key === key)
