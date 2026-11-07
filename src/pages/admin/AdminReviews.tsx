import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CTA, Empty, Skeleton } from '../../components/ui'
import { api } from '../../lib/api'
import { dayBRT, fmtDay } from '../../lib/dates'
import { useStore } from '../../lib/store'
import type { CheckpointReview, StudentRow } from '../../lib/types'
import { toolsForLesson } from '../negocio/registry'
import '../review/review.css'

export function pendingCount(rows: CheckpointReview[]): number {
  return rows.filter((r) => r.status === 'pending').length
}

const d = (iso: string) => fmtDay(dayBRT(new Date(iso)), true)

function Item({ r, students, onDone }: { r: CheckpointReview; students: StudentRow[]; onDone: (r: CheckpointReview) => void }) {
  const { content, toast } = useStore()
  const [note, setNote] = useState(r.mentor_note ?? '')
  const [busy, setBusy] = useState(false)
  const st = students.find((s) => s.profile.id === r.user_id)
  const name = st?.profile.full_name || st?.profile.email || 'Aluno'
  const lesson = content?.lessons.find((l) => l.id === r.lesson_id)
  const track = lesson ? content?.tracks.find((t) => t.id === lesson.track_id) : undefined
  const tools = lesson ? toolsForLesson(track?.slug, lesson.position) : []

  async function act(status: 'approved' | 'changes') {
    setBusy(true)
    try {
      const u = await api.reviewCheckpoint(r.id, status, note.trim())
      onDone(u)
      toast(status === 'approved' ? 'Entrega aprovada.' : 'Ajustes enviados pro aluno.')
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Não foi possível salvar.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card rv-item">
      <div className="rv-top" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <h3>{name}</h3>
        {r.status === 'approved' && <span className="pill ok">Aprovado</span>}
        {r.status === 'changes' && <span className="pill warn">Ajustes pedidos</span>}
        {r.status === 'pending' && <span className="pill warn">Pendente</span>}
      </div>
      <div className="rv-meta">
        {track && <span>{track.title}</span>}
        {lesson && (
          <span>
            Aula {lesson.position}: {lesson.title}
          </span>
        )}
        {lesson?.checkpoint_title && <span>{lesson.checkpoint_title}</span>}
        <span>Enviado em {d(r.submitted_at)}</span>
        {r.reviewed_at && <span>Revisado em {d(r.reviewed_at)}</span>}
      </div>
      {r.student_note && <div className="rv-quote">{r.student_note}</div>}
      <div className="rv-links">
        {tools.map((t) => (
          <Link key={t.key} to={`/admin/alunos/${r.user_id}/${t.key}`}>
            Ver entrega: {t.title}
          </Link>
        ))}
        <Link to={`/admin/alunos/${r.user_id}`}>Ver aluno</Link>
      </div>
      <label className="field">
        <span>Seu retorno pro aluno</span>
        <textarea className="textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="rv-acts">
        <CTA icon="check" onClick={() => void act('approved')} disabled={busy}>
          Aprovar
        </CTA>
        <CTA icon="edit" variant="ghost" onClick={() => void act('changes')} disabled={busy}>
          Pedir ajustes
        </CTA>
      </div>
    </div>
  )
}

export function AdminReviews() {
  const [rows, setRows] = useState<CheckpointReview[] | null>(null)
  const [students, setStudents] = useState<StudentRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'pending' | 'done'>('pending')

  useEffect(() => {
    Promise.all([api.listReviews(), api.listStudents()])
      .then(([r, s]) => {
        setRows(r)
        setStudents(s)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Não foi possível carregar.'))
  }, [])

  const pending = useMemo(
    () => (rows ?? []).filter((r) => r.status === 'pending').sort((a, b) => a.submitted_at.localeCompare(b.submitted_at)),
    [rows],
  )
  const done = useMemo(
    () =>
      (rows ?? [])
        .filter((r) => r.status !== 'pending')
        .sort((a, b) => (b.reviewed_at ?? b.submitted_at).localeCompare(a.reviewed_at ?? a.submitted_at)),
    [rows],
  )

  if (error) return <Empty icon="close" title="Não foi possível carregar">{error}</Empty>
  if (!rows) return <Skeleton rows={3} h={140} />

  const update = (u: CheckpointReview) => setRows((cur) => (cur ?? []).map((x) => (x.id === u.id ? u : x)))
  const list = tab === 'pending' ? pending : done

  return (
    <>
      <div className="seg r">
        <button aria-pressed={tab === 'pending'} onClick={() => setTab('pending')}>
          Pendentes ({pending.length})
        </button>
        <button aria-pressed={tab === 'done'} onClick={() => setTab('done')}>
          Revisadas
        </button>
      </div>
      <div className="rv-list">
        {list.length === 0 ? (
          <Empty icon="check" title={tab === 'pending' ? 'Nenhuma entrega esperando revisão.' : 'Nenhuma entrega revisada ainda.'} />
        ) : (
          list.map((r) => <Item key={`${r.id}-${r.status}-${r.reviewed_at ?? ''}`} r={r} students={students} onDone={update} />)
        )}
      </div>
    </>
  )
}
