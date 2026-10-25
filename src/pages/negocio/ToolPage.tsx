import { useState } from 'react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../../components/Icon'
import { CTA, Empty, ProgressBar } from '../../components/ui'
import { rehypeTableLabels } from '../../lib/md-table-labels'
import { useStore } from '../../lib/store'
import { useWorkspace } from '../../lib/workspace'
import type { SaveState } from '../../lib/workspace'
import { FormTool } from './FormTool'
import { GROUPS, isReady, toolByKey } from './registry'

export function SaveBadge({ state }: { state: SaveState }) {
  if (state === 'idle') return null
  const label = state === 'saving' ? 'Salvando...' : state === 'saved' ? 'Salvo' : 'Não salvou'
  return (
    <span className={`pill ${state === 'saved' ? 'ok' : state === 'error' ? 'bad' : ''}`} aria-live="polite">
      {state === 'saved' && <Icon name="check" />}
      {label}
    </span>
  )
}

export function ToolPage() {
  const { tool: key } = useParams()
  const { content } = useStore()
  const ws = useWorkspace()
  const tool = key ? toolByKey(key) : undefined

  if (!tool || !isReady(tool))
    return (
      <Empty icon="briefcase" title="Ferramenta não encontrada" action={<CTA to="/negocio">Voltar ao Meu Negócio</CTA>}>
        Ela pode ter mudado de lugar.
      </Empty>
    )

  const group = GROUPS.find((g) => g.id === tool.group)
  const track = tool.lesson && content?.tracks.find((t) => t.slug === tool.lesson!.slug)
  const lesson = track && content?.lessons.find((l) => l.track_id === track.id && l.position === tool.lesson!.position)
  const pct = tool.type === 'guide' ? null : Math.round((tool.progress?.(ws.get, { leads: 0 }) ?? 0) * 100)

  return (
    <>
      <div className="crumb r">
        <Link to="/negocio">Meu Negócio</Link>
        <Icon name="chevron" />
        <b>{tool.title}</b>
      </div>
      <header className="tool-head r">
        <span className="tool-ico">
          <Icon name={tool.icon} />
        </span>
        <div className="tx">
          <div className="ey">{group?.title}</div>
          <h1>{tool.title}</h1>
          <p>{tool.desc}</p>
          <div className="meta">
            {tool.type !== 'guide' && tool.key !== 'leads' && <SaveBadge state={ws.state(tool.key)} />}
            {lesson && (
              <Link className="link" to={`/aula/${lesson.id}`}>
                <Icon name="book" />
                Rever a aula
              </Link>
            )}
          </div>
          {pct !== null && tool.key !== 'leads' && tool.type === 'form' && (
            <div className="tool-prog">
              <ProgressBar pct={pct} />
              <span>{pct}% preenchido</span>
            </div>
          )}
        </div>
      </header>
      {!ws.ready ? (
        <div className="sk" style={{ height: 240 }} />
      ) : tool.type === 'form' && tool.schema ? (
        <FormTool toolKey={tool.key} schema={tool.schema} />
      ) : tool.type === 'custom' && tool.Component ? (
        <tool.Component />
      ) : (
        <GuideView md={tool.guide ?? ''} />
      )}
    </>
  )
}

function CopyCard({ text }: { text: string }) {
  const [ok, setOk] = useState(false)
  return (
    <div className="msg">
      <p>{text}</p>
      <button
        type="button"
        className={`btn sm ${ok ? 'ghost' : ''}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text)
            setOk(true)
            window.setTimeout(() => setOk(false), 1800)
          } catch {
            /* sem permissão de área de transferência */
          }
        }}
      >
        <span className="t">{ok ? 'Copiado' : 'Copiar'}</span>
        <span className="bi">
          <Icon name={ok ? 'check' : 'doc'} />
        </span>
      </button>
    </div>
  )
}

const textOf = (n: ReactNode): string =>
  typeof n === 'string' ? n : Array.isArray(n) ? n.map(textOf).join('') : ''

/** Guia em Markdown. Blocos ```msg viram cartões com botão "Copiar". */
export function GuideView({ md }: { md: string }) {
  return (
    <article className="card lb r" style={{ ['--i' as string]: 1 }}>
      <div className="md">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeTableLabels]}
          components={{
            pre: ({ children }) => <>{children}</>,
            code: ({ className, children }) => {
              const text = textOf(children).replace(/\n$/, '')
              if (className?.includes('language-msg')) return <CopyCard text={text} />
              if (text.includes('\n') || className)
                return (
                  <pre className="md-pre">
                    <code>{text}</code>
                  </pre>
                )
              return <code>{children}</code>
            },
          }}
        >
          {md}
        </ReactMarkdown>
      </div>
    </article>
  )
}
