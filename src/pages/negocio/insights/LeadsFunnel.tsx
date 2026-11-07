import { BarChart, HBars } from '../../../components/charts'
import { addDays, dayBRT, fmtDay, weekStart } from '../../../lib/dates'
import type { Lead, LeadStage } from '../../../lib/types'
import { brl, pct } from '../../../lib/workspace'
import { Panel } from './Meter'
import './insights.css'

const FLOW: { id: LeadStage; label: string }[] = [
  { id: 'novo', label: 'Novo' },
  { id: 'conversa', label: 'Conversa' },
  { id: 'avaliacao', label: 'Avaliação' },
  { id: 'proposta', label: 'Proposta' },
  { id: 'fechou', label: 'Fechou' },
]

/** Painel "Seu funil": etapas, valores, origens e leads novos por semana. */
export function LeadsFunnel({ leads }: { leads: Lead[] }) {
  const total = leads.length
  if (!total) return null
  const idx = (l: Lead) => FLOW.findIndex((s) => s.id === l.stage)
  // Quantos leads chegaram pelo menos até cada etapa (os perdidos ficam de fora do funil).
  const reached = FLOW.map((_, i) => leads.filter((l) => idx(l) >= i).length)
  const perdidos = leads.filter((l) => l.stage === 'perdido').length

  const rows = [
    ...FLOW.map((s, i) => ({
      label: s.label,
      value: reached[i],
      note: i === 0 ? undefined : reached[i - 1] > 0 ? `${pct(reached[i] / reached[i - 1], 0)} da etapa anterior` : undefined,
      tone: s.id === 'fechou' ? ('ok' as const) : ('accent' as const),
    })),
    { label: 'Perdido', value: perdidos, note: `${pct(perdidos / total, 0)} dos leads`, tone: 'muted' as const },
  ]

  const open = leads.filter((l) => l.stage !== 'fechou' && l.stage !== 'perdido')
  const won = leads.filter((l) => l.stage === 'fechou')
  const valorAberto = open.reduce((s, l) => s + (l.value ?? 0), 0)
  const valorFechado = won.reduce((s, l) => s + (l.value ?? 0), 0)
  const wonValued = won.filter((l) => (l.value ?? 0) > 0)
  const ticket = wonValued.length ? valorFechado / wonValued.length : 0
  const saiuDeNovo = leads.filter((l) => l.stage !== 'novo').length
  const conv = saiuDeNovo > 0 ? won.length / saiuDeNovo : null

  const origins = new Map<string, { n: number; won: number }>()
  for (const l of leads) {
    const k = l.origin?.trim() || 'Sem origem'
    const cur = origins.get(k) ?? { n: 0, won: 0 }
    cur.n += 1
    if (l.stage === 'fechou') cur.won += 1
    origins.set(k, cur)
  }
  const origemRows = [...origins.entries()]
    .sort((a, b) => b[1].n - a[1].n)
    .map(([label, v]) => ({
      label,
      value: v.n,
      note: `${pct(v.won / v.n, 0)} fechados`,
      tone: v.won > 0 ? ('ok' as const) : ('accent' as const),
    }))

  // Leads criados por semana (últimas 8, semanas começando na segunda, em São Paulo).
  const thisWeek = weekStart()
  const weeks = Array.from({ length: 8 }, (_, i) => addDays(thisWeek, (i - 7) * 7))
  const perWeek = new Map(weeks.map((w) => [w, 0]))
  for (const l of leads) {
    const w = weekStart(new Date(l.created_at))
    if (perWeek.has(w)) perWeek.set(w, (perWeek.get(w) ?? 0) + 1)
  }
  const weekData = weeks.map((w) => ({ label: fmtDay(w), value: perWeek.get(w) ?? 0 }))
  const anyWeek = weekData.some((d) => d.value > 0)

  return (
    <Panel title="Seu funil" intro="Quantos leads chegaram até cada etapa e quanto cada uma converte. Quem se perdeu fica fora do funil.">
      <div className="kpis">
        <div className="kpi">
          <div className="k">Valor em aberto</div>
          <div className="v">{brl(valorAberto)}</div>
          <div className="d">{open.length} {open.length === 1 ? 'lead' : 'leads'} em andamento</div>
        </div>
        <div className="kpi">
          <div className="k">Valor fechado</div>
          <div className="v">{brl(valorFechado)}</div>
          <div className="d">{won.length} {won.length === 1 ? 'fechado' : 'fechados'}</div>
        </div>
        <div className="kpi">
          <div className="k">Ticket médio</div>
          <div className="v">{ticket > 0 ? brl(ticket) : '-'}</div>
          <div className="d">{ticket > 0 ? 'dos fechados com valor' : 'informe o valor ao fechar'}</div>
        </div>
        <div className="kpi hl">
          <div className="k">Conversão geral</div>
          <div className="v">{conv === null ? '-' : pct(conv, 0)}</div>
          <div className="d">fechados entre quem saiu de Novo</div>
        </div>
      </div>
      <HBars rows={rows} />
      <div className="ins-cols">
        <div className="ins-row">
          <div className="ins-sub">Por origem</div>
          <HBars rows={origemRows} />
        </div>
        <div className="ins-row">
          <div className="ins-sub">Leads novos por semana</div>
          {anyWeek ? (
            <BarChart data={weekData} height={120} format={(n) => String(Math.round(n))} ariaLabel="Leads criados por semana" />
          ) : (
            <p className="ins-note">Nenhum lead novo nas últimas 8 semanas (hoje é {fmtDay(dayBRT())}).</p>
          )}
        </div>
      </div>
    </Panel>
  )
}
