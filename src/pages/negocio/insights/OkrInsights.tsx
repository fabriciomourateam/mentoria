import { num, pct, useEntry } from '../../../lib/workspace'
import { Meter, Panel } from './Meter'
import { toneOf } from './data'

const TONE_LABEL = { ok: 'No caminho', warn: 'Atenção', bad: 'Longe da meta' } as const

type Kr = Record<string, string>
const filled = (v: unknown) => (typeof v === 'string' ? v.trim() !== '' : typeof v === 'number')

/** Progresso de cada resultado-chave: (atual - base) / (meta - base), de 0 a 100%. */
export function OkrInsights() {
  const { data } = useEntry('okr')
  const krs = (Array.isArray(data.krs) ? (data.krs as Kr[]) : []).filter((r) => (r.kr ?? '').trim() && filled(r.base) && filled(r.meta))
  if (!krs.length) return null

  const items = krs.map((r) => {
    const base = num(r.base)
    const meta = num(r.meta)
    const hasAtual = filled(r.atual)
    const atual = hasAtual ? num(r.atual) : base
    const span = meta - base
    const p = span === 0 ? (atual === meta ? 100 : 0) : Math.max(0, Math.min(100, ((atual - base) / span) * 100))
    return { kr: r.kr, base, meta, atual, hasAtual, p, tone: toneOf(p) }
  })
  const withAtual = items.filter((i) => i.hasAtual)
  const avg = withAtual.length ? withAtual.reduce((s, i) => s + i.p, 0) / withAtual.length : 0

  return (
    <Panel title="Como estão seus resultados-chave" intro="Calculado com linha de base, meta e atual. Atualize o atual na revisão semanal.">
      <div className="kpis">
        <div className="kpi hl">
          <div className="k">Progresso geral</div>
          <div className="v">{withAtual.length ? `${Math.round(avg)}%` : '-'}</div>
          <div className="d">{withAtual.length ? `média de ${withAtual.length} ${withAtual.length === 1 ? 'resultado' : 'resultados'}` : 'preencha o atual'}</div>
        </div>
      </div>
      {items.map((i, n) => (
        <div key={n} className="ins-row">
          <div className="t">
            <b>{i.kr}</b>
            <span>{i.hasAtual ? `${Math.round(i.p)}% · ${TONE_LABEL[i.tone]}` : 'sem o atual'}</span>
          </div>
          <Meter pct={i.p} tone={i.hasAtual ? i.tone : 'accent'} label={`Progresso de ${i.kr}`} />
          <span className="ins-note">
            Base {i.base.toLocaleString('pt-BR')}, atual {i.hasAtual ? i.atual.toLocaleString('pt-BR') : '-'}, meta {i.meta.toLocaleString('pt-BR')}
            {i.hasAtual && i.p < 100 ? ` (${pct(i.p / 100, 0)} do caminho)` : ''}
          </span>
        </div>
      ))}
    </Panel>
  )
}
