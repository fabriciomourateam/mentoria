import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Icon } from '../../components/Icon'
import { CTA, Empty } from '../../components/ui'
import { api } from '../../lib/api'
import { addDays, weekLabel, weekStart } from '../../lib/dates'
import { useStore } from '../../lib/store'
import { num } from '../../lib/workspace'
import { CheckinCharts, CheckinList, CheckinTiles, prevOf } from './parts'
import { notifyCheckinChanged, useCheckins } from './useCheckins'
import './checkin.css'

interface Form {
  leads: string
  conversas: string
  vendas: string
  alunos_ativos: string
  faturamento: string
  nota: string
}
const EMPTY: Form = { leads: '', conversas: '', vendas: '', alunos_ativos: '', faturamento: '', nota: '' }

const FIELDS: { key: 'leads' | 'conversas' | 'vendas' | 'alunos_ativos'; label: string; hint: string }[] = [
  { key: 'leads', label: 'Leads novos', hint: 'Pessoas que pediram informação na semana.' },
  { key: 'conversas', label: 'Conversas de venda', hint: 'Avaliações ou calls de venda que você fez.' },
  { key: 'vendas', label: 'Vendas', hint: 'Alunos novos fechados.' },
  { key: 'alunos_ativos', label: 'Alunos ativos', hint: 'Quantos alunos você tem no fim da semana.' },
]

export function CheckinPage() {
  const { toast } = useStore()
  const { rows, reload } = useCheckins()
  const current = weekStart()
  const weeks = useMemo(() => Array.from({ length: 8 }, (_, i) => addDays(current, -7 * i)), [current])
  const [sel, setSel] = useState(current)
  const [form, setForm] = useState<Form>(EMPTY)
  const [saving, setSaving] = useState(false)

  const existing = rows?.find((r) => r.week_start === sel)
  const existingId = existing?.id
  useEffect(() => {
    if (rows === null) return
    const e = rows.find((r) => r.week_start === sel)
    setForm(
      e
        ? {
            leads: String(e.leads),
            conversas: String(e.conversas),
            vendas: String(e.vendas),
            alunos_ativos: String(e.alunos_ativos),
            faturamento: e.faturamento === null ? '' : String(e.faturamento),
            nota: e.nota ?? '',
          }
        : EMPTY,
    )
    // recarrega o formulário só ao trocar de semana ou quando o registro muda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel, existingId, rows === null])

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.saveCheckin({
        week_start: sel,
        leads: Math.max(0, Math.round(num(form.leads))),
        conversas: Math.max(0, Math.round(num(form.conversas))),
        vendas: Math.max(0, Math.round(num(form.vendas))),
        alunos_ativos: Math.max(0, Math.round(num(form.alunos_ativos))),
        faturamento: form.faturamento.trim() ? Math.max(0, num(form.faturamento)) : null,
        nota: form.nota.trim() || null,
      })
      reload()
      notifyCheckinChanged()
      toast('Check-in salvo.')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível salvar.')
    } finally {
      setSaving(false)
    }
  }

  const done = new Set((rows ?? []).map((r) => r.week_start))
  const cur = existing
  const prev = rows && cur ? prevOf(rows, cur.week_start) : undefined

  return (
    <div className="ck">
      <header className="tool-head r">
        <span className="tool-ico">
          <Icon name="chart" />
        </span>
        <div className="tx">
          <h1>Check-in semanal</h1>
          <p>Leva 1 minuto. Seus números da semana viram gráfico e mostram onde você está evoluindo.</p>
        </div>
      </header>

      <div className="ck-weeks r" style={{ ['--i' as string]: 1 }} role="group" aria-label="Escolher semana">
        {weeks.map((w) => (
          <button key={w} type="button" className={`ck-chip ${w === sel ? 'on' : ''}`} aria-pressed={w === sel} onClick={() => setSel(w)}>
            {done.has(w) ? <Icon name="check" /> : <i className="ck-dot" />}
            {w === current ? 'Esta semana' : weekLabel(w)}
          </button>
        ))}
      </div>

      <form className="card ck-form r" style={{ ['--i' as string]: 2 }} onSubmit={submit}>
        <div className="ck-fh">
          <h2>{sel === current ? 'Esta semana' : 'Semana'} · {weekLabel(sel)}</h2>
          {existing && <span className="pill ok">Feito</span>}
        </div>
        <div className="ck-grid">
          {FIELDS.map((f) => (
            <label key={f.key} className="field">
              <span>{f.label}</span>
              <input
                className="input"
                inputMode="numeric"
                placeholder="0"
                value={form[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
              />
              <small>{f.hint}</small>
            </label>
          ))}
        </div>
        <label className="field">
          <span>Faturamento da semana (R$) <em>opcional</em></span>
          <input className="input" inputMode="decimal" placeholder="0,00" value={form.faturamento} onChange={(e) => set('faturamento', e.target.value)} />
          <small>O que entrou na semana.</small>
        </label>
        <label className="field">
          <span>O que travou ou funcionou? <em>opcional</em></span>
          <textarea className="textarea" rows={3} value={form.nota} onChange={(e) => set('nota', e.target.value)} />
        </label>
        <CTA type="submit" icon="check" disabled={saving || rows === null}>
          {saving ? 'Salvando...' : 'Salvar check-in'}
        </CTA>
      </form>

      {rows === null ? (
        <div className="sk" style={{ height: 160 }} aria-busy="true" />
      ) : rows.length === 0 ? (
        <Empty icon="chart" title="Nenhum check-in ainda">
          Preencha os números desta semana. Com 2 ou 3 semanas já aparece sua evolução.
        </Empty>
      ) : (
        <>
          {cur && (
            <section className="r" style={{ ['--i' as string]: 3 }}>
              <h2 className="ck-h">Como foi a semana</h2>
              <CheckinTiles cur={cur} prev={prev} />
            </section>
          )}
          <section className="card r" style={{ ['--i' as string]: 4 }}>
            <h2 className="ck-h">Sua evolução</h2>
            <CheckinCharts rows={rows} />
          </section>
          <section className="r" style={{ ['--i' as string]: 5 }}>
            <h2 className="ck-h">Histórico</h2>
            <CheckinList rows={rows} />
          </section>
        </>
      )}
    </div>
  )
}
