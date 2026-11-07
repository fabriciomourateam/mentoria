import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { dayBRT, fmtDay } from '../../lib/dates'
import { useStore } from '../../lib/store'
import type { CheckpointReview } from '../../lib/types'
import { CTA } from '../../components/ui'
import './review.css'

const d = (iso: string) => fmtDay(dayBRT(new Date(iso)))

export function ReviewBox({ lessonId, ready }: { lessonId: string; ready: boolean }) {
  const { toast } = useStore()
  const [row, setRow] = useState<CheckpointReview | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    api
      .listReviews()
      .then((rows) => {
        if (!alive) return
        setRow(rows.find((r) => r.lesson_id === lessonId) ?? null)
        setLoaded(true)
      })
      .catch(() => {
        if (alive) setLoaded(true)
      })
    return () => {
      alive = false
    }
  }, [lessonId])

  async function send() {
    setBusy(true)
    try {
      const r = await api.submitReview(lessonId, note.trim())
      setRow(r)
      setNote('')
      toast('Entrega enviada pro mentor.')
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Não foi possível enviar.')
    } finally {
      setBusy(false)
    }
  }

  if (!loaded) return null

  const form = (label: string, cta: string) => (
    <>
      <label className="field">
        <span>{label}</span>
        <textarea className="textarea" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      <div className="rv-acts">
        <CTA icon="mail" onClick={() => void send()} disabled={busy}>
          {cta}
        </CTA>
      </div>
    </>
  )

  if (!row) {
    if (!ready)
      return (
        <div className="rv">
          <p className="muted">Conclua o checklist pra enviar sua entrega pro mentor revisar.</p>
        </div>
      )
    return (
      <div className="rv">
        <h4>Quer o olhar do Fabricio nessa entrega?</h4>
        <p className="muted">Ele revisa e te devolve um retorno aqui mesmo.</p>
        {form('O que você quer que eu olhe? (opcional)', 'Enviar pro mentor revisar')}
      </div>
    )
  }

  if (row.status === 'pending')
    return (
      <div className="rv">
        <div className="rv-top">
          <span className="pill warn">Aguardando revisão</span>
        </div>
        <p className="muted">Enviado em {d(row.submitted_at)}. Você recebe o retorno aqui.</p>
        {row.student_note && <div className="rv-quote">{row.student_note}</div>}
      </div>
    )

  if (row.status === 'approved')
    return (
      <div className="rv ok">
        <div className="rv-top">
          <span className="pill ok">Aprovado pelo mentor</span>
        </div>
        {row.mentor_note && (
          <div className="rv-quote">
            {row.mentor_note}
            {row.reviewed_at && <small>Revisado em {d(row.reviewed_at)}</small>}
          </div>
        )}
        {!row.mentor_note && row.reviewed_at && <p className="muted">Revisado em {d(row.reviewed_at)}.</p>}
      </div>
    )

  return (
    <div className="rv warn">
      <div className="rv-top">
        <span className="pill warn">Ajustes pedidos</span>
      </div>
      {row.mentor_note && (
        <div className="rv-quote">
          {row.mentor_note}
          {row.reviewed_at && <small>Revisado em {d(row.reviewed_at)}</small>}
        </div>
      )}
      {form('Algo a comentar sobre os ajustes? (opcional)', 'Reenviar depois de ajustar')}
    </div>
  )
}
