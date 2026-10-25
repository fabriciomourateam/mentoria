import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { rehypeTableLabels } from '../lib/md-table-labels'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { CTA, Empty, MaterialRow, Skeleton } from '../components/ui'
import { isDone, lessonContext, materialsFor } from '../lib/derive'
import { useStore } from '../lib/store'

export function LessonPage() {
  const { id } = useParams()
  const nav = useNavigate()
  const { content, progress, saveProgress, toast } = useStore()
  if (!content) return <Skeleton rows={2} h={220} />
  const ctx = id ? lessonContext(content, id) : null
  if (!ctx)
    return (
      <Empty icon="book" title="Aula não encontrada" action={<CTA to="/trilhas">Ver trilhas</CTA>}>
        Ela pode ter sido movida ou ainda não foi publicada.
      </Empty>
    )

  const { lesson, track, siblings, index, next } = ctx
  const p = progress.get(lesson.id)
  const checked = new Set(p?.checked ?? [])
  const items = lesson.checklist ?? []
  const doneCount = items.filter((i) => checked.has(i.id)).length
  const allChecked = doneCount === items.length
  const completed = isDone(progress, lesson.id)
  const hasCheckpoint = !!lesson.checkpoint_title
  const mats = materialsFor(content, lesson.track_id, lesson.id)

  function toggle(itemId: string) {
    const n = new Set(checked)
    if (n.has(itemId)) n.delete(itemId)
    else n.add(itemId)
    const list = items.map((i) => i.id).filter((x) => n.has(x))
    // Desmarcar um item depois de concluída reabre a aula.
    void saveProgress(lesson.id, list, completed && list.length === items.length)
  }

  async function complete() {
    await saveProgress(lesson.id, [...checked], true)
    toast(hasCheckpoint ? 'Checkpoint concluído. Mandou bem.' : 'Aula concluída.')
  }

  const cpState = completed ? 'complete' : allChecked ? 'unlocked' : ''
  const cpTitle = completed
    ? hasCheckpoint
      ? lesson.checkpoint_title
      : 'Aula concluída'
    : hasCheckpoint
      ? lesson.checkpoint_title
      : 'Concluir aula'
  const cpText = completed
    ? next
      ? `Próximo passo: ${next.title}`
      : 'Você chegou ao fim do método.'
    : items.length === 0
      ? 'Leu e aplicou? Marque como concluída para seguir.'
      : allChecked
        ? 'Tudo pronto. Marque a aula como concluída.'
        : `${doneCount} de ${items.length} itens prontos. Conclua o checklist para liberar.`

  return (
    <>
      <div className="crumb r">
        <Link to="/trilhas">Trilhas</Link>
        <Icon name="chevron" />
        {track && <Link to={`/trilhas/${track.slug}`}>{track.title}</Link>}
        <Icon name="chevron" />
        <b>
          Aula {index} de {siblings.length}
        </b>
      </div>

      <div className="lg">
        <div className="bezel r" style={{ ['--i' as string]: 1 }}>
          <article className="card lb">
            <span className="tag2">
              {track?.title} · Aula {index} de {siblings.length}
            </span>
            <h1>{lesson.title}</h1>
            {lesson.objective && <p className="lead">{lesson.objective}</p>}
            <div className="sep" />

            {lesson.body_md.trim() ? (
              <div className="md">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeTableLabels]}>{lesson.body_md}</ReactMarkdown>
              </div>
            ) : (
              <div className="soon">
                <span className="chip-i">
                  <Icon name="pen" />
                </span>
                <span>
                  <b>Texto completo em produção</b>
                  O objetivo acima já mostra o que você vai entregar. {items.length ? 'Comece pelo checklist abaixo.' : ''}
                </span>
              </div>
            )}

            {items.length > 0 && (
              <>
                <h2 className="blk">{hasCheckpoint ? 'Sua entrega' : 'Checklist'}</h2>
                <p className="blk-sub">Marque cada item quando ele estiver feito de verdade.</p>
                <div className="chk">
                  {items.map((it) => {
                    const on = checked.has(it.id)
                    return (
                      <button key={it.id} className={`ci ${on ? 'done' : ''}`} onClick={() => toggle(it.id)} aria-pressed={on}>
                        <span className="bx">
                          <Icon name="check" />
                        </span>
                        <span className="t">
                          <span>{it.text}</span>
                          {it.hint && <small>{it.hint}</small>}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            <div className={`cp ${cpState}`} aria-live="polite">
              <div className="hd">
                <span className="lk">
                  <Icon name={completed ? 'check' : allChecked ? 'unlock' : 'lock'} />
                </span>
                <div>
                  <div className="ey">{hasCheckpoint ? 'Checkpoint' : 'Conclusão'}</div>
                  <h4>{cpTitle}</h4>
                  <div className="stt">{cpText}</div>
                </div>
              </div>
              <div className="acts">
                {completed ? (
                  next ? (
                    <CTA variant="light" onClick={() => nav(`/aula/${next.id}`)}>
                      Próxima aula
                    </CTA>
                  ) : (
                    <CTA variant="light" to="/">
                      Voltar ao início
                    </CTA>
                  )
                ) : (
                  <CTA icon="check" onClick={complete} disabled={!allChecked}>
                    Marcar como concluída
                  </CTA>
                )}
              </div>
            </div>
          </article>
        </div>

        <aside className="aside r" style={{ ['--i' as string]: 2 }}>
          <div className="card box">
            <div className="lbl">Materiais</div>
            {mats.length ? (
              mats.map((m) => <MaterialRow key={m.id} m={m} />)
            ) : (
              <p className="muted" style={{ fontSize: 13, paddingBottom: 8 }}>
                Esta aula não tem material extra.
              </p>
            )}
          </div>
          <div className="card box mini-nav">
            <div className="lbl">{track?.title}</div>
            {siblings.map((s, i) => {
              const ok = isDone(progress, s.id)
              return (
                <Link key={s.id} to={`/aula/${s.id}`} className={`${s.id === lesson.id ? 'cur' : ''} ${ok ? 'ok' : ''}`}>
                  <span className="d">{ok ? <Icon name="check" /> : i + 1}</span>
                  {s.title}
                </Link>
              )
            })}
          </div>
        </aside>
      </div>
    </>
  )
}
