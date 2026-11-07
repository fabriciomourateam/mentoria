import { useCallback, useEffect, useMemo, useState } from 'react'
import { Icon } from '../../components/Icon'
import { CTA, Empty, Skeleton } from '../../components/ui'
import { parseVideo } from '../../components/VideoEmbed'
import { api } from '../../lib/api'
import { brtToIso, dayBRT, fmtDateTime, isoToBrt } from '../../lib/dates'
import { useStore } from '../../lib/store'
import type { Call, CallQuestion, StudentRow } from '../../lib/types'
import '../calls/calls.css'
import './admin-calls.css'

const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Não foi possível concluir. Tente de novo.')

interface Form {
  id?: string
  title: string
  day: string
  time: string
  meet: string
  rec: string
  agenda: string
}

const blank = (): Form => ({ title: 'Call mensal', day: dayBRT(), time: '20:00', meet: '', rec: '', agenda: '' })

function CallForm({ initial, onCancel, onSaved }: { initial: Form; onCancel: () => void; onSaved: () => void }) {
  const { toast } = useStore()
  const [f, setF] = useState<Form>(initial)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const set = (k: keyof Form, v: string) => setF((p) => ({ ...p, [k]: v }))

  async function save() {
    if (!f.title.trim()) return setErr('Dê um título pra call.')
    if (!f.day || !f.time) return setErr('Informe a data e a hora.')
    if (f.rec.trim() && !parseVideo(f.rec)) return setErr('Link da gravação inválido. Use YouTube, Vimeo, Panda, Bunny ou .mp4.')
    if (f.meet.trim() && !/^https:\/\//i.test(f.meet.trim())) return setErr('O link do Meet precisa começar com https://')
    setErr(null)
    setBusy(true)
    try {
      await api.saveCall({
        ...(f.id ? { id: f.id } : {}),
        title: f.title.trim(),
        starts_at: brtToIso(f.day, f.time),
        meet_url: f.meet.trim() || null,
        recording_url: f.rec.trim() || null,
        agenda: f.agenda.trim() || null,
      })
      toast(f.id ? 'Call atualizada.' : 'Call criada.')
      onSaved()
    } catch (e) {
      setErr(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card r ac-form">
      <h2 className="dsp">{f.id ? 'Editar call' : 'Nova call'}</h2>
      <label className="field">
        <span>Título</span>
        <input className="input" value={f.title} maxLength={90} onChange={(e) => set('title', e.target.value)} />
      </label>
      <div className="ac-two">
        <label className="field">
          <span>Data</span>
          <input className="input" type="date" value={f.day} onChange={(e) => set('day', e.target.value)} />
        </label>
        <label className="field">
          <span>Hora (São Paulo)</span>
          <input className="input" type="time" value={f.time} onChange={(e) => set('time', e.target.value)} />
        </label>
      </div>
      <label className="field">
        <span>Link do Meet</span>
        <input className="input" value={f.meet} onChange={(e) => set('meet', e.target.value)} placeholder="https://meet.google.com/..." autoCapitalize="none" spellCheck={false} />
      </label>
      <label className="field">
        <span>Link da gravação</span>
        <input className="input" value={f.rec} onChange={(e) => set('rec', e.target.value)} placeholder="https://youtu.be/..." autoCapitalize="none" spellCheck={false} />
        <small>Cole aqui o link do YouTube não listado depois da call</small>
      </label>
      <label className="field">
        <span>Pauta</span>
        <textarea className="textarea" style={{ minHeight: 90 }} value={f.agenda} onChange={(e) => set('agenda', e.target.value)} placeholder="O que vai rolar na call." />
      </label>
      {err && <p className="ac-err">{err}</p>}
      <div className="ac-acts">
        <CTA variant="ghost" icon={null} onClick={onCancel}>
          Cancelar
        </CTA>
        <CTA icon="check" onClick={() => void save()} disabled={busy}>
          {busy ? 'Salvando...' : 'Salvar'}
        </CTA>
      </div>
    </section>
  )
}

export function AdminCalls() {
  const { toast } = useStore()
  const [calls, setCalls] = useState<Call[] | null>(null)
  const [questions, setQuestions] = useState<CallQuestion[]>([])
  const [students, setStudents] = useState<StudentRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Form | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [openQ, setOpenQ] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const [c, q, s] = await Promise.all([api.listCalls(), api.listCallQuestions(), api.listStudents().catch(() => [] as StudentRow[])])
      setCalls(c)
      setQuestions(q)
      setStudents(s)
      setError(null)
    } catch (e) {
      setError(errMsg(e))
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const names = useMemo(() => {
    const m = new Map<string, string>()
    students.forEach((s) => m.set(s.profile.id, s.profile.full_name || s.profile.email || 'Aluno'))
    return m
  }, [students])

  async function removeCall(id: string) {
    try {
      await api.deleteCall(id)
      toast('Call excluída.')
      setConfirmId(null)
      await load()
    } catch (e) {
      toast(errMsg(e))
    }
  }

  async function removeQuestion(id: string) {
    try {
      await api.deleteQuestion(id)
      await load()
    } catch (e) {
      toast(errMsg(e))
    }
  }

  function edit(c: Call) {
    const { day, time } = isoToBrt(c.starts_at)
    setForm({ id: c.id, title: c.title, day, time, meet: c.meet_url ?? '', rec: c.recording_url ?? '', agenda: c.agenda ?? '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (error)
    return (
      <Empty icon="close" title="Não foi possível carregar" action={<CTA icon={null} onClick={() => void load()}>Tentar de novo</CTA>}>
        {error}
      </Empty>
    )
  if (!calls) return <Skeleton rows={3} h={100} />

  const nowMs = Number(new Date())
  const upcoming = calls.filter((c) => new Date(c.starts_at).getTime() >= nowMs - 120 * 60_000)
  const past = calls.filter((c) => !upcoming.includes(c)).reverse()

  const renderCall = (c: Call, isPast: boolean) => {
    const qs = questions.filter((q) => q.call_id === c.id)
    const open = openQ === c.id
    return (
      <div key={c.id} className="ac-item">
        <div className="ac-main">
          <div className="tx">
            <b>{c.title}</b>
            <span>{fmtDateTime(c.starts_at)}</span>
            <div className="ac-pills">
              <span className={`pill ${c.meet_url ? 'ok' : ''}`}>{c.meet_url ? 'Com link do Meet' : 'Sem link'}</span>
              <span className={`pill ${c.recording_url ? 'ok' : isPast ? 'warn' : ''}`}>{c.recording_url ? 'Gravação publicada' : 'Sem gravação'}</span>
              <span className="pill">
                {qs.length} {qs.length === 1 ? 'dúvida' : 'dúvidas'}
              </span>
            </div>
          </div>
          {confirmId === c.id ? (
            <div className="ac-acts">
              <CTA variant="ghost sm" icon={null} onClick={() => setConfirmId(null)}>
                Cancelar
              </CTA>
              <CTA variant="danger sm" icon="trash" onClick={() => void removeCall(c.id)}>
                Confirmar
              </CTA>
            </div>
          ) : (
            <div className="ac-acts">
              <CTA variant="ghost sm" icon="edit" onClick={() => edit(c)}>
                Editar
              </CTA>
              <CTA variant="ghost sm" icon="trash" onClick={() => setConfirmId(c.id)}>
                Excluir
              </CTA>
            </div>
          )}
        </div>
        <button className="ac-toggle" aria-expanded={open} onClick={() => setOpenQ(open ? null : c.id)}>
          <span className={`ac-chev${open ? ' open' : ''}`}>
            <Icon name="chevron" />
          </span>
          Dúvidas da turma ({qs.length})
        </button>
        {open && (
          <ul className="ac-qs">
            {qs.length === 0 && <li className="muted">Ninguém mandou dúvida ainda.</li>}
            {qs.map((q) => (
              <li key={q.id}>
                <div>
                  <b>{names.get(q.user_id) ?? 'Aluno'}</b>
                  <small>{fmtDateTime(q.created_at)}</small>
                  <p>{q.question}</p>
                </div>
                <button className="call-x" aria-label="Excluir dúvida" onClick={() => void removeQuestion(q.id)}>
                  <Icon name="trash" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="toolbar r">
        <h2 className="dsp grow" style={{ fontSize: 19 }}>
          Calls ao vivo
        </h2>
        {!form && (
          <CTA icon="plus" variant="sm" onClick={() => setForm(blank())}>
            Nova call
          </CTA>
        )}
      </div>

      {form && (
        <CallForm
          key={form.id ?? 'new'}
          initial={form}
          onCancel={() => setForm(null)}
          onSaved={() => {
            setForm(null)
            void load()
          }}
        />
      )}

      {calls.length === 0 && !form && (
        <Empty icon="users" title="Nenhuma call ainda">
          Crie a próxima call e cole o link do Meet.
        </Empty>
      )}

      {upcoming.length > 0 && (
        <section className="card ac-sec r">
          <h3 className="ac-h">Próximas</h3>
          {upcoming.map((c) => renderCall(c, false))}
        </section>
      )}
      {past.length > 0 && (
        <section className="card ac-sec r">
          <h3 className="ac-h">Anteriores</h3>
          {past.map((c) => renderCall(c, true))}
        </section>
      )}
    </>
  )
}
