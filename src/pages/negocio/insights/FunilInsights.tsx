import { HBars } from '../../../components/charts'
import { num, pct, useEntry } from '../../../lib/workspace'
import { Panel } from './Meter'

type Row = Record<string, string>

const PAIRS = [
  { from: 'Atenção', to: 'Conversa', taxa: 'taxa_conversa', label: 'Atenção para conversa' },
  { from: 'Conversa', to: 'Avaliação', taxa: 'taxa_avaliacao', label: 'Conversa para avaliação' },
  { from: 'Avaliação', to: 'Venda', taxa: 'taxa_venda', label: 'Avaliação para venda' },
] as const

/** Conversão real entre as etapas (a partir dos números da semana) vs as taxas digitadas. */
export function FunilInsights() {
  const { data } = useEntry('funil')
  const etapas = (Array.isArray(data.etapas) ? (data.etapas as Row[]) : []).filter((r) => (r.etapa ?? '').trim() && num(r.numero) > 0)
  if (etapas.length < 2) return null

  const rows = etapas.map((r, i) => {
    const v = num(r.numero)
    const prev = i > 0 ? num(etapas[i - 1].numero) : 0
    return { label: r.etapa, value: v, note: i > 0 && prev > 0 ? `${pct(v / prev, 0)} da anterior` : undefined, tone: i === etapas.length - 1 ? ('ok' as const) : ('accent' as const) }
  })
  // Maior vazamento: a passagem com a menor conversão.
  let worst = -1
  let worstRate = Infinity
  for (let i = 1; i < etapas.length; i++) {
    const prev = num(etapas[i - 1].numero)
    const rate = prev > 0 ? num(etapas[i].numero) / prev : Infinity
    if (rate < worstRate) {
      worstRate = rate
      worst = i
    }
  }

  const num_ = (name: string) => {
    const r = etapas.find((x) => x.etapa === name)
    return r ? num(r.numero) : 0
  }
  const cmp = PAIRS.map((p) => {
    const a = num_(p.from)
    const b = num_(p.to)
    const real = a > 0 && b > 0 ? b / a : null
    const typed = String(data[p.taxa] ?? '').trim() !== '' ? num(data[p.taxa]) / 100 : null
    return { ...p, real, typed }
  }).filter((c) => c.real !== null || c.typed !== null)

  return (
    <Panel title="Seu funil em números" intro="A conversão entre as etapas, calculada pelos números da semana que você preencheu.">
      <HBars rows={rows} />
      {worst > 0 && Number.isFinite(worstRate) && (
        <p className="ins-note">
          Onde mais vaza: de {etapas[worst - 1].etapa} para {etapas[worst].etapa}, só {pct(worstRate, 0)} avançam.
        </p>
      )}
      {cmp.length > 0 && (
        <>
          <div className="ins-sub">Sua taxa vs o que os números mostram</div>
          <div className="ins-cmp">
            {cmp.map((c) => {
              const off = c.real !== null && c.typed !== null && Math.abs(c.real - c.typed) > 0.05
              return (
                <div key={c.taxa}>
                  <span className="l">{c.label}</span>
                  <span className="v">
                    {c.real !== null ? pct(c.real, 0) : '-'}
                    <small>
                      sua taxa: {c.typed !== null ? pct(c.typed, 0) : '-'}
                      {off && c.real !== null && c.typed !== null ? (c.real < c.typed ? ' (real está abaixo)' : ' (real está acima)') : ''}
                    </small>
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </Panel>
  )
}
