import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../../components/Icon'
import { CTA, Empty, ProgressBar, Skeleton } from '../../components/ui'
import { api } from '../../lib/api'
import { initials, lessonsOf, sortedTracks } from '../../lib/derive'
import { useStore } from '../../lib/store'
import type { Progress, StudentRow } from '../../lib/types'
import { useWorkspace, WorkspaceProvider } from '../../lib/workspace'
import { FormTool } from '../negocio/FormTool'
import { GROUPS, isReady, toolByKey, TOOLS } from '../negocio/registry'

const fmt = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : ''

/** Visão do mentor: progresso nas aulas e o "Meu Negócio" do aluno, somente leitura. */
export function AdminStudentView() {
  const { id = '', tool } = useParams()
  const [student, setStudent] = useState<StudentRow | null | undefined>(undefined)

  useEffect(() => {
    let alive = true
    api
      .listStudents()
      .then((rows) => alive && setStudent(rows.find((r) => r.profile.id === id) ?? null))
      .catch(() => alive && setStudent(null))
    return () => {
      alive = false
    }
  }, [id])

  if (student === undefined) return <Skeleton rows={2} />
  if (!student)
    return (
      <Empty icon="users" title="Aluno não encontrado" action={<CTA to="/admin/alunos">Voltar para Alunos</CTA>}>
        Ele pode ter sido removido.
      </Empty>
    )

  const name = student.profile.full_name || student.profile.email || 'Aluno'
  return (
    <WorkspaceProvider userId={id}>
      <div className="crumb r">
        <Link to="/admin/alunos">Alunos</Link>
        <Icon name="chevron" />
        {tool ? <Link to={`/admin/alunos/${id}`}>{name}</Link> : <b>{name}</b>}
        {tool && (
          <>
            <Icon name="chevron" />
            <b>{toolByKey(tool)?.title ?? 'Ferramenta'}</b>
          </>
        )}
      </div>
      {tool ? <ToolReadOnly toolKey={tool} /> : <Overview student={student} />}
    </WorkspaceProvider>
  )
}

function Overview({ student }: { student: StudentRow }) {
  const { content } = useStore()
  const ws = useWorkspace()
  const id = student.profile.id
  const [progress, setProgress] = useState<Map<string, Progress> | null>(null)
  const [leads, setLeads] = useState(0)

  useEffect(() => {
    api
      .listProgress(id)
      .then((p) => setProgress(new Map(p.map((x) => [x.lesson_id, x]))))
      .catch(() => setProgress(new Map()))
    api
      .listLeads(id)
      .then((l) => setLeads(l.length))
      .catch(() => setLeads(0))
  }, [id])

  const e = student.enrollment
  const tools = TOOLS.filter((t) => isReady(t) && t.type !== 'guide')

  return (
    <>
      <section className="card r" style={{ padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <span className="av" style={{ width: 48, height: 48, fontSize: 15, borderRadius: 15 }}>
          {initials(student.profile.full_name, student.profile.email)}
        </span>
        <div style={{ flex: 1, minWidth: 180 }}>
          <b className="dsp" style={{ fontSize: 19, display: 'block' }}>
            {student.profile.full_name || 'Sem nome'}
          </b>
          <span className="muted" style={{ fontSize: 13, wordBreak: 'break-all' }}>
            {student.profile.email}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className={`pill ${e?.status === 'active' ? 'ok' : e ? 'warn' : ''}`}>
            {e?.status === 'active' ? 'Ativo' : e?.status === 'paused' ? 'Pausado' : e?.status === 'canceled' ? 'Cancelado' : 'Aguardando'}
          </span>
          <span className="pill">Desde {fmt(student.profile.created_at)}</span>
          {student.lastActivity && <span className="pill acc">Última atividade {fmt(student.lastActivity)}</span>}
        </div>
      </section>

      <div className="sh">
        <h2>Progresso nas trilhas</h2>
        <span className="muted" style={{ fontSize: 13 }}>
          {student.completedLessons} aulas concluídas
        </span>
      </div>
      {!content || !progress ? (
        <div className="sk" style={{ height: 160 }} />
      ) : (
        <div className="card r" style={{ ['--i' as string]: 1 }}>
          {sortedTracks(content).map((t) => {
            const ls = lessonsOf(content, t.id)
            const done = ls.filter((l) => progress.get(l.id)?.completed_at).length
            const cp = ls.find((l) => l.checkpoint_title)
            const cpDone = cp ? !!progress.get(cp.id)?.completed_at : false
            return (
              <div className="row" key={t.id}>
                <div className="tx">
                  <b>{t.title}</b>
                  <span>
                    {done} de {ls.length} aulas{cp ? ` · checkpoint ${cpDone ? 'entregue' : 'pendente'}` : ''}
                  </span>
                  <div style={{ marginTop: 8, maxWidth: 320 }}>
                    <ProgressBar pct={ls.length ? Math.round((done / ls.length) * 100) : 0} />
                  </div>
                </div>
                {cp && <span className={`pill ${cpDone ? 'ok' : ''}`}>{cpDone ? 'Entregue' : 'Pendente'}</span>}
              </div>
            )
          })}
        </div>
      )}

      <div className="sh">
        <h2>Meu Negócio do aluno</h2>
        <span className="muted" style={{ fontSize: 13 }}>
          Somente leitura
        </span>
      </div>
      {!ws.ready ? (
        <div className="sk" style={{ height: 200 }} />
      ) : (
        GROUPS.filter((g) => g.id !== 'consulta').map((g) => {
          const items = tools.filter((t) => t.group === g.id)
          if (!items.length) return null
          return (
            <section key={g.id} className="card r" style={{ marginBottom: 12 }}>
              <div className="row">
                <div className="tx">
                  <b className="dsp">{g.title}</b>
                </div>
              </div>
              {items.map((t) => {
                const p = Math.round(Math.min(1, t.progress?.(ws.get, { leads }) ?? 0) * 100)
                const when = ws.updatedAt(t.key)
                return (
                  <Link key={t.key} className="row" to={`/admin/alunos/${student.profile.id}/${t.key}`}>
                    <span className="chip-i">
                      <Icon name={t.icon} />
                    </span>
                    <div className="tx">
                      <b>{t.title}</b>
                      <span>{when ? `Atualizado em ${fmt(when)}` : t.key === 'leads' ? `${leads} leads` : 'Ainda não preenchido'}</span>
                    </div>
                    <span className={`pill ${p >= 100 ? 'ok' : p > 0 ? 'acc' : ''}`}>{p >= 100 ? 'Pronto' : `${p}%`}</span>
                  </Link>
                )
              })}
            </section>
          )
        })
      )}
    </>
  )
}

function ToolReadOnly({ toolKey }: { toolKey: string }) {
  const ws = useWorkspace()
  const tool = toolByKey(toolKey)
  if (!tool || !isReady(tool) || tool.type === 'guide')
    return <Empty icon="briefcase" title="Ferramenta não encontrada" />
  return (
    <>
      <header className="tool-head r">
        <span className="tool-ico">
          <Icon name={tool.icon} />
        </span>
        <div className="tx">
          <div className="ey">Visão do mentor · somente leitura</div>
          <h1>{tool.title}</h1>
          <p>{tool.desc}</p>
        </div>
      </header>
      {!ws.ready ? (
        <div className="sk" style={{ height: 240 }} />
      ) : tool.type === 'form' && tool.schema ? (
        <FormTool toolKey={tool.key} schema={tool.schema} />
      ) : tool.Component ? (
        <tool.Component />
      ) : null}
    </>
  )
}
