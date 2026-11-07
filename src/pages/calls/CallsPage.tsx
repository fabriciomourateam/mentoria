import { useCallback, useEffect, useState } from 'react'
import { Icon } from '../../components/Icon'
import { CTA, Empty, Skeleton } from '../../components/ui'
import { VideoEmbed } from '../../components/VideoEmbed'
import { api } from '../../lib/api'
import { fmtDateTime } from '../../lib/dates'
import { useStore } from '../../lib/store'
import type { Call, CallQuestion } from '../../lib/types'
import { calendarUrl, isLive, pickNext, relativeDay, useNow } from './callUtils'
import './calls.css'

const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Não foi possível concluir. Tente de novo.')

function Questions({ call }: { call: Call }) {
  const { toast } = useStore()
  const [list, setList] = useState<CallQuestion[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      setList(await api.listCallQuestions(call.id))
    } catch (e) {
      toast(errMsg(e))
    }
  }, [call.id, toast])

  useEffect(() => {
    void load()
  }, [load])

  async function send() {
    if (!text.trim()) return
    setBusy(true)
    try {
      await api.askQuestion(call.id, text)
      setText('')
      toast('Dúvida enviada.')
      await load()
    } catch (e) {
      toast(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    try {
      await api.deleteQuestion(id)
      await load()
    } catch (e) {
      toast(errMsg(e))
    }
  }

  return (
    <section className="card r call-q" style={{ ['--i' as string]: 1 }}>
      <h2 className="dsp">Sua dúvida pra essa call</h2>
      <p className="muted">O Fabricio responde ao vivo. Pode mandar mais de uma.</p>
      <label className="field">
        <span>Sua pergunta</span>
        <textarea
          className="textarea"
          style={{ minHeight: 90 }}
          value={text}
          maxLength={600}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex.: Como cobrar o plano trimestral sem perder cliente?"
        />
      </label>
      <div className="call-q-act">
        <CTA icon="chat" onClick={() => void send()} disabled={busy || !text.trim()}>
          {busy ? 'Enviando...' : 'Enviar dúvida'}
        </CTA>
      </div>
      {list.length > 0 && (
        <ul className="call-qlist">
          {list.map((q) => (
            <li key={q.id}>
              <span>{q.question}</span>
              <button className="call-x" aria-label="Excluir dúvida" onClick={() => void remove(q.id)}>
                <Icon name="trash" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function NextCall({ call, now }: { call: Call; now: number }) {
  const live = isLive(call, now)
  return (
    <>
      <section className={`hero call-hero r${live ? ' is-live' : ''}`}>
        <span className="eyebrow">
          {live ? (
            <>
              <i className="call-dot" /> Ao vivo agora
            </>
          ) : (
            `Próxima call · ${relativeDay(call.starts_at, now)}`
          )}
        </span>
        <h1>{call.title}</h1>
        <div className="call-when">
          <Icon name="clock" /> {fmtDateTime(call.starts_at)} (horário de São Paulo)
        </div>
        {call.agenda && <p className="call-agenda">{call.agenda}</p>}
        <div className="actions">
          {call.meet_url ? (
            <CTA href={call.meet_url} icon="external" variant="light">
              Entrar no Meet
            </CTA>
          ) : (
            <>
              <CTA icon="external" variant="light" disabled onClick={() => {}}>
                Entrar no Meet
              </CTA>
              <span className="call-note">O link aparece aqui antes da call</span>
            </>
          )}
          <CTA href={calendarUrl(call)} icon="plus" variant="ghost">
            Adicionar à agenda
          </CTA>
        </div>
      </section>
      <Questions call={call} />
    </>
  )
}

function PastCall({ call, open, onToggle }: { call: Call; open: boolean; onToggle: () => void }) {
  return (
    <div className="card call-past r">
      <button className="call-past-h" onClick={onToggle} aria-expanded={open}>
        <span className="tx">
          <b>{call.title}</b>
          <span>{fmtDateTime(call.starts_at)}</span>
        </span>
        {call.recording_url ? <span className="pill ok">Gravação</span> : <span className="pill">Em breve</span>}
        <span className={`call-chev${open ? ' open' : ''}`}>
          <Icon name="chevron" />
        </span>
      </button>
      {open && (
        <div className="call-past-b">
          {call.agenda && <p className="muted">{call.agenda}</p>}
          {call.recording_url ? (
            <VideoEmbed url={call.recording_url} title={call.title} />
          ) : (
            <p className="muted">Gravação em breve</p>
          )}
        </div>
      )}
    </div>
  )
}

export function CallsPage() {
  const [calls, setCalls] = useState<Call[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null | undefined>(undefined)
  const now = useNow()

  const load = useCallback(async () => {
    try {
      setCalls(await api.listCalls())
      setError(null)
    } catch (e) {
      setError(errMsg(e))
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (error)
    return (
      <Empty icon="close" title="Não foi possível carregar" action={<CTA icon={null} onClick={() => void load()}>Tentar de novo</CTA>}>
        {error}
      </Empty>
    )
  if (!calls) return <Skeleton rows={3} h={120} />

  const next = pickNext(calls, now)
  const past = calls.filter((c) => c.id !== next?.id && new Date(c.starts_at).getTime() < now).sort((a, b) => b.starts_at.localeCompare(a.starts_at))
  const defaultOpen = past[0]?.id ?? null
  const opened = openId === undefined ? defaultOpen : openId

  return (
    <>
      <div className="page-title r">
        <div className="ey">Encontros</div>
        <h1>Calls ao vivo</h1>
        <p>Todo mês, uma call com toda a turma. Mande sua dúvida antes e assista a gravação depois.</p>
      </div>

      {calls.length === 0 && (
        <Empty icon="users" title="Nenhuma call marcada ainda">
          Assim que o Fabricio marcar a próxima, ela aparece aqui.
        </Empty>
      )}

      {next ? (
        <NextCall call={next} now={now} />
      ) : (
        calls.length > 0 && (
          <Empty icon="clock" title="Próxima call ainda não marcada">
            Quando o Fabricio marcar, a data aparece aqui.
          </Empty>
        )
      )}

      {past.length > 0 && (
        <section className="call-list">
          <h2 className="dsp">Calls anteriores</h2>
          <div className="stack">
            {past.map((c) => (
              <PastCall key={c.id} call={c} open={opened === c.id} onToggle={() => setOpenId(opened === c.id ? null : c.id)} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
