import { Link } from 'react-router-dom'
import { BarChart, Delta } from '../../components/charts'
import { Icon } from '../../components/Icon'
import { CTA } from '../../components/ui'
import { fmtDay, weekStart } from '../../lib/dates'
import { brl } from '../../lib/workspace'
import { prevOf } from './parts'
import { useCheckins } from './useCheckins'
import './checkin.css'

/** Card da Home: mostra o check-in da semana ou chama pra fazer. */
export function CheckinCard() {
  const { rows } = useCheckins()
  if (rows === null) return <div className="sk" style={{ height: 150 }} aria-busy="true" aria-label="Carregando" />
  const ws = weekStart()
  const cur = rows.find((r) => r.week_start === ws)
  if (!cur)
    return (
      <div className="card ck-card todo">
        <div className="ck-ct">
          <span className="tool-ico">
            <Icon name="chart" />
          </span>
          <div>
            <h3>Faltou o check-in da semana</h3>
            <p className="muted">Leva 1 minuto.</p>
          </div>
        </div>
        <CTA to="/checkin">Fazer check-in</CTA>
      </div>
    )
  const prev = prevOf(rows, ws)
  const last8 = rows.slice(-8)
  const stats = [
    { k: 'Vendas', v: String(cur.vendas), n: cur.vendas, b: prev?.vendas },
    { k: 'Alunos ativos', v: String(cur.alunos_ativos), n: cur.alunos_ativos, b: prev?.alunos_ativos },
    { k: 'Faturamento', v: cur.faturamento === null ? '-' : brl(cur.faturamento), n: cur.faturamento, b: prev?.faturamento },
  ]
  return (
    <div className="card ck-card">
      <div className="ck-ct">
        <span className="pill ok"><Icon name="check" />Feito</span>
        <h3>Check-in desta semana feito</h3>
      </div>
      <div className="ck-stats">
        {stats.map((s) => (
          <div key={s.k}>
            <small>{s.k}</small>
            <b>{s.v}</b>
            {s.n != null && s.b != null && <Delta now={s.n} before={s.b} />}
          </div>
        ))}
      </div>
      <BarChart data={last8.map((r) => ({ label: fmtDay(r.week_start), value: r.vendas }))} height={56} ariaLabel="Vendas nas últimas semanas" />
      <Link className="link ck-more" to="/checkin">Ver evolução</Link>
    </div>
  )
}
