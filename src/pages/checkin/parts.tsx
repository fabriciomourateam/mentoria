import { BarChart, Delta, LineChart } from '../../components/charts'
import { fmtDay, weekLabel } from '../../lib/dates'
import type { WeeklyCheckin } from '../../lib/types'
import { brl, pct } from '../../lib/workspace'

export const ratio = (a: number, b: number): number | null => (b > 0 ? a / b : null)
export const fmtPct = (r: number | null) => (r === null ? '-' : pct(r, 0))

/** Semana imediatamente anterior preenchida (rows em ordem crescente). */
export function prevOf(rows: WeeklyCheckin[], week: string): WeeklyCheckin | undefined {
  return [...rows].reverse().find((r) => r.week_start < week)
}

function Tile({ k, v, now, before }: { k: string; v: string; now?: number | null; before?: number | null }) {
  return (
    <div className="kpi">
      <div className="k">{k}</div>
      <div className="v">{v}</div>
      <div className="d">
        {now != null && before != null && before !== 0 ? (
          <>
            <Delta now={now} before={before} /> vs semana anterior
          </>
        ) : (
          <>&nbsp;</>
        )}
      </div>
    </div>
  )
}

/** 4 indicadores da semana, com variação contra a semana anterior preenchida. */
export function CheckinTiles({ cur, prev }: { cur: WeeklyCheckin; prev?: WeeklyCheckin }) {
  const l2c = ratio(cur.conversas, cur.leads)
  const c2v = ratio(cur.vendas, cur.conversas)
  return (
    <div className="kpis ck-tiles">
      <Tile k="Lead → conversa" v={fmtPct(l2c)} now={l2c} before={prev ? ratio(prev.conversas, prev.leads) : null} />
      <Tile k="Conversa → venda" v={fmtPct(c2v)} now={c2v} before={prev ? ratio(prev.vendas, prev.conversas) : null} />
      <Tile k="Alunos ativos" v={String(cur.alunos_ativos)} now={cur.alunos_ativos} before={prev?.alunos_ativos} />
      <Tile
        k="Faturamento"
        v={cur.faturamento === null ? '-' : brl(cur.faturamento)}
        now={cur.faturamento}
        before={prev?.faturamento}
      />
    </div>
  )
}

function trend(name: string, vals: number[], unit = ''): string | null {
  if (vals.length < 2) return null
  const a = vals[0]
  const b = vals[vals.length - 1]
  const f = (n: number) => `${n.toLocaleString('pt-BR')}${unit}`
  if (a === b) return `${name}: estável em ${f(b)} nas últimas ${vals.length} semanas`
  return `${name}: ${f(a)} → ${f(b)} nas últimas ${vals.length} semanas`
}

/** Gráficos de evolução (últimas 12 semanas preenchidas). */
export function CheckinCharts({ rows }: { rows: WeeklyCheckin[] }) {
  const last = rows.slice(-12)
  const labels = last.map((r) => fmtDay(r.week_start))
  const fat = last.filter((r) => r.faturamento !== null)
  const blocks: { title: string; chart: React.ReactNode; cap: string | null }[] = [
    {
      title: 'Vendas por semana',
      chart: <BarChart data={last.map((r, i) => ({ label: labels[i], value: r.vendas }))} height={130} ariaLabel="Vendas por semana" />,
      cap: trend('Vendas', last.map((r) => r.vendas)),
    },
    {
      title: 'Leads e conversas',
      chart: (
        <LineChart
          labels={labels}
          height={140}
          ariaLabel="Leads e conversas por semana"
          series={[
            { name: 'Leads', values: last.map((r) => r.leads), tone: 'accent' },
            { name: 'Conversas', values: last.map((r) => r.conversas), tone: 'ink', dashed: true },
          ]}
        />
      ),
      cap: trend('Leads', last.map((r) => r.leads)),
    },
    {
      title: 'Alunos ativos',
      chart: (
        <LineChart
          labels={labels}
          height={130}
          ariaLabel="Alunos ativos por semana"
          series={[{ name: 'Alunos ativos', values: last.map((r) => r.alunos_ativos), tone: 'accent' }]}
        />
      ),
      cap: trend('Alunos ativos', last.map((r) => r.alunos_ativos)),
    },
  ]
  if (fat.length)
    blocks.push({
      title: 'Faturamento por semana',
      chart: (
        <BarChart
          data={last.map((r, i) => ({ label: labels[i], value: r.faturamento }))}
          height={130}
          format={brl}
          ariaLabel="Faturamento por semana"
        />
      ),
      cap: trend('Faturamento', fat.map((r) => r.faturamento ?? 0).map((n) => Math.round(n))),
    })
  return (
    <div className="ck-charts">
      {blocks.map((b) => (
        <div key={b.title} className="ck-chart">
          <h3>{b.title}</h3>
          {b.chart}
          {b.cap && <p className="ck-cap">{b.cap}</p>}
        </div>
      ))}
    </div>
  )
}

/** Histórico (mais novo primeiro). */
export function CheckinList({ rows }: { rows: WeeklyCheckin[] }) {
  return (
    <ul className="ck-list">
      {[...rows].reverse().map((r) => (
        <li key={r.id}>
          <div className="ck-lh">
            <b>{weekLabel(r.week_start)}</b>
            {r.faturamento !== null && <span className="pill ok">{brl(r.faturamento)}</span>}
          </div>
          <div className="ck-nums">
            <span><b>{r.leads}</b> leads</span>
            <span><b>{r.conversas}</b> conversas</span>
            <span><b>{r.vendas}</b> vendas</span>
            <span><b>{r.alunos_ativos}</b> ativos</span>
          </div>
          {r.nota && <p className="ck-note">{r.nota}</p>}
        </li>
      ))}
    </ul>
  )
}
