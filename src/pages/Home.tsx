import { Link } from 'react-router-dom'
import { Icon, TRACK_ICON } from '../components/Icon'
import { CTA, Empty, ProgressBar, Skeleton } from '../components/ui'
import { firstName, lessonContext, nextCheckpoint, nextLesson, overall, sortedTracks, trackStats } from '../lib/derive'
import { useStore } from '../lib/store'

function Ring({ pct, label }: { pct: number; label: string }) {
  const r = 84
  const c = 2 * Math.PI * r
  return (
    <div className="ring" aria-hidden="true">
      <svg viewBox="0 0 188 188">
        <circle className="bg" cx="94" cy="94" r={r} />
        <circle className="fg" cx="94" cy="94" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(pct, 1.5) / 100)} />
      </svg>
      <div className="c">
        <b>{pct}%</b>
        <span>{label}</span>
      </div>
    </div>
  )
}

export function Home() {
  const { me, content, contentError, progress, reloadContent } = useStore()
  if (contentError)
    return (
      <Empty icon="sparkle" title="Não deu para carregar agora" action={<CTA onClick={reloadContent}>Tentar de novo</CTA>}>
        {contentError}
      </Empty>
    )
  if (!content) return <Skeleton />

  const name = firstName(me?.profile.full_name)
  const o = overall(content, progress)
  const next = nextLesson(content, progress)
  const ctx = next ? lessonContext(content, next.id) : null
  const milestone = nextCheckpoint(content, progress)
  const started = o.done > 0
  const tracks = sortedTracks(content)

  return (
    <>
      <section className="hero split r">
        <div>
        <span className="eyebrow">{name ? `Bom te ver, ${name}` : 'Bem-vindo'}</span>
        <h1>{started ? 'Sua consultoria online, montada passo a passo.' : 'Bem-vindo. Seu primeiro passo é rápido.'}</h1>
        <p>
          {started
            ? 'Cada aula termina em uma entrega. Marque o checklist, libere o checkpoint e siga para a próxima.'
            : 'Comece pela trilha de entrada: em poucas aulas você entende o método e faz o diagnóstico do seu negócio.'}
        </p>
        <div className="actions">
          {next ? (
            <CTA to={`/aula/${next.id}`} variant="light">
              {started ? 'Continuar' : 'Começar agora'}
            </CTA>
          ) : (
            <CTA to="/trilhas" variant="light">
              Rever as trilhas
            </CTA>
          )}
        </div>
        </div>
        <Ring pct={o.pct} label={`${o.done} de ${o.total} aulas`} />
      </section>

      <div className="grid g3 stats" style={{ marginTop: 14 }}>
        <div className="card pad st r" style={{ ['--i' as string]: 1 }}>
          <div className="k">
            <span className="chip-i">
              <Icon name="target" />
            </span>
            Progresso
          </div>
          <div className="v">{o.pct}%</div>
          <div className="d">
            {o.done} de {o.total} aulas
          </div>
        </div>
        <div className="card pad st r" style={{ ['--i' as string]: 2 }}>
          <div className="k">
            <span className="chip-i">
              <Icon name="check" />
            </span>
            Checkpoints
          </div>
          <div className="v">
            {o.checkpointsDone}
            <span className="muted" style={{ fontSize: 18 }}>
              /{o.checkpoints}
            </span>
          </div>
          <div className="d">entregas concluídas</div>
        </div>
        <div className="card pad st r" style={{ ['--i' as string]: 3 }}>
          <div className="k">
            <span className="chip-i">
              <Icon name="chart" />
            </span>
            Próximo marco
          </div>
          {milestone ? (
            <>
              <div className="v txt">{milestone.lesson.checkpoint_title}</div>
              <div className="d">{milestone.pending === 1 ? 'falta esta aula' : `faltam ${milestone.pending} aulas`}</div>
            </>
          ) : (
            <>
              <div className="v txt">Todos os checkpoints feitos</div>
              <div className="d">método completo</div>
            </>
          )}
        </div>
      </div>

      {next && ctx && (
        <>
          <div className="sh">
            <h2>Continue de onde parou</h2>
            <Link className="link" to={`/trilhas/${ctx.track?.slug}`}>
              Ver trilha
            </Link>
          </div>
          <Link to={`/aula/${next.id}`} className="card cont r" style={{ ['--i' as string]: 4 }}>
            <span className="thumb">
              <Icon name={TRACK_ICON[ctx.track?.slug ?? ''] ?? 'arrow'} />
            </span>
            <span className="body">
              <span className="tagline">
                {ctx.track?.title} · Aula {ctx.index} de {ctx.siblings.length}
              </span>
              <h4>{next.title}</h4>
              {ctx.track && <ProgressBar pct={trackStats(content, progress, ctx.track.id).pct} />}
            </span>
            <span className="go">
              <span className="btn sm">
                <span className="t">Retomar</span>
                <span className="bi">
                  <Icon name="arrow" />
                </span>
              </span>
            </span>
          </Link>
        </>
      )}

      <div className="sh">
        <h2>O caminho</h2>
        <Link className="link" to="/trilhas">
          Todas as trilhas
        </Link>
      </div>
      <div className="card r" style={{ ['--i' as string]: 5 }}>
        <div className="ll">
          {tracks.map((t) => {
            const s = trackStats(content, progress, t.id)
            const done = s.total > 0 && s.done === s.total
            const now = ctx?.track?.id === t.id
            return (
              <Link key={t.id} to={`/trilhas/${t.slug}`} className={`lr ${done ? 'done' : ''} ${now ? 'now' : ''}`}>
                <span className="n">{done ? <Icon name="check" /> : t.position}</span>
                <span className="tx">
                  <b>{t.title}</b>
                  <span>{t.checkpoint ? `Entrega: ${t.checkpoint}` : t.promise}</span>
                </span>
                {now ? <span className="pill acc">Agora</span> : <span className="pill">{s.done}/{s.total}</span>}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
