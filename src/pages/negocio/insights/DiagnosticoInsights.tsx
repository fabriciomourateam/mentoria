import { useEffect } from 'react'
import { Delta } from '../../../components/charts'
import { brl, num, pct, useEntry, useWorkspace } from '../../../lib/workspace'
import { dreSerie, proLaboreCalc } from '../financas/calc'
import { faturamentoMensalAprox, useCheckins } from './data'
import { Meter, Panel } from './Meter'
import { fmtDay } from '../../../lib/dates'

const BASE_FIELDS = ['faturamento_medio', 'alunos_presenciais', 'alunos_online', 'horas_semana', 'meta_6m'] as const

/** Painel calculado do "Meu ponto de partida" + comparação com o baseline guardado no primeiro salvamento. */
export function DiagnosticoInsights() {
  const { data, patch, state, readOnly } = useEntry('diagnostico')
  const { get } = useWorkspace()
  const { rows: checkins } = useCheckins()

  const fat = num(data.faturamento_medio)
  const pres = num(data.alunos_presenciais)
  const onl = num(data.alunos_online)
  const horas = num(data.horas_semana)
  const meta = num(data.meta_6m)
  const alunos = pres + onl

  // Baseline imutável: guardado uma vez, quando o essencial já está preenchido e salvo.
  const base = data._base && typeof data._base === 'object' ? (data._base as Record<string, unknown>) : null
  const pronto = fat > 0 && alunos > 0
  useEffect(() => {
    if (readOnly || base || !pronto || state !== 'saved') return
    const snap: Record<string, unknown> = { date: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }) }
    for (const k of BASE_FIELDS) snap[k] = num(data[k])
    patch({ _base: snap })
  }, [readOnly, base, pronto, state, data, patch])

  if (!pronto && !(meta > 0)) return null

  const porHora = fat > 0 && horas > 0 ? fat / (horas * 4) : null
  const ticket = fat > 0 && alunos > 0 ? fat / alunos : null
  const pctOnline = alunos > 0 ? onl / alunos : null
  const gap = meta > 0 ? meta - fat : null
  const prog = meta > 0 && fat > 0 ? Math.min(100, (fat / meta) * 100) : 0

  // "Hoje": receita do último mês da DRE; sem DRE, aproximação pelos check-ins.
  const pl = proLaboreCalc(get('prolabore')).necessario
  const dre = dreSerie(get('dre'), pl, num(get('prolabore').imposto))
  const dreUlt = dre[dre.length - 1]
  const fatHoje = dreUlt ? dreUlt.receita : faturamentoMensalAprox(checkins)
  const fatSrc = dreUlt ? 'DRE do último mês' : 'check-ins das últimas semanas'
  const ult = checkins[checkins.length - 1]
  const alunosHoje = ult ? ult.alunos_ativos : null

  const b = {
    fat: base ? num(base.faturamento_medio) : fat,
    alunos: base ? num(base.alunos_presenciais) + num(base.alunos_online) : alunos,
    horas: base ? num(base.horas_semana) : horas,
  }
  const bPorHora = b.fat > 0 && b.horas > 0 ? b.fat / (b.horas * 4) : null
  const hojePorHora = fatHoje && horas > 0 ? fatHoje / (horas * 4) : null
  const temHoje = (fatHoje ?? 0) > 0 || (alunosHoje ?? 0) > 0

  return (
    <Panel title="O que seus números dizem" intro="Calculado sozinho a partir do que você preencheu abaixo.">
      <div className="kpis">
        <div className="kpi">
          <div className="k">Por hora trabalhada</div>
          <div className="v">{porHora !== null ? brl(porHora) : '-'}</div>
          <div className="d">{porHora !== null ? 'faturamento ÷ (horas x 4)' : 'informe as horas por semana'}</div>
        </div>
        <div className="kpi">
          <div className="k">Ticket médio</div>
          <div className="v">{ticket !== null ? brl(ticket) : '-'}</div>
          <div className="d">{alunos > 0 ? `${alunos} alunos pagando` : 'informe os alunos'}</div>
        </div>
        <div className="kpi">
          <div className="k">Alunos online</div>
          <div className="v">{pctOnline !== null ? pct(pctOnline, 0) : '-'}</div>
          <div className="d">{pctOnline !== null ? `${onl} online e ${pres} presenciais` : 'informe os alunos'}</div>
        </div>
        <div className="kpi hl">
          <div className="k">Falta para a meta</div>
          <div className="v">{gap !== null ? (gap > 0 ? brl(gap) : 'Meta batida') : '-'}</div>
          <div className="d">{gap !== null && fat > 0 ? `${pct(Math.max(0, gap) / meta, 0)} a mais por mês` : 'informe a meta de 6 meses'}</div>
        </div>
      </div>
      {meta > 0 && fat > 0 && (
        <div className="ins-row">
          <div className="t">
            <b>Caminho até a meta</b>
            <span>
              {brl(fat)} de {brl(meta)}
            </span>
          </div>
          <Meter pct={prog} tone={prog >= 100 ? 'ok' : 'accent'} label="Progresso até a meta de 6 meses" />
        </div>
      )}
      {temHoje && (
        <>
          <div className="ins-sub">Hoje vs ponto de partida</div>
          <div className="ins-cmp">
            {fatHoje !== null && fatHoje > 0 && (
              <div>
                <span className="l">
                  Faturamento mensal
                  <small style={{ display: 'block', fontSize: 12 }}>hoje pela {fatSrc}</small>
                </span>
                <span className="v">
                  {brl(b.fat)} → {brl(fatHoje)} {b.fat > 0 && <Delta now={fatHoje} before={b.fat} />}
                </span>
              </div>
            )}
            {alunosHoje !== null && alunosHoje > 0 && (
              <div>
                <span className="l">
                  Alunos ativos
                  <small style={{ display: 'block', fontSize: 12 }}>hoje pelo último check-in</small>
                </span>
                <span className="v">
                  {b.alunos} → {alunosHoje} {b.alunos > 0 && <Delta now={alunosHoje} before={b.alunos} />}
                </span>
              </div>
            )}
            {hojePorHora !== null && bPorHora !== null && (
              <div>
                <span className="l">Por hora trabalhada</span>
                <span className="v">
                  {brl(bPorHora)} → {brl(hojePorHora)} <Delta now={hojePorHora} before={bPorHora} />
                </span>
              </div>
            )}
          </div>
          <p className="ins-note">
            {base
              ? `Ponto de partida guardado em ${fmtDay(String(base.date ?? ''), true)}. Ele não muda mais, mesmo que você edite os números acima.`
              : 'Quando a ficha for salva, os números acima viram seu ponto de partida fixo.'}
          </p>
        </>
      )}
    </Panel>
  )
}
