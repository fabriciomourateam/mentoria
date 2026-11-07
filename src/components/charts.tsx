// Gráficos leves em SVG (sem biblioteca). Cores pelos tokens do tema (--accent, --muted, --line).

export interface Point {
  label: string
  value: number | null
}

const fmtShort = (n: number) =>
  Math.abs(n) >= 1000 ? `${(n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k` : n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })

function scale(values: number[], zero = true) {
  const max = Math.max(...values, zero ? 0 : -Infinity, 1e-9)
  const min = zero ? Math.min(0, ...values) : Math.min(...values)
  return { max, min, span: max - min || 1 }
}

/** Barras verticais. `highlight` pinta a última barra (ou a de índice dado) com a cor de destaque. */
export function BarChart({
  data,
  height = 160,
  format = fmtShort,
  highlight = -1,
  ariaLabel,
}: {
  data: Point[]
  height?: number
  format?: (n: number) => string
  highlight?: number
  ariaLabel?: string
}) {
  const vals = data.map((d) => d.value ?? 0)
  const { max, min, span } = scale(vals)
  const W = 100
  const gap = data.length > 12 ? 1 : 2
  const bw = (W - gap * (data.length - 1)) / Math.max(data.length, 1)
  const hi = highlight < 0 ? data.length - 1 : highlight
  const y0 = ((max - 0) / span) * 100
  return (
    <figure className="chart" aria-label={ariaLabel}>
      <div className="chart-plot" style={{ height }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img">
          <line x1="0" x2="100" y1={y0} y2={y0} className="axis" vectorEffect="non-scaling-stroke" />
          {data.map((d, i) => {
            const v = d.value ?? 0
            const top = ((max - Math.max(v, 0)) / span) * 100
            const bottom = ((max - Math.min(v, 0)) / span) * 100
            return (
              <rect
                key={i}
                x={i * (bw + gap)}
                y={top}
                width={bw}
                height={Math.max(bottom - top, d.value ? 0.6 : 0)}
                rx={0.8}
                className={`bar ${i === hi ? 'hi' : ''} ${v < 0 ? 'neg' : ''}`}
              >
                <title>{`${d.label}: ${d.value === null ? '-' : format(v)}`}</title>
              </rect>
            )
          })}
        </svg>
        <span className="chart-max">{format(max)}</span>
        {min < 0 && <span className="chart-min">{format(min)}</span>}
      </div>
      <figcaption className="chart-x">
        {data.map((d, i) => (
          <span key={i} className={i === hi ? 'hi' : ''}>
            {d.label}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

export interface Series {
  name: string
  values: (number | null)[]
  /** 'accent' (padrão), 'muted' ou 'ink'. */
  tone?: 'accent' | 'muted' | 'ink'
  dashed?: boolean
}

/** Linhas (uma ou mais séries) sobre os mesmos rótulos. */
export function LineChart({
  labels,
  series,
  height = 170,
  format = fmtShort,
  ariaLabel,
}: {
  labels: string[]
  series: Series[]
  height?: number
  format?: (n: number) => string
  ariaLabel?: string
}) {
  const all = series.flatMap((s) => s.values.filter((v): v is number => v !== null))
  const { max, min, span } = scale(all.length ? all : [0])
  const n = Math.max(labels.length - 1, 1)
  const x = (i: number) => (i / n) * 100
  const y = (v: number) => ((max - v) / span) * 100
  return (
    <figure className="chart" aria-label={ariaLabel}>
      <div className="chart-plot" style={{ height }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img">
          <line x1="0" x2="100" y1={y(Math.max(min, 0))} y2={y(Math.max(min, 0))} className="axis" vectorEffect="non-scaling-stroke" />
          {series.map((s, si) => {
            const pts = s.values.map((v, i) => (v === null ? null : `${x(i)},${y(v)}`)).filter(Boolean)
            return (
              <polyline
                key={si}
                points={pts.join(' ')}
                className={`line ${s.tone ?? 'accent'} ${s.dashed ? 'dashed' : ''}`}
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </svg>
        {series.map((s, si) =>
          s.values.map((v, i) =>
            v === null ? null : (
              <i
                key={`${si}-${i}`}
                className={`dot ${s.tone ?? 'accent'}`}
                style={{ left: `${x(i)}%`, top: `${y(v)}%` }}
                title={`${s.name} · ${labels[i]}: ${format(v)}`}
              />
            ),
          ),
        )}
        <span className="chart-max">{format(max)}</span>
      </div>
      <figcaption className="chart-x">
        {labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </figcaption>
      {series.length > 1 && (
        <div className="chart-legend">
          {series.map((s) => (
            <span key={s.name} className={s.tone ?? 'accent'}>
              <i className={s.dashed ? 'dashed' : ''} />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </figure>
  )
}

/** Barras horizontais com rótulo e valor (ex.: funil por etapa). */
export function HBars({
  rows,
  format = (n: number) => n.toLocaleString('pt-BR'),
}: {
  rows: { label: string; value: number; note?: string; tone?: 'accent' | 'muted' | 'ok' | 'bad' }[]
  format?: (n: number) => string
}) {
  const max = Math.max(...rows.map((r) => r.value), 1)
  return (
    <div className="hbars">
      {rows.map((r) => (
        <div key={r.label} className="hb">
          <span className="hb-l">{r.label}</span>
          <span className="hb-t">
            <i className={r.tone ?? 'accent'} style={{ width: `${Math.max((r.value / max) * 100, r.value ? 3 : 0)}%` }} />
          </span>
          <span className="hb-v">
            {format(r.value)}
            {r.note && <small>{r.note}</small>}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Variação entre dois números: "+12%" / "-5%" com classe up/down. */
export function Delta({ now, before, invert = false }: { now: number; before: number; invert?: boolean }) {
  if (!before) return null
  const d = (now - before) / Math.abs(before)
  const good = invert ? d < 0 : d > 0
  return (
    <span className={`delta ${d === 0 ? '' : good ? 'up' : 'down'}`}>
      {d > 0 ? '+' : ''}
      {(d * 100).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}%
    </span>
  )
}
