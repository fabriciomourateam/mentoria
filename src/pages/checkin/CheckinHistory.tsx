import { fmtDay } from '../../lib/dates'
import { CheckinCharts, CheckinList, CheckinTiles, prevOf } from './parts'
import { useCheckins } from './useCheckins'
import './checkin.css'

/** Visão somente leitura dos check-ins de um aluno (para o mentor). */
export function CheckinHistory({ userId }: { userId: string }) {
  const { rows } = useCheckins(userId)
  if (rows === null) return <div className="sk" style={{ height: 200 }} aria-busy="true" aria-label="Carregando" />
  if (!rows.length) return <p className="muted">Ainda não fez check-in.</p>
  const last = rows[rows.length - 1]
  return (
    <div className="ck ck-ro">
      <p className="muted">
        Último check-in: <b>{fmtDay(last.updated_at.slice(0, 10))}</b> (semana de {fmtDay(last.week_start)})
      </p>
      <CheckinTiles cur={last} prev={prevOf(rows, last.week_start)} />
      <CheckinCharts rows={rows} />
      <CheckinList rows={rows} />
    </div>
  )
}
