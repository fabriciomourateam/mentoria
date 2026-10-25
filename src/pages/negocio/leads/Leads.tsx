import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Icon } from '../../../components/Icon'
import { CTA, Empty } from '../../../components/ui'
import { api } from '../../../lib/api'
import { useStore } from '../../../lib/store'
import type { Lead, LeadStage } from '../../../lib/types'
import { brl, num, useWorkspace } from '../../../lib/workspace'
import type { FormSchema } from '../forms'
import { useCheckpointSync } from '../FormTool'
import type { ToolProgress } from '../types'

export const progress: ToolProgress = (_get, extra) => Math.min(1, extra.leads / 10)

// Aula "Seus primeiros 10 leads": 1 lead marca c2, 10 leads marcam c3.
const SCHEMA: FormSchema = {
  sections: [],
  checkpoint: {
    slug: 'captacao',
    position: 4,
    checked: (d) => {
      const count = typeof d.count === 'number' ? d.count : 0
      return count >= 10 ? ['c2', 'c3'] : count >= 1 ? ['c2'] : []
    },
  },
}

const STAGES: { id: LeadStage; label: string; pill: string }[] = [
  { id: 'novo', label: 'Novo', pill: '' },
  { id: 'conversa', label: 'Conversa', pill: 'acc' },
  { id: 'avaliacao', label: 'Avaliação', pill: 'acc' },
  { id: 'proposta', label: 'Proposta', pill: 'acc' },
  { id: 'fechou', label: 'Fechou', pill: 'ok' },
  { id: 'perdido', label: 'Perdido', pill: 'bad' },
]
const FLOW: LeadStage[] = ['novo', 'conversa', 'avaliacao', 'proposta', 'fechou']
const ORIGINS = ['Instagram', 'Indicação', 'Ex-aluno', 'Família e amigos', 'Parceria', 'Anúncio', 'Outro']

const stageOf = (id: LeadStage) => STAGES.find((s) => s.id === id) ?? STAGES[0]
const isOpen = (l: Lead) => l.stage !== 'fechou' && l.stage !== 'perdido'
const todayBR = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' })
const fmtDate = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}`

/** Link do WhatsApp quando o contato parece um telefone (10 ou 11 dígitos ganham o prefixo 55). */
function whatsLink(contact: string | null): string | null {
  if (!contact || /[a-z@]/i.test(contact)) return null
  const digits = contact.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 13) return null
  return `https://wa.me/${digits.length <= 11 ? `55${digits}` : digits}`
}

type Filter = 'todos' | LeadStage

interface Draft {
  id?: string
  name: string
  contact: string
  origin: string
  stage: LeadStage
  next_step: string
  next_date: string
  value: string
  notes: string
}

const emptyDraft = (): Draft => ({
  name: '',
  contact: '',
  origin: 'Instagram',
  stage: 'novo',
  next_step: '',
  next_date: '',
  value: '',
  notes: '',
})

const toDraft = (l: Lead): Draft => ({
  id: l.id,
  name: l.name,
  contact: l.contact ?? '',
  origin: l.origin ?? '',
  stage: l.stage,
  next_step: l.next_step ?? '',
  next_date: l.next_date ?? '',
  value: l.value ? String(l.value).replace('.', ',') : '',
  notes: l.notes ?? '',
})

export default function Leads() {
  const { userId, readOnly } = useWorkspace()
  const { toast } = useStore()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loaded, setLoaded] = useState(false)
  const [filter, setFilter] = useState<Filter>('todos')
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState<Draft | null>(null)
  const today = todayBR()

  useEffect(() => {
    let alive = true
    api
      .listLeads(userId)
      .then((rows) => {
        if (!alive) return
        setLeads(rows)
        setLoaded(true)
      })
      .catch((e) => {
        if (!alive) return
        toast(e instanceof Error ? e.message : 'Não foi possível carregar os leads.')
        setLoaded(true)
      })
    return () => {
      alive = false
    }
  }, [userId, toast])

  const syncData = useMemo(() => ({ count: leads.length }), [leads.length])
  useCheckpointSync(SCHEMA, syncData, loaded && !readOnly ? 'saved' : 'idle')

  const upsert = useCallback((row: Lead) => {
    setLeads((cur) => (cur.some((x) => x.id === row.id) ? cur.map((x) => (x.id === row.id ? row : x)) : [row, ...cur]))
  }, [])

  const advance = async (l: Lead) => {
    const next = FLOW[FLOW.indexOf(l.stage) + 1]
    if (!next) return
    try {
      upsert(await api.saveLead({ id: l.id, name: l.name, stage: next }))
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Não foi possível atualizar o lead.')
    }
  }

  const due = (l: Lead) => isOpen(l) && !!l.next_date && l.next_date <= today
  const dueCount = leads.filter(due).length
  const total = leads.length
  const won = leads.filter((l) => l.stage === 'fechou').length
  const inTalk = leads.filter((l) => l.stage === 'conversa' || l.stage === 'avaliacao' || l.stage === 'proposta').length

  const counts = useMemo(() => {
    const c: Record<string, number> = { todos: leads.length }
    for (const s of STAGES) c[s.id] = leads.filter((l) => l.stage === s.id).length
    return c
  }, [leads])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rank = (l: Lead) => {
      if (!isOpen(l)) return 3
      if (l.next_date && l.next_date <= today) return 0
      return l.next_date ? 1 : 2
    }
    return leads
      .filter((l) => (filter === 'todos' || l.stage === filter) && (!q || l.name.toLowerCase().includes(q)))
      .sort((a, b) => {
        const ra = rank(a)
        const rb = rank(b)
        if (ra !== rb) return ra - rb
        if (ra <= 1 && a.next_date !== b.next_date) return (a.next_date ?? '').localeCompare(b.next_date ?? '')
        return b.created_at.localeCompare(a.created_at)
      })
  }, [leads, filter, query, today])

  const tabs: { id: Filter; label: string }[] = [{ id: 'todos', label: 'Todos' }, ...STAGES.map((s) => ({ id: s.id, label: s.label }))]

  return (
    <div className="stack">
      <div className="kpis r" style={{ ['--i' as string]: 1 }}>
        <div className="kpi">
          <div className="k">Total de leads</div>
          <div className="v">{total}</div>
          <div className="d">{total >= 10 ? 'Meta dos 10 batida' : `${Math.max(0, 10 - total)} para a meta de 10`}</div>
        </div>
        <div className="kpi">
          <div className="k">Em conversa</div>
          <div className="v">{inTalk}</div>
          <div className="d">Conversa, avaliação ou proposta</div>
        </div>
        <div className="kpi">
          <div className="k">Fechados</div>
          <div className="v">{won}</div>
          <div className="d">{total ? `${Math.round((won / total) * 100)}% de conversão` : 'Sem leads ainda'}</div>
        </div>
        <div className="kpi hl">
          <div className="k">Follow-up de hoje</div>
          <div className="v">{dueCount}</div>
          <div className="d">{dueCount ? 'Retome hoje, antes que esfriem' : 'Nada vencido por enquanto'}</div>
        </div>
      </div>

      {loaded && total === 0 ? (
        <Empty
          icon="users"
          title="Seus primeiros 10 leads começam aqui"
          action={
            !readOnly ? (
              <CTA icon="plus" onClick={() => setDraft(emptyDraft())}>
                Adicionar primeiro lead
              </CTA>
            ) : undefined
          }
        >
          {readOnly
            ? 'Este aluno ainda não registrou nenhum lead.'
            : 'Lead é qualquer pessoa que pediu informação sobre o seu trabalho. Comece pela rede próxima: família, amigos e ex-alunos. Registre cada um com o próximo passo e a data.'}
        </Empty>
      ) : (
        <>
          <div className="toolbar r" style={{ ['--i' as string]: 2, marginBottom: 0 }}>
            <input
              className="input grow"
              type="search"
              placeholder="Buscar por nome"
              aria-label="Buscar lead por nome"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {!readOnly && (
              <CTA icon="plus" variant="sm" onClick={() => setDraft(emptyDraft())}>
                Novo lead
              </CTA>
            )}
          </div>

          <nav className="adm-tabs r" aria-label="Filtrar por etapa" style={{ ['--i' as string]: 3, marginBottom: 0 }}>
            {tabs.map((t) => (
              <a
                key={t.id}
                href="#"
                className={filter === t.id ? 'active' : ''}
                aria-current={filter === t.id ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  setFilter(t.id)
                }}
              >
                {t.label} ({counts[t.id] ?? 0})
              </a>
            ))}
          </nav>

          {visible.length === 0 ? (
            <div className="card r" style={{ ['--i' as string]: 4, padding: '28px 20px', textAlign: 'center' }}>
              <p className="muted" style={{ fontSize: 14 }}>
                {loaded ? 'Nenhum lead encontrado com esse filtro.' : 'Carregando...'}
              </p>
            </div>
          ) : (
            <div className="card r" style={{ ['--i' as string]: 4, padding: 0, overflow: 'hidden' }}>
              {visible.map((l) => {
                const st = stageOf(l.stage)
                const wa = whatsLink(l.contact)
                const next = FLOW[FLOW.indexOf(l.stage) + 1]
                const overdue = isOpen(l) && !!l.next_date && l.next_date < today
                const isToday = isOpen(l) && l.next_date === today
                const sub = [l.contact, l.origin].filter(Boolean).join(' · ')
                return (
                  <div className="row" key={l.id}>
                    <div className="tx">
                      <b>
                        {l.name}{' '}
                        <em className={`pill ${st.pill}`} style={{ marginLeft: 4, verticalAlign: 'middle', fontStyle: 'normal' }}>
                          {st.label}
                        </em>
                      </b>
                      {sub && <span>{sub}</span>}
                      {(l.next_step || l.next_date) && (
                        <span style={{ color: overdue ? 'var(--danger)' : undefined, fontWeight: overdue || isToday ? 600 : undefined }}>
                          {l.next_step ?? 'Próximo passo'}
                          {l.next_date && ` · ${isToday ? 'Hoje' : overdue ? `Atrasado, ${fmtDate(l.next_date)}` : fmtDate(l.next_date)}`}
                        </span>
                      )}
                      {l.value ? <span>{brl(l.value)}</span> : null}
                    </div>
                    <div className="acts">
                      {wa && (
                        <a className="icon-btn" href={wa} target="_blank" rel="noreferrer" aria-label={`Chamar ${l.name} no WhatsApp`} title="Chamar no WhatsApp">
                          <Icon name="chat" />
                        </a>
                      )}
                      {!readOnly && next && (
                        <button
                          type="button"
                          className="icon-btn"
                          aria-label={`Avançar ${l.name} para ${stageOf(next).label}`}
                          title={`Avançar para ${stageOf(next).label}`}
                          onClick={() => void advance(l)}
                        >
                          <Icon name="arrow" />
                        </button>
                      )}
                      {!readOnly && (
                        <button type="button" className="icon-btn" aria-label={`Editar ${l.name}`} title="Editar" onClick={() => setDraft(toDraft(l))}>
                          <Icon name="edit" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {draft && !readOnly && (
        <LeadDialog
          draft={draft}
          onClose={() => setDraft(null)}
          onSaved={(row) => {
            upsert(row)
            setDraft(null)
          }}
          onDeleted={(id) => {
            setLeads((cur) => cur.filter((x) => x.id !== id))
            setDraft(null)
          }}
        />
      )}
    </div>
  )
}

function LeadDialog({
  draft,
  onClose,
  onSaved,
  onDeleted,
}: {
  draft: Draft
  onClose: () => void
  onSaved: (row: Lead) => void
  onDeleted: (id: string) => void
}) {
  const { toast } = useStore()
  const [d, setD] = useState<Draft>(draft)
  const [busy, setBusy] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const editing = !!draft.id
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((cur) => ({ ...cur, [k]: v }))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!d.name.trim() || busy) return
    setBusy(true)
    try {
      const value = num(d.value)
      const row = await api.saveLead({
        ...(d.id ? { id: d.id } : {}),
        name: d.name.trim(),
        contact: d.contact.trim() || null,
        origin: d.origin || null,
        stage: d.stage,
        next_step: d.next_step.trim() || null,
        next_date: d.next_date || null,
        value: value > 0 ? value : null,
        notes: d.notes.trim() || null,
      })
      onSaved(row)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível salvar o lead.')
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!d.id || busy) return
    setBusy(true)
    try {
      await api.deleteLead(d.id)
      onDeleted(d.id)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Não foi possível excluir o lead.')
      setBusy(false)
    }
  }

  const title = editing ? 'Editar lead' : 'Novo lead'

  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <form className="card dialog" role="dialog" aria-modal="true" aria-label={title} onSubmit={(e) => void submit(e)}>
        <h3>{title}</h3>
        <label className="field">
          <span>Nome *</span>
          <input className="input" value={d.name} placeholder="Ex.: Carla Menezes" autoFocus onChange={(e) => set('name', e.target.value)} />
        </label>
        <label className="field">
          <span>Contato</span>
          <input className="input" value={d.contact} placeholder="WhatsApp ou @ do Instagram" onChange={(e) => set('contact', e.target.value)} />
        </label>
        <div className="grid g2" style={{ marginTop: 14 }}>
          <label className="field">
            <span>Origem</span>
            <select className="select" value={d.origin} onChange={(e) => set('origin', e.target.value)}>
              {d.origin && !ORIGINS.includes(d.origin) && <option>{d.origin}</option>}
              {ORIGINS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Etapa</span>
            <select className="select" value={d.stage} onChange={(e) => set('stage', e.target.value as LeadStage)}>
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          <span>Próximo passo</span>
          <input className="input" value={d.next_step} placeholder="Ex.: Convidar para a avaliação" onChange={(e) => set('next_step', e.target.value)} />
        </label>
        <div className="grid g2" style={{ marginTop: 14 }}>
          <label className="field">
            <span>Data do próximo passo</span>
            <input className="input" type="date" value={d.next_date} onChange={(e) => set('next_date', e.target.value)} />
          </label>
          <label className="field">
            <span>Valor (R$)</span>
            <span className="affix money">
              <i>R$</i>
              <input
                className="input"
                inputMode="decimal"
                value={d.value}
                placeholder="0,00"
                onChange={(e) => set('value', e.target.value.replace(/[^\d.,]/g, ''))}
              />
            </span>
          </label>
        </div>
        <label className="field">
          <span>Anotações</span>
          <textarea
            className="textarea"
            rows={3}
            style={{ minHeight: 0 }}
            value={d.notes}
            placeholder="Objetivo, rotina, objeções, o que combinaram"
            onChange={(e) => set('notes', e.target.value)}
          />
        </label>

        {confirmDel ? (
          <>
            <p className="muted" style={{ fontSize: 14, lineHeight: 1.55, marginTop: 18 }}>
              Excluir {d.name || 'este lead'}? Isso não pode ser desfeito.
            </p>
            <div className="acts">
              <CTA variant="ghost" icon={null} onClick={() => setConfirmDel(false)}>
                Voltar
              </CTA>
              <CTA variant="danger" icon="trash" onClick={() => void remove()} disabled={busy}>
                {busy ? 'Excluindo...' : 'Confirmar exclusão'}
              </CTA>
            </div>
          </>
        ) : (
          <div className="acts">
            {editing && (
              <CTA variant="ghost danger" icon="trash" onClick={() => setConfirmDel(true)} disabled={busy}>
                Excluir
              </CTA>
            )}
            <CTA variant="ghost" icon={null} onClick={onClose}>
              Cancelar
            </CTA>
            <CTA type="submit" icon="check" disabled={busy || !d.name.trim()}>
              {busy ? 'Salvando...' : 'Salvar lead'}
            </CTA>
          </div>
        )}
      </form>
    </div>
  )
}
