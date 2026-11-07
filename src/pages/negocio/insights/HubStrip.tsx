import { Link } from 'react-router-dom'
import { Delta } from '../../../components/charts'
import { Icon } from '../../../components/Icon'
import { dayBRT } from '../../../lib/dates'
import type { Lead, WeeklyCheckin } from '../../../lib/types'
import { brl, num, useWorkspace } from '../../../lib/workspace'
import { dreSerie, proLaboreCalc } from '../financas/calc'
import { checkinsByMonth, monthOfIso } from './data'
import './insights.css'

/** Faixa "Seus números" do hub: 4 indicadores reais do aluno, com variação quando há valor anterior. */
export function HubStrip({ leads, checkins, loaded }: { leads: Lead[]; checkins: WeeklyCheckin[]; loaded: boolean }) {
  const { get, readOnly } = useWorkspace()

  // Faturamento: último mês da DRE; sem DRE, soma dos últimos 4 check-ins (vs os 4 anteriores).
  const dre = dreSerie(get('dre'), proLaboreCalc(get('prolabore')).necessario, num(get('prolabore').imposto))
  const dreUlt = dre[dre.length - 1]
  const comFat = checkins.filter((c) => c.faturamento !== null && c.faturamento !== undefined)
  const sum = (rows: WeeklyCheckin[]) => rows.reduce((s, c) => s + Number(c.faturamento), 0)
  let fat: number | null = null
  let fatPrev: number | null = null
  let fatNote = ''
  if (dreUlt) {
    fat = dreUlt.receita
    fatPrev = dre.length > 1 ? dre[dre.length - 2].receita : null
    fatNote = 'receita do último mês da DRE'
  } else if (comFat.length) {
    const last4 = comFat.slice(-4)
    const prev4 = comFat.slice(-8, -4)
    fat = sum(last4)
    fatPrev = prev4.length ? sum(prev4) : null
    fatNote = 'soma dos últimos check-ins'
  }

  const ult = checkins[checkins.length - 1]
  const pen = checkins.length > 1 ? checkins[checkins.length - 2] : null

  const abertos = leads.filter((l) => l.stage !== 'fechou' && l.stage !== 'perdido')

  // Vendas no mês: check-ins do mês; sem check-in no mês, leads fechados neste mês.
  const mes = dayBRT().slice(0, 7)
  const porMes = checkinsByMonth(checkins)
  const mesAtual = porMes.find((m) => m.mes === mes)
  const [yy, mm] = mes.split('-').map(Number)
  const mesAnt = `${mm === 1 ? yy - 1 : yy}-${String(mm === 1 ? 12 : mm - 1).padStart(2, '0')}`
  const antVendas = porMes.find((m) => m.mes === mesAnt)?.vendas ?? null
  const fechadosMes = leads.filter((l) => l.stage === 'fechou' && monthOfIso(l.updated_at) === mes).length
  const vendas = mesAtual ? mesAtual.vendas : fechadosMes
  const vendasNote = mesAtual ? 'pelos check-ins do mês' : 'leads fechados no mês'

  const nada = loaded && fat === null && !ult && !leads.length

  return (
    <section className="hub-strip r">
      <div className="head">
        <div className="sh" style={{ margin: 0 }}>
          <h2>Seus números</h2>
        </div>
        {!readOnly && (
          <Link className="link" to="/checkin">
            <Icon name="chart" />
            Fazer check-in
          </Link>
        )}
      </div>
      <div className="kpis">
        <div className="kpi">
          <div className="k">Faturamento</div>
          <div className="v">{fat !== null ? brl(fat) : '-'}</div>
          <div className="d">
            {fat !== null ? fatNote : 'preencha a DRE ou um check-in'} {fat !== null && fatPrev !== null && <Delta now={fat} before={fatPrev} />}
          </div>
        </div>
        <div className="kpi">
          <div className="k">Alunos ativos</div>
          <div className="v">{ult ? ult.alunos_ativos : '-'}</div>
          <div className="d">
            {ult ? 'último check-in' : 'faça seu primeiro check-in'} {ult && pen && <Delta now={ult.alunos_ativos} before={pen.alunos_ativos} />}
          </div>
        </div>
        <div className="kpi">
          <div className="k">Leads em aberto</div>
          <div className="v">{abertos.length}</div>
          <div className="d">{brl(abertos.reduce((s, l) => s + (l.value ?? 0), 0))} em jogo</div>
        </div>
        <div className="kpi hl">
          <div className="k">Vendas no mês</div>
          <div className="v">{vendas}</div>
          <div className="d">
            {vendasNote} {antVendas !== null && mesAtual && <Delta now={vendas} before={antVendas} />}
          </div>
        </div>
      </div>
      {nada && <p className="ins-note">Seus números aparecem aqui assim que você registrar leads, uma DRE ou o primeiro check-in.</p>}
    </section>
  )
}
