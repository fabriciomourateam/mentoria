import { useCallback, useEffect, useMemo, useState } from 'react'
import { Icon } from '../../components/Icon'
import { CTA, Empty, Skeleton } from '../../components/ui'
import { api } from '../../lib/api'
import { initials } from '../../lib/derive'
import { useStore } from '../../lib/store'
import type { EnrollmentStatus, StudentRow } from '../../lib/types'
import { Modal } from './AdminContent'

const TZ = 'America/Sao_Paulo'

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { timeZone: TZ })
const fmtDay = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { timeZone: TZ, day: '2-digit', month: '2-digit' })
/** AAAA-MM-DD no fuso de São Paulo, para o campo de data. */
const toInputDate = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ })
/** Fim do dia escolhido, em São Paulo, como ISO. */
const fromInputDate = (d: string) => new Date(`${d}T23:59:59-03:00`).toISOString()

const plain = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

type Filter = 'all' | 'waiting' | 'active' | 'paused' | 'canceled'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'waiting', label: 'Aguardando' },
  { id: 'active', label: 'Ativos' },
  { id: 'paused', label: 'Pausados' },
  { id: 'canceled', label: 'Cancelados' },
]

const EMPTY_TEXT: Record<Filter, string> = {
  all: 'Quando alguém criar a conta em /entrar, aparece aqui.',
  waiting: 'Ninguém aguardando liberação agora.',
  active: 'Nenhum aluno com acesso ativo.',
  paused: 'Nenhum aluno pausado.',
  canceled: 'Nenhum aluno cancelado.',
}

const filterOf = (s: StudentRow): Filter => (s.enrollment ? s.enrollment.status : 'waiting')

const isExpired = (s: StudentRow) =>
  s.enrollment?.status === 'active' && !!s.enrollment.expires_at && new Date(s.enrollment.expires_at).getTime() < Date.now()

function StatusPill({ s }: { s: StudentRow }) {
  const e = s.enrollment
  if (!e) return <span className="pill warn">Aguardando</span>
  if (isExpired(s)) return <span className="pill bad">Expirado</span>
  if (e.status === 'active') return <span className="pill ok">Ativo</span>
  if (e.status === 'paused') return <span className="pill">Pausado</span>
  return <span className="pill bad">Cancelado</span>
}

export function AdminStudents() {
  const { toast } = useStore()
  const [students, setStudents] = useState<StudentRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [editing, setEditing] = useState<StudentRow | null>(null)

  const load = useCallback(async () => {
    try {
      setStudents(await api.listStudents())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível carregar os alunos.')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: 0, waiting: 0, active: 0, paused: 0, canceled: 0 }
    for (const s of students ?? []) {
      c.all++
      c[filterOf(s)]++
    }
    return c
  }, [students])

  const shown = useMemo(() => {
    const needle = plain(q.trim())
    return (students ?? []).filter((s) => {
      if (filter !== 'all' && filterOf(s) !== filter) return false
      if (!needle) return true
      return plain(`${s.profile.full_name ?? ''} ${s.profile.email ?? ''}`).includes(needle)
    })
  }, [students, q, filter])

  async function change(s: StudentRow, status: EnrollmentStatus, expiresAt: string | null, msg: string) {
    setBusyId(s.profile.id)
    try {
      await api.setEnrollment(s.profile.id, status, expiresAt)
      toast(msg)
      await load()
      return true
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Não foi possível salvar.')
      return false
    } finally {
      setBusyId(null)
    }
  }

  if (error)
    return (
      <Empty icon="close" title="Não foi possível carregar" action={<CTA icon={null} onClick={() => void load()}>Tentar de novo</CTA>}>
        {error}
      </Empty>
    )
  if (!students) return <Skeleton rows={3} h={72} />

  return (
    <>
      <div className="note r" style={{ marginBottom: 14 }}>
        <b>Fluxo de acesso:</b> o aluno cria a conta em /entrar e aparece aqui como Aguardando. Libere para ele entrar.
      </div>

      <div className="toolbar r" style={{ ['--i' as string]: 1 }}>
        <div className="grow">
          <input
            className="input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome ou e-mail"
            aria-label="Buscar aluno"
          />
        </div>
      </div>
      <nav className="adm-tabs r" aria-label="Filtrar alunos" style={{ ['--i' as string]: 2 }}>
        {FILTERS.map((f) => (
          <a
            key={f.id}
            href="#"
            className={filter === f.id ? 'active' : ''}
            aria-current={filter === f.id ? 'true' : undefined}
            onClick={(e) => {
              e.preventDefault()
              setFilter(f.id)
            }}
          >
            {f.label} ({counts[f.id]})
          </a>
        ))}
      </nav>

      {shown.length === 0 ? (
        <Empty icon="users" title={q.trim() ? 'Ninguém encontrado' : 'Nenhum aluno aqui'}>
          {q.trim() ? 'Tente outro nome ou e-mail.' : EMPTY_TEXT[filter]}
        </Empty>
      ) : (
        <section className="card r" style={{ ['--i' as string]: 3 }}>
          {shown.map((s) => {
            const e = s.enrollment
            const active = e?.status === 'active'
            const busy = busyId === s.profile.id
            return (
              <div className="row" key={s.profile.id}>
                <span className="av" style={{ width: 36, height: 36, fontSize: 12, flexShrink: 0 }}>
                  {initials(s.profile.full_name, s.profile.email)}
                </span>
                <div className="tx">
                  <b>{s.profile.full_name || s.profile.email || 'Sem nome'}</b>
                  {s.profile.full_name && s.profile.email && <span>{s.profile.email}</span>}
                  <span>
                    Cadastro em {fmtDate(s.profile.created_at)} · {s.completedLessons}{' '}
                    {s.completedLessons === 1 ? 'aula concluída' : 'aulas concluídas'}
                    {s.lastActivity ? ` · última atividade ${fmtDay(s.lastActivity)}` : ''}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                  <StatusPill s={s} />
                  {e?.expires_at && <span className="pill">até {fmtDate(e.expires_at)}</span>}
                </div>
                <div className="acts">
                  {active ? (
                    <CTA variant="ghost" icon={null} disabled={busy} onClick={() => void change(s, 'paused', e?.expires_at ?? null, 'Acesso pausado.')}>
                      Pausar
                    </CTA>
                  ) : (
                    <CTA variant="sm" icon="check" disabled={busy} onClick={() => void change(s, 'active', e?.expires_at ?? null, 'Acesso liberado.')}>
                      Liberar acesso
                    </CTA>
                  )}
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Editar acesso de ${s.profile.full_name || s.profile.email || 'aluno'}`}
                    title="Editar acesso"
                    onClick={() => setEditing(s)}
                  >
                    <Icon name="edit" />
                  </button>
                </div>
              </div>
            )
          })}
        </section>
      )}

      {editing && (
        <AccessDialog
          student={editing}
          busy={busyId === editing.profile.id}
          onClose={() => setEditing(null)}
          onSave={async (status, expiresAt) => {
            const ok = await change(editing, status, expiresAt, 'Acesso atualizado.')
            if (ok) setEditing(null)
          }}
        />
      )}
    </>
  )
}

function AccessDialog({
  student,
  busy,
  onClose,
  onSave,
}: {
  student: StudentRow
  busy: boolean
  onClose: () => void
  onSave: (status: EnrollmentStatus, expiresAt: string | null) => Promise<void>
}) {
  const [status, setStatus] = useState<EnrollmentStatus>(student.enrollment?.status ?? 'active')
  const [date, setDate] = useState(student.enrollment?.expires_at ? toInputDate(student.enrollment.expires_at) : '')

  return (
    <Modal title="Acesso do aluno" onClose={onClose}>
      <p className="muted" style={{ fontSize: 13.5, marginBottom: 14 }}>
        {student.profile.full_name || student.profile.email}
      </p>
      <label className="field">
        <span>Status</span>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value as EnrollmentStatus)}>
          <option value="active">Ativo</option>
          <option value="paused">Pausado</option>
          <option value="canceled">Cancelado</option>
        </select>
      </label>
      <label className="field">
        <span>Acesso até (opcional)</span>
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <small>Vazio = sem data para acabar.</small>
      </label>
      <div className="acts">
        <CTA variant="ghost" icon={null} onClick={onClose}>
          Cancelar
        </CTA>
        <CTA icon="check" disabled={busy} onClick={() => void onSave(status, date ? fromInputDate(date) : null)}>
          {busy ? 'Salvando...' : 'Salvar'}
        </CTA>
      </div>
    </Modal>
  )
}
