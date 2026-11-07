import { HBars } from '../../../components/charts'
import { pct, useEntry } from '../../../lib/workspace'
import { Meter, Panel } from './Meter'
import { toneOf } from './data'

type Row = Record<string, string>
const rowsOf = (v: unknown): Row[] => (Array.isArray(v) ? (v as Row[]).filter((r) => r && typeof r === 'object') : [])
const used = (r: Row, keys: string[]) => keys.some((k) => (r[k] ?? '').trim() !== '')

const STATUS = ['Ideia', 'Roteirizado', 'Gravado', 'Publicado']
const OBJETIVOS = ['Atrair', 'Gerar confiança', 'Vender']

function count(rows: Row[], key: string, order: string[]) {
  const map = new Map<string, number>(order.map((o) => [o, 0]))
  for (const r of rows) {
    const v = (r[key] ?? '').trim()
    if (v) map.set(v, (map.get(v) ?? 0) + 1)
  }
  return [...map.entries()]
}

/** Painel do calendário: posts por status, tipo e objetivo, e quanto do mês já foi publicado. */
export function CalendarioInsights() {
  const { data } = useEntry('calendario')
  const mes = rowsOf(data.mes).filter((r) => used(r, ['tema', 'tipo', 'formato', 'status', 'data']))
  const grade = rowsOf(data.grade).filter((r) => used(r, ['tipo', 'objetivo']))
  if (!mes.length && !grade.length) return null

  const porStatus = count(mes, 'status', STATUS)
  const publicados = porStatus.find(([k]) => k === 'Publicado')?.[1] ?? 0
  const pPub = mes.length ? (publicados / mes.length) * 100 : 0
  const porTipo = count(mes, 'tipo', []).sort((a, b) => b[1] - a[1])
  const porObjetivo = count(grade, 'objetivo', OBJETIVOS)
  const diasGrade = grade.length
  const vendem = porObjetivo.find(([k]) => k === 'Vender')?.[1] ?? 0

  return (
    <Panel title="Seu conteúdo em números" intro="Contado sozinho a partir da grade e do plano do mês.">
      {mes.length > 0 && (
        <>
          <div className="ins-row">
            <div className="t">
              <b>{pct(pPub / 100, 0)} do mês publicado</b>
              <span>
                {publicados} de {mes.length} {mes.length === 1 ? 'post' : 'posts'}
              </span>
            </div>
            <Meter pct={pPub} tone={mes.length ? toneOf(pPub) : 'accent'} label="Posts publicados no mês" />
          </div>
          <div className="ins-cols">
            <div className="ins-row">
              <div className="ins-sub" style={{ margin: 0 }}>Por status</div>
              <HBars
                rows={porStatus.map(([label, value]) => ({ label, value, tone: label === 'Publicado' ? ('ok' as const) : label === 'Ideia' ? ('muted' as const) : ('accent' as const) }))}
              />
            </div>
            {porTipo.length > 0 && (
              <div className="ins-row">
                <div className="ins-sub" style={{ margin: 0 }}>Por tipo</div>
                <HBars rows={porTipo.map(([label, value]) => ({ label, value }))} />
              </div>
            )}
          </div>
        </>
      )}
      {diasGrade > 0 && porObjetivo.some(([, v]) => v > 0) && (
        <div className="ins-row">
          <div className="ins-sub" style={{ margin: 0 }}>Objetivo da grade semanal</div>
          <HBars rows={porObjetivo.map(([label, value]) => ({ label, value, tone: label === 'Vender' ? ('ok' as const) : ('accent' as const) }))} />
          <span className="ins-note">
            {vendem === 1
              ? 'Um dia vende e o resto atrai ou gera confiança: a proporção que a aula recomenda.'
              : vendem === 0
                ? 'Nenhum dia da grade vende. Reserve pelo menos um para a oferta.'
                : `${vendem} dias vendem de ${diasGrade}. A aula recomenda 1 de cada 6.`}
          </span>
        </div>
      )}
    </Panel>
  )
}
