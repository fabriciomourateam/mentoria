import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { initials, isDone, lessonsOf, nextLesson, overall, sortedTracks, trackLabel, trackStats } from '../lib/derive'
import { useStore } from '../lib/store'
import { useWorkspace } from '../lib/workspace'
import { isReady, toolByKey, toolsForLesson, TOOLS } from '../pages/negocio/registry'
import { Icon, TRACK_ICON } from './Icon'
import { ProgressBar } from './ui'

// Navegação de curso: o aluno sempre vê onde está, o que vem depois e as outras trilhas.
// A mesma lista aparece fixa à esquerda no computador e como gaveta no celular.

/** Anel de progresso da trilha, com o ícone dela no meio. */
function Ring({ pct, icon, done }: { pct: number; icon: string; done: boolean }) {
  const r = 15
  const c = 2 * Math.PI * r
  return (
    <span className={`trk-ring ${done ? 'done' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 36 36">
        <circle cx="18" cy="18" r={r} className="bg" />
        <circle cx="18" cy="18" r={r} className="fg" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <Icon name={done ? 'check' : icon} />
    </span>
  )
}

/** Descobre em que trilha/aula/ferramenta o aluno está pela URL. */
function useWhere() {
  const { content } = useStore()
  const { pathname } = useLocation()
  return useMemo(() => {
    const none = { trackId: undefined as string | undefined, lessonId: undefined as string | undefined, toolKey: undefined as string | undefined }
    if (!content) return none
    const a = matchPath('/aula/:id', pathname)
    if (a) {
      const l = content.lessons.find((x) => x.id === a.params.id)
      return { ...none, trackId: l?.track_id, lessonId: l?.id }
    }
    const t = matchPath('/trilhas/:slug', pathname)
    if (t) return { ...none, trackId: content.tracks.find((x) => x.slug === t.params.slug)?.id }
    const n = matchPath('/negocio/:tool', pathname)
    if (n) {
      const tool = toolByKey(n.params.tool ?? '')
      const tr = tool?.lesson && content.tracks.find((x) => x.slug === tool.lesson!.slug)
      const l = tr ? content.lessons.find((x) => x.track_id === tr.id && x.position === tool!.lesson!.position) : undefined
      return { trackId: tr?.id, lessonId: l?.id, toolKey: tool?.key }
    }
    return none
  }, [content, pathname])
}

export function CourseNav() {
  const { content, progress, me } = useStore()
  const ws = useWorkspace()
  const nav = useNavigate()
  const where = useWhere()
  const next = content ? nextLesson(content, progress) : null
  const focus = where.trackId ?? next?.track_id
  const [openId, setOpenId] = useState<string | undefined>(focus)
  const box = useRef<HTMLDivElement>(null)

  // Ao mudar de trilha (navegando), abre a trilha nova.
  useEffect(() => {
    setOpenId(focus)
  }, [focus])

  // Mantém a aula atual visível na lista.
  useEffect(() => {
    const el = box.current?.querySelector('.cn-l.cur, .cn-t.cur')
    if (el) {
      el.scrollIntoView({ block: 'nearest' })
    }
  }, [where.lessonId, where.toolKey, openId])

  if (!content) return <div className="cn-loading sk" style={{ height: 320, margin: 12 }} />

  const all = overall(content, progress)
  const tools = TOOLS.filter((t) => isReady(t) && t.type !== 'guide')
  const toolsStarted = ws.ready ? tools.filter((t) => (t.progress?.(ws.get, { leads: 0 }) ?? 0) > 0).length : 0

  return (
    <div className="cn" ref={box}>
      <div className="cn-prog">
        <div className="hd">
          <span>Seu progresso</span>
          <b>{all.pct}%</b>
        </div>
        <ProgressBar pct={all.pct} />
        <small>
          {all.done} de {all.total} aulas · {all.checkpointsDone}/{all.checkpoints} entregas
        </small>
        {next && (
          <Link className="cn-next" to={`/aula/${next.id}`}>
            <span className="tx">
              <span className="ey">{all.done ? 'Continuar' : 'Começar'}</span>
              <b>{next.title}</b>
            </span>
            <span className="go">
              <Icon name="arrow" />
            </span>
          </Link>
        )}
      </div>

      <nav className="cn-main" aria-label="Principal">
        <NavLink to="/" end>
          <Icon name="home" />
          Início
        </NavLink>
        <NavLink to="/negocio">
          <Icon name="briefcase" />
          Meu Negócio
          {ws.ready && tools.length > 0 && (
            <span className="ct">
              {toolsStarted}/{tools.length}
            </span>
          )}
        </NavLink>
        <NavLink to="/biblioteca">
          <Icon name="book" />
          Biblioteca
        </NavLink>
      </nav>

      <div className="cn-sec">
        <span>Trilhas</span>
        <Link to="/trilhas">Ver todas</Link>
      </div>
      <div className="cn-tracks">
        {sortedTracks(content).map((t) => {
          const s = trackStats(content, progress, t.id)
          const open = openId === t.id
          const here = where.trackId === t.id
          const done = s.total > 0 && s.done === s.total
          const lessons = lessonsOf(content, t.id)
          return (
            <div key={t.id} className={`cn-tr ${open ? 'open' : ''} ${here ? 'here' : ''}`}>
              <button className="cn-th" aria-expanded={open} onClick={() => setOpenId(open ? undefined : t.id)}>
                <Ring pct={s.pct} icon={TRACK_ICON[t.slug] ?? 'layers'} done={done} />
                <span className="tx">
                  <b>{t.title}</b>
                  <span>
                    {trackLabel(t)} · {s.done}/{s.total} aulas
                  </span>
                </span>
                <Icon name="chevron" className="cv" />
              </button>
              {open && (
                <div className="cn-body">
                  <Link to={`/trilhas/${t.slug}`} className={`cn-ov ${here && !where.lessonId && !where.toolKey ? 'cur' : ''}`}>
                    <Icon name="layers" />
                    Visão geral da trilha
                  </Link>
                  <ol>
                    {lessons.map((l, i) => {
                      const ok = isDone(progress, l.id)
                      const cur = where.lessonId === l.id && !where.toolKey
                      const isNext = next?.id === l.id
                      const lt = toolsForLesson(t.slug, l.position)
                      return (
                        <li key={l.id}>
                          <Link to={`/aula/${l.id}`} className={`cn-l ${cur ? 'cur' : ''} ${ok ? 'ok' : ''} ${isNext ? 'nx' : ''}`} aria-current={cur ? 'page' : undefined}>
                            <span className="d">{ok ? <Icon name="check" /> : i + 1}</span>
                            <span className="t">{l.title}</span>
                            {l.checkpoint_title && (
                              <span className="flag" title={`Entrega: ${l.checkpoint_title}`}>
                                <Icon name="target" />
                              </span>
                            )}
                          </Link>
                          {lt.map((tool) => (
                            <Link key={tool.key} to={`/negocio/${tool.key}`} className={`cn-t ${where.toolKey === tool.key ? 'cur' : ''}`}>
                              <Icon name={tool.icon} />
                              <span>{tool.title}</span>
                            </Link>
                          ))}
                        </li>
                      )
                    })}
                  </ol>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {me && (
        <div className="cn-foot">
          <span className="av sm">{initials(me.profile.full_name, me.profile.email)}</span>
          <span className="who">
            <b>{me.profile.full_name || 'Sua conta'}</b>
            <span>{me.profile.email}</span>
          </span>
          {me.isAdmin && (
            <Link className="icon-btn" to="/admin" title="Painel do gestor" aria-label="Painel do gestor">
              <Icon name="settings" />
            </Link>
          )}
          <button
            className="icon-btn"
            title="Sair"
            aria-label="Sair"
            onClick={async () => {
              await api.signOut()
              nav('/entrar', { replace: true })
            }}
          >
            <Icon name="logout" />
          </button>
        </div>
      )}
    </div>
  )
}
