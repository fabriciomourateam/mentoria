import type { ReactNode } from 'react'
import './insights.css'

/** Barra de progresso com cor de semáforo (ok, warn, bad) ou destaque. */
export function Meter({ pct, tone = 'accent', label }: { pct: number; tone?: 'accent' | 'ok' | 'warn' | 'bad'; label?: string }) {
  const p = Math.max(0, Math.min(100, pct))
  return (
    <div className="ins-meter" role="progressbar" aria-valuenow={Math.round(p)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <i className={tone} style={{ width: `${Math.max(p, p > 0 ? 3 : 0)}%` }} />
    </div>
  )
}

/** Cartão de painel de insights (título + conteúdo). */
export function Panel({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <section className="card sec ins-panel r" style={{ ['--i' as string]: 0 }}>
      <h2>{title}</h2>
      {intro && <p className="sec-intro">{intro}</p>}
      <div className="sec-fields">{children}</div>
    </section>
  )
}
