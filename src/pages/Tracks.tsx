import { Link, useParams } from 'react-router-dom'
import { Icon, TRACK_ICON } from '../components/Icon'
import { CTA, Empty, MaterialRow, ProgressBar, Skeleton } from '../components/ui'
import { isDone, lessonsOf, materialsFor, nextLesson, sortedTracks, trackLabel, trackStats } from '../lib/derive'
import { useStore } from '../lib/store'

export function Tracks() {
  const { content, progress } = useStore()
  if (!content) return <Skeleton rows={4} h={160} />
  const tracks = sortedTracks(content)
  const next = nextLesson(content, progress)
  const currentId = next?.track_id

  return (
    <>
      <div className="page-title r">
        <div className="ey">Trilhas de execução</div>
        <h1>Do primeiro passo à consultoria organizada.</h1>
        <p>A ordem é a recomendada: primeiro a oferta, depois vender, depois captar. Cada trilha fecha com uma entrega sua.</p>
      </div>
      {tracks.length === 0 ? (
        <Empty icon="layers" title="Nenhuma trilha publicada ainda">
          Assim que a primeira trilha for publicada, ela aparece aqui.
        </Empty>
      ) : (
        <div className="grid g2">
          {tracks.map((t, i) => {
            const s = trackStats(content, progress, t.id)
            const feat = t.id === currentId
            const done = s.total > 0 && s.done === s.total
            return (
              <Link key={t.id} to={`/trilhas/${t.slug}`} className={`card tc r ${feat ? 'feat' : ''}`} style={{ ['--i' as string]: i }}>
                <span className="top2">
                  <span className="pi">
                    <Icon name={TRACK_ICON[t.slug] ?? 'layers'} />
                  </span>
                  <span className="stt">{feat ? 'Você está aqui' : done ? 'Concluída' : trackLabel(t)}</span>
                </span>
                <h3>{t.title}</h3>
                <p>{t.promise}</p>
                <span className="pb">
                  <ProgressBar pct={s.pct} />
                  <span className="n">
                    {s.done}/{s.total}
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

export function TrackPage() {
  const { slug } = useParams()
  const { content, progress } = useStore()
  if (!content) return <Skeleton rows={3} />
  const t = content.tracks.find((x) => x.slug === slug)
  if (!t)
    return (
      <Empty icon="layers" title="Trilha não encontrada" action={<CTA to="/trilhas">Ver trilhas</CTA>}>
        Ela pode ter sido renomeada ou ainda não foi publicada.
      </Empty>
    )

  const lessons = lessonsOf(content, t.id)
  const s = trackStats(content, progress, t.id)
  const firstOpen = lessons.find((l) => !isDone(progress, l.id))
  const mats = materialsFor(content, t.id)

  return (
    <>
      <div className="crumb r">
        <Link to="/trilhas">Trilhas</Link>
        <Icon name="chevron" />
        <b>{t.title}</b>
      </div>
      <section className="hero th r">
        <span className="eyebrow">
          <Icon name={TRACK_ICON[t.slug] ?? 'layers'} />
          {trackLabel(t)}
        </span>
        <h1>{t.title}</h1>
        {t.promise && <p>{t.promise}</p>}
        <div className="meta">
          <span>
            <Icon name="book" />
            {lessons.length} aulas
          </span>
          {t.checkpoint && (
            <span>
              <Icon name="target" />
              Entrega: {t.checkpoint}
            </span>
          )}
          <span>
            <Icon name="check" />
            {s.pct}% concluída
          </span>
        </div>
        {firstOpen && (
          <div className="actions">
            <CTA to={`/aula/${firstOpen.id}`} variant="light">
              {s.done ? 'Continuar trilha' : 'Começar trilha'}
            </CTA>
          </div>
        )}
      </section>

      <div className="lg" style={{ marginTop: 14 }}>
        <div className="card r" style={{ ['--i' as string]: 1 }}>
          {lessons.length === 0 ? (
            <div className="empty">
              <h3>Aulas a caminho</h3>
              <p>As aulas desta trilha estão sendo finalizadas.</p>
            </div>
          ) : (
            <div className="ll">
              {lessons.map((l, i) => {
                const done = isDone(progress, l.id)
                const now = firstOpen?.id === l.id
                return (
                  <Link key={l.id} to={`/aula/${l.id}`} className={`lr ${done ? 'done' : ''} ${now ? 'now' : ''}`}>
                    <span className="n">{done ? <Icon name="check" /> : i + 1}</span>
                    <span className="tx">
                      <b>{l.title}</b>
                      {l.objective && <span>{l.objective}</span>}
                    </span>
                    {l.checkpoint_title && (
                      <span className="pill acc" title={`Checkpoint: ${l.checkpoint_title}`}>
                        <Icon name="target" />
                        Checkpoint
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
        <aside className="aside r" style={{ ['--i' as string]: 2 }}>
          <div className="card box">
            <div className="lbl">Materiais da trilha</div>
            {mats.length ? mats.map((m) => <MaterialRow key={m.id} m={m} />) : <p className="muted" style={{ fontSize: 13, paddingBottom: 8 }}>Sem materiais nesta trilha.</p>}
          </div>
        </aside>
      </div>
    </>
  )
}
