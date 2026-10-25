import { num } from '../../../lib/workspace'

// Cálculos puros das cinco ferramentas financeiras e a leitura cruzada entre elas:
// o pró-labore alimenta a precificação, que alimenta o equilíbrio, a DRE e a projeção.

export type Data = Record<string, unknown>
export type Get = (key: string) => Data

/** Campo preenchido (texto não vazio ou número). "0" conta como preenchido. */
export const has = (v: unknown): boolean => (typeof v === 'string' ? v.trim() !== '' : typeof v === 'number')

/** Soma uma coluna de uma lista de linhas (ex.: custos com item/valor). */
export function sumRows(rows: unknown, col = 'valor'): number {
  if (!Array.isArray(rows)) return 0
  return rows.reduce((s: number, r) => s + (r && typeof r === 'object' ? num((r as Record<string, unknown>)[col]) : 0), 0)
}

/** Número em pt-BR sem símbolo, para usar como placeholder ("1.500", "12,5"). */
export const fmt = (n: number, digits = 2) => n.toLocaleString('pt-BR', { maximumFractionDigits: digits })

/** Mês atual (AAAA-MM) no fuso de São Paulo. */
export const nowMonth = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }).slice(0, 7)

const MESES_LONGOS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
export const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** "2026-01" vira "janeiro de 2026". */
export function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  if (!y || !m || m < 1 || m > 12) return ym
  return `${MESES_LONGOS[m - 1]} de ${y}`
}

/** Lista de meses (AAAA-MM) do atual para trás. */
export function monthsBack(count: number, from = nowMonth()): string[] {
  const [y, m] = from.split('-').map(Number)
  const out: string[] = []
  for (let i = 0; i < count; i++) {
    const t = y * 12 + (m - 1) - i
    out.push(`${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`)
  }
  return out
}

// ---------- Pró-labore ----------

export function proLaboreCalc(d: Data) {
  const vida = sumRows(d.custo_vida)
  const margem = num(d.margem) / 100
  const necessario = vida * (1 + margem)

  const receita = num(d.receita)
  const imp = num(d.imposto) / 100
  const taxa = num(d.taxas) / 100
  const fixos = sumRows(d.fixos)
  const variaveis = num(d.variaveis)
  const impostoR = receita * imp
  const taxasR = receita * taxa
  const disponivel = receita - impostoR - taxasR - fixos - variaveis
  const sobra = disponivel - necessario
  const sobraPct = receita > 0 ? sobra / receita : 0
  const varPct = receita > 0 ? variaveis / receita : 0
  const denom = 1 - imp - taxa - varPct
  const receitaNec = necessario > 0 && denom > 0 ? (fixos + necessario) / denom : null

  type Veredito = 'ok' | 'warn' | 'bad'
  let veredito: { tone: Veredito; label: string } | null = null
  if (receita > 0 && necessario > 0) {
    if (sobra < 0) veredito = { tone: 'bad', label: 'Ainda não consegue' }
    else if (sobra < receita * 0.1) veredito = { tone: 'warn', label: 'Paga com aperto' }
    else veredito = { tone: 'ok', label: 'Consegue pagar' }
  }
  return { vida, margem, necessario, receita, impostoR, taxasR, fixos, variaveis, disponivel, sobra, sobraPct, receitaNec, veredito }
}

/** Pró-labore necessário calculado na ferramenta Pró-labore (0 se ainda não preenchida). */
export const proLaboreValue = (get: Get): number => proLaboreCalc(get('prolabore')).necessario

// ---------- Precificação ----------

export function precificacaoCalc(d: Data, get: Get) {
  const pl = proLaboreCalc(get('prolabore'))
  const fixos = sumRows(d.custos)
  const plSug = pl.necessario
  const plOwn = has(d.prolabore)
  const prolabore = plOwn ? num(d.prolabore) : plSug
  const capacidade = num(d.capacidade)
  const taxaSug = num(get('prolabore').taxas)
  const impSug = num(get('prolabore').imposto)
  const taxa = (has(d.taxa) ? num(d.taxa) : taxaSug) / 100
  const imposto = (has(d.imposto) ? num(d.imposto) : impSug) / 100
  const piso = capacidade > 0 ? (fixos + prolabore) / capacidade : 0
  const denom = 1 - taxa - imposto
  const minimo = piso > 0 && denom > 0 ? piso / denom : 0
  const sugestao = minimo > 0 ? Math.ceil((minimo * 1.2) / 10) * 10 : 0
  const mensal = has(d.preco_mensal) ? num(d.preco_mensal) : sugestao
  const descTri = has(d.desc_tri) ? num(d.desc_tri) : 10
  const descSem = has(d.desc_sem) ? num(d.desc_sem) : 15
  const planos = [
    { nome: 'Mensal', meses: 1, desc: 0 },
    { nome: 'Trimestral', meses: 3, desc: descTri },
    { nome: 'Semestral', meses: 6, desc: descSem },
  ].map((p) => {
    const porMes = mensal * (1 - p.desc / 100)
    return { ...p, porMes, total: porMes * p.meses, ok: minimo > 0 && porMes + 0.005 >= minimo }
  })
  return { fixos, plSug, plOwn, prolabore, capacidade, taxa, imposto, taxaSug, impSug, piso, minimo, sugestao, mensal, descTri, descSem, planos }
}

/** Preço mensal da Precificação (o digitado ou o sugerido); 0 se ainda não há. */
export const precoMensal = (get: Get): number => precificacaoCalc(get('precificacao'), get).mensal

// ---------- DRE ----------

export const DRE_FIXOS = ['f_prolabore', 'software', 'contador', 'aluguel', 'marketing', 'f_outros']

export function dreCalc(m: Data, plSug: number, impSug: number) {
  const receita = num(m.receita)
  const impPct = (has(m.imposto) ? num(m.imposto) : impSug) / 100
  const impostoR = receita * impPct
  const liquida = receita - impostoR
  const taxas = num(m.taxas)
  const variaveis = num(m.comissoes) + num(m.trafego) + num(m.var_outros)
  const mc = liquida - taxas - variaveis
  const prolabore = has(m.f_prolabore) ? num(m.f_prolabore) : plSug
  const fixosSem = num(m.software) + num(m.contador) + num(m.aluguel) + num(m.marketing) + num(m.f_outros)
  const fixos = fixosSem + prolabore
  const resultado = mc - fixos
  return {
    receita,
    impostoR,
    liquida,
    taxas,
    variaveis,
    mc,
    mcPct: receita > 0 ? mc / receita : 0,
    prolabore,
    fixosSem,
    fixos,
    resultado,
    resultadoPct: receita > 0 ? resultado / receita : 0,
  }
}

export function dreMeses(d: Data): Record<string, Data> {
  const m = d.meses
  return m && typeof m === 'object' && !Array.isArray(m) ? (m as Record<string, Data>) : {}
}

/** Último mês da DRE com receita preenchida (AAAA-MM) e seus custos fixos totais. */
export function dreUltimoMes(get: Get): { mes: string; fixos: number } | null {
  const meses = dreMeses(get('dre'))
  const plSug = proLaboreValue(get)
  const impSug = num(get('prolabore').imposto)
  const keys = Object.keys(meses)
    .filter((k) => num(meses[k].receita) > 0)
    .sort()
  const mes = keys[keys.length - 1]
  if (!mes) return null
  return { mes, fixos: dreCalc(meses[mes], plSug, impSug).fixos }
}

// ---------- Ponto de equilíbrio ----------

export function equilibrioCalc(d: Data, get: Get) {
  const p = precificacaoCalc(get('precificacao'), get)
  const ult = dreUltimoMes(get)
  let fixosSug = 0
  let fixosSrc: 'precificacao' | 'dre' | null = null
  if (p.fixos + p.prolabore > 0) {
    fixosSug = p.fixos + p.prolabore
    fixosSrc = 'precificacao'
  } else if (ult && ult.fixos > 0) {
    fixosSug = ult.fixos
    fixosSrc = 'dre'
  }
  const precoSug = p.mensal
  const varPctSug = (p.taxa + p.imposto) * 100
  const fixos = has(d.fixos) ? num(d.fixos) : fixosSug
  const preco = has(d.preco) ? num(d.preco) : precoSug
  const varRs = num(d.var_rs)
  const varPct = (has(d.var_pct) ? num(d.var_pct) : varPctSug) / 100

  const cenario = (desc: number) => {
    const price = preco * (1 - desc)
    const margem = price - varRs - price * varPct
    const pe = margem > 0 && fixos > 0 ? Math.ceil(fixos / margem - 1e-9) : null
    return { desc, price, margem, margemPct: price > 0 ? margem / price : 0, pe }
  }
  const base = cenario(0)
  const sims = [cenario(0), cenario(0.1), cenario(0.2)]
  return { fixos, fixosSug, fixosSrc, preco, precoSug, varRs, varPct, varPctSug, base, sims }
}

// ---------- Projeção ----------

export const SAZ_PADRAO = [1.2, 1.1, 1.1, 1.0, 0.95, 0.9, 0.85, 0.95, 1.05, 1.1, 1.1, 0.9]
export const CENARIOS = [
  { id: 'cons', nome: 'Conservador' },
  { id: 'real', nome: 'Realista' },
  { id: 'ous', nome: 'Ousado' },
] as const

export function sazonalidade(d: Data): number[] {
  const s = d.saz && typeof d.saz === 'object' ? (d.saz as Record<string, unknown>) : {}
  return MESES_CURTOS.map((k, i) => (has(s[k]) ? num(s[k]) : SAZ_PADRAO[i]))
}

export function projecaoCalc(d: Data, get: Get) {
  const ticketSug = precoMensal(get)
  const ticket = has(d.ticket) ? num(d.ticket) : ticketSug
  const alunosHoje = num(d.alunos)
  const saz = sazonalidade(d)
  const [y, m] = nowMonth().split('-').map(Number)
  const start = m - 1

  const cenarios = CENARIOS.map((c) => {
    const novas = num(d[`novas_${c.id}`])
    const churn = num(d[`churn_${c.id}`]) / 100
    let alunos = alunosHoje
    const meses = Array.from({ length: 12 }, (_, i) => {
      const idx = (start + i) % 12
      alunos = Math.max(0, alunos + novas * saz[idx] - alunos * churn)
      const ano = y + Math.floor((start + i) / 12)
      return { idx, ano, alunos, fat: alunos * ticket }
    })
    const tris = [0, 1, 2, 3].map((q) => {
      const slice = meses.slice(q * 3, q * 3 + 3)
      return { alunos: slice[2].alunos, fat: slice.reduce((s, x) => s + x.fat, 0) }
    })
    return { ...c, novas, churn, meses, tris, total: meses.reduce((s, x) => s + x.fat, 0), alunosFim: meses[11].alunos }
  })

  const meta = num(d.meta)
  const ticketMeta = has(d.ticket_meta) ? num(d.ticket_meta) : ticket
  const convVenda = num(d.conv_venda) / 100
  const convLead = num(d.conv_lead) / 100
  const prazo = has(d.prazo) ? Math.max(1, num(d.prazo)) : 6
  const churnReal = num(d.churn_real) / 100
  const alunosNec = meta > 0 && ticketMeta > 0 ? Math.ceil(meta / ticketMeta - 1e-9) : 0
  const reposicao = alunosNec * churnReal
  const crescimento = Math.max(0, alunosNec - alunosHoje) / prazo
  const vendas = alunosNec > 0 ? Math.ceil(reposicao + crescimento - 1e-9) : 0
  const avaliacoes = vendas > 0 && convVenda > 0 ? Math.ceil(vendas / convVenda - 1e-9) : 0
  const leads = avaliacoes > 0 && convLead > 0 ? Math.ceil(avaliacoes / convLead - 1e-9) : 0
  const leadsSemana = leads > 0 ? Math.ceil(leads / 4) : 0
  const avalSemana = avaliacoes > 0 ? Math.ceil(avaliacoes / 4) : 0

  return {
    ticketSug,
    ticket,
    alunosHoje,
    saz,
    start,
    ano: y,
    cenarios,
    meta: { meta, ticketMeta, convVenda, convLead, prazo, alunosNec, reposicao, vendas, avaliacoes, leads, leadsSemana, avalSemana },
  }
}
