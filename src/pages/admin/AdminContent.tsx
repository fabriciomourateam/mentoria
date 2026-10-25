import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Icon, KIND_ICON, KIND_LABEL, TRACK_ICON } from '../../components/Icon'
import { CTA, Empty, Skeleton } from '../../components/ui'
import { api } from '../../lib/api'
import { trackLabel } from '../../lib/derive'
import { useStore } from '../../lib/store'
import { rehypeTableLabels } from '../../lib/md-table-labels'
import { ImportMaterials } from './ImportMaterials'
import type { ChecklistItem, Lesson, Material, MaterialKind, Track } from '../../lib/types'

/* ---------- helpers ---------- */

const errMsg = (e: unknown) => (e instanceof Error ? e.message : 'Não foi possível concluir. Tente de novo.')

const byPosition = <T extends { position: number }>(list: T[]) => [...list].sort((a, b) => a.position - b.position)

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// O CTA aceita uma variante por vez; o CSS combina as duas classes (.btn.ghost.sm).
const SM_GHOST = 'ghost sm'

const newItemId = () => 'i' + Math.random().toString(36).slice(2, 8)

function fileName(path: string | null): string {
  if (!path) return ''
  return path.split('/').pop() ?? path
}

/** Modal simples: Escape e clique no fundo fecham. */
export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div
      className="overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="card dialog" role="dialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  )
}

function ConfirmDialog({
  title,
  children,
  confirmLabel,
  busy,
  onConfirm,
  onClose,
}: {
  title: string
  children: ReactNode
  confirmLabel: string
  busy: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="muted" style={{ fontSize: 14, lineHeight: 1.55 }}>
        {children}
      </p>
      <div className="acts">
        <CTA variant="ghost" icon={null} onClick={onClose}>
          Cancelar
        </CTA>
        <CTA variant="danger" icon="trash" onClick={onConfirm} disabled={busy}>
          {busy ? 'Excluindo...' : confirmLabel}
        </CTA>
      </div>
    </Modal>
  )
}

/** Troca a posição de um item com o vizinho (dir -1 sobe, +1 desce). */
async function swapPositions<T extends { id: string; position: number }>(
  sorted: T[],
  index: number,
  dir: -1 | 1,
  save: (id: string, position: number) => Promise<unknown>,
) {
  const a = sorted[index]
  const b = sorted[index + dir]
  if (!a || !b) return
  let pa = b.position
  let pb = a.position
  if (pa === pb) {
    // posições repetidas: força uma ordem distinta
    pa = b.position + dir
    pb = a.position
  }
  await Promise.all([save(a.id, pa), save(b.id, pb)])
}

/* ---------- lista ---------- */

export function AdminContent() {
  const { reloadContent, toast } = useStore()
  const [tracks, setTracks] = useState<Track[] | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const [t, l] = await Promise.all([api.listTracks(), api.listLessons()])
      setTracks(byPosition(t))
      setLessons(l)
      setError(null)
    } catch (e) {
      setError(errMsg(e))
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function move(kind: 'track' | 'lesson', sorted: (Track | Lesson)[], index: number, dir: -1 | 1) {
    setBusy(true)
    try {
      await swapPositions(sorted, index, dir, (id, position) =>
        kind === 'track'
          ? api.saveTrack({ ...(sorted.find((x) => x.id === id) as Track), position })
          : api.saveLesson({ ...(sorted.find((x) => x.id === id) as Lesson), position }),
      )
      await load()
      await reloadContent()
    } catch (e) {
      toast(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  if (error)
    return (
      <Empty icon="close" title="Não foi possível carregar" action={<CTA icon={null} onClick={() => void load()}>Tentar de novo</CTA>}>
        {error}
      </Empty>
    )
  if (!tracks) return <Skeleton rows={3} h={120} />

  return (
    <>
      <ImportMaterials />
      <div className="toolbar r">
        <h2 className="dsp grow" style={{ fontSize: 19 }}>
          Trilhas e aulas
        </h2>
        <CTA to="/admin/conteudo/trilha/nova" icon="plus" variant="sm">
          Nova trilha
        </CTA>
      </div>

      {tracks.length === 0 ? (
        <Empty
          icon="layers"
          title="Nenhuma trilha ainda"
          action={
            <CTA to="/admin/conteudo/trilha/nova" icon="plus">
              Criar a primeira trilha
            </CTA>
          }
        >
          Comece criando uma trilha e depois adicione as aulas.
        </Empty>
      ) : (
        <div className="stack">
          {tracks.map((t, ti) => {
            const ls = byPosition(lessons.filter((l) => l.track_id === t.id))
            return (
              <section key={t.id} className="card r" style={{ ['--i' as string]: ti }}>
                <div className="row">
                  <span className="chip-i">
                    <Icon name={TRACK_ICON[t.slug] ?? 'layers'} />
                  </span>
                  <div className="tx">
                    <b>{t.title}</b>
                    <span>
                      {trackLabel(t)} · {ls.length} {ls.length === 1 ? 'aula' : 'aulas'}
                    </span>
                  </div>
                  {!t.published && <span className="pill warn">Rascunho</span>}
                  <div className="acts">
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label="Subir trilha"
                      title="Subir"
                      disabled={busy || ti === 0}
                      onClick={() => void move('track', tracks, ti, -1)}
                    >
                      <Icon name="up" />
                    </button>
                    <button
                      type="button"
                      className="icon-btn"
                      aria-label="Descer trilha"
                      title="Descer"
                      disabled={busy || ti === tracks.length - 1}
                      onClick={() => void move('track', tracks, ti, 1)}
                    >
                      <Icon name="down" />
                    </button>
                    <Link className="icon-btn" to={`/admin/conteudo/trilha/${t.id}`} aria-label={`Editar trilha ${t.title}`} title="Editar trilha">
                      <Icon name="edit" />
                    </Link>
                  </div>
                </div>

                {ls.map((l, li) => (
                  <div className="row" key={l.id} style={{ paddingLeft: 24 }}>
                    <span className="pill" style={{ minWidth: 28, justifyContent: 'center' }}>
                      {li + 1}
                    </span>
                    <div className="tx">
                      <b>{l.title}</b>
                      {l.objective && <span>{l.objective}</span>}
                    </div>
                    {l.checkpoint_title && <span className="pill acc">Checkpoint</span>}
                    {!l.body_md.trim() && <span className="pill">Sem texto</span>}
                    {!l.published && <span className="pill warn">Rascunho</span>}
                    <div className="acts">
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Subir aula"
                        title="Subir"
                        disabled={busy || li === 0}
                        onClick={() => void move('lesson', ls, li, -1)}
                      >
                        <Icon name="up" />
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="Descer aula"
                        title="Descer"
                        disabled={busy || li === ls.length - 1}
                        onClick={() => void move('lesson', ls, li, 1)}
                      >
                        <Icon name="down" />
                      </button>
                      <Link className="icon-btn" to={`/admin/conteudo/aula/${l.id}`} aria-label={`Editar aula ${l.title}`} title="Editar aula">
                        <Icon name="edit" />
                      </Link>
                    </div>
                  </div>
                ))}

                <div className="row">
                  <CTA to={`/admin/conteudo/aula/nova?trilha=${t.id}`} icon="plus" variant={SM_GHOST}>
                    Adicionar aula
                  </CTA>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </>
  )
}

/* ---------- editar trilha ---------- */

interface TrackData {
  tracks: Track[]
  lessons: Lesson[]
  materials: Material[]
}

export function AdminTrackEdit() {
  const { trackId } = useParams()
  const isNew = trackId === 'nova'
  const [data, setData] = useState<TrackData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const [tracks, lessons, materials] = await Promise.all([api.listTracks(), api.listLessons(), api.listMaterials()])
      setData({ tracks, lessons, materials })
      setError(null)
    } catch (e) {
      setError(errMsg(e))
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load, trackId])

  if (error)
    return (
      <Empty icon="close" title="Não foi possível carregar" action={<CTA icon={null} onClick={() => void load()}>Tentar de novo</CTA>}>
        {error}
      </Empty>
    )
  if (!data) return <Skeleton rows={2} h={160} />

  const track = isNew ? null : (data.tracks.find((t) => t.id === trackId) ?? null)
  if (!isNew && !track)
    return (
      <Empty icon="layers" title="Trilha não encontrada" action={<CTA to="/admin/conteudo">Voltar ao conteúdo</CTA>}>
        Ela pode ter sido excluída.
      </Empty>
    )

  return <TrackForm key={track?.id ?? 'nova'} track={track} data={data} reload={load} />
}

function TrackForm({ track, data, reload }: { track: Track | null; data: TrackData; reload: () => Promise<void> }) {
  const nav = useNavigate()
  const { reloadContent, toast } = useStore()
  const [title, setTitle] = useState(track?.title ?? '')
  const [slug, setSlug] = useState(track?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!track)
  const [promise, setPromise] = useState(track?.promise ?? '')
  const [checkpoint, setCheckpoint] = useState(track?.checkpoint ?? '')
  const [isEntry, setIsEntry] = useState(track?.is_entry ?? false)
  const [published, setPublished] = useState(track?.published ?? true)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [confirmDel, setConfirmDel] = useState(false)
  const [matDialog, setMatDialog] = useState<Material | 'new' | null>(null)
  const [matDel, setMatDel] = useState<Material | null>(null)

  const trackLessons = useMemo(
    () => (track ? byPosition(data.lessons.filter((l) => l.track_id === track.id)) : []),
    [data.lessons, track],
  )
  const materials = useMemo(() => {
    if (!track) return []
    const ids = new Set(trackLessons.map((l) => l.id))
    return byPosition(data.materials.filter((m) => m.track_id === track.id || (m.lesson_id && ids.has(m.lesson_id))))
  }, [data.materials, track, trackLessons])

  function onTitle(v: string) {
    setTitle(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  async function save() {
    setErr(null)
    const t = title.trim()
    const s = slugify(slug)
    if (!t) return setErr('Dê um título para a trilha.')
    if (!s) return setErr('O endereço da trilha não pode ficar vazio.')
    if (data.tracks.some((x) => x.slug === s && x.id !== track?.id)) return setErr('Já existe outra trilha com esse endereço. Ajuste o campo "Endereço".')
    setBusy(true)
    try {
      const position = track ? track.position : data.tracks.reduce((m, x) => Math.max(m, x.position), 0) + 1
      const saved = await api.saveTrack({
        ...(track ? { id: track.id } : {}),
        title: t,
        slug: s,
        promise: promise.trim() || null,
        checkpoint: checkpoint.trim() || null,
        is_entry: isEntry,
        published,
        position,
      })
      await reloadContent()
      toast('Trilha salva.')
      if (!track) nav(`/admin/conteudo/trilha/${saved.id}`, { replace: true })
      else {
        setSlug(s)
        await reload()
      }
    } catch (e) {
      setErr(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!track) return
    setBusy(true)
    try {
      await api.deleteTrack(track.id)
      await reloadContent()
      toast('Trilha excluída.')
      nav('/admin/conteudo', { replace: true })
    } catch (e) {
      setErr(errMsg(e))
      setConfirmDel(false)
      setBusy(false)
    }
  }

  async function removeMaterial() {
    if (!matDel) return
    setBusy(true)
    try {
      await api.deleteMaterial(matDel.id)
      await reload()
      await reloadContent()
      toast('Material excluído.')
      setMatDel(null)
    } catch (e) {
      toast(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="stack">
      <section className="card r" style={{ padding: '26px 26px 24px' }}>
        <h2 className="dsp" style={{ fontSize: 21 }}>
          {track ? 'Dados da trilha' : 'Nova trilha'}
        </h2>
        <label className="field" style={{ marginTop: 16 }}>
          <span>Título</span>
          <input className="input" value={title} onChange={(e) => onTitle(e.target.value)} maxLength={80} placeholder="Ex.: Posicionamento e oferta" />
        </label>
        <label className="field">
          <span>Endereço</span>
          <input
            className="input"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(e.target.value)
            }}
            spellCheck={false}
            autoCapitalize="none"
          />
          <small>Endereço da trilha: /trilhas/{slug || 'endereco'}</small>
        </label>
        <label className="field">
          <span>Promessa</span>
          <textarea
            className="textarea"
            style={{ minHeight: 90 }}
            value={promise}
            onChange={(e) => setPromise(e.target.value)}
            placeholder="O que o aluno conquista ao concluir esta trilha."
          />
        </label>
        <label className="field">
          <span>Entrega da trilha (checkpoint)</span>
          <input className="input" value={checkpoint} onChange={(e) => setCheckpoint(e.target.value)} placeholder="Ex.: Oferta final escrita" />
        </label>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', marginTop: 18 }}>
          <label className="switch">
            <input type="checkbox" checked={isEntry} onChange={(e) => setIsEntry(e.target.checked)} />
            Trilha de entrada
          </label>
          <label className="switch">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Publicada
          </label>
        </div>
        {err && <div className="form-err" role="alert">{err}</div>}
      </section>

      {track && (
        <section className="card r" style={{ ['--i' as string]: 1 }}>
          <div className="toolbar" style={{ padding: '22px 22px 0', marginBottom: 6 }}>
            <h2 className="dsp grow" style={{ fontSize: 19 }}>
              Materiais da trilha
            </h2>
            <CTA icon="plus" variant={SM_GHOST} onClick={() => setMatDialog('new')}>
              Novo material
            </CTA>
          </div>
          {materials.length === 0 ? (
            <p className="muted" style={{ fontSize: 13.5, padding: '8px 22px 22px' }}>
              Nenhum material ainda. Adicione planilhas, guias e documentos para os alunos baixarem.
            </p>
          ) : (
            materials.map((m) => {
              const lesson = trackLessons.find((l) => l.id === m.lesson_id)
              return (
                <div className="row" key={m.id}>
                  <span className="chip-i">
                    <Icon name={KIND_ICON[m.kind] ?? 'doc'} />
                  </span>
                  <div className="tx">
                    <b>{m.title}</b>
                    <span>
                      {KIND_LABEL[m.kind]} · {lesson ? lesson.title : 'Toda a trilha'}
                      {m.description ? ` · ${m.description}` : ''}
                    </span>
                  </div>
                  {m.storage_path ? (
                    <span className="pill ok">Arquivo</span>
                  ) : m.external_url ? (
                    <span className="pill acc">Link</span>
                  ) : (
                    <span className="pill warn">Sem arquivo</span>
                  )}
                  <div className="acts">
                    <button type="button" className="icon-btn" aria-label={`Editar material ${m.title}`} title="Editar" onClick={() => setMatDialog(m)}>
                      <Icon name="edit" />
                    </button>
                    <button type="button" className="icon-btn" aria-label={`Excluir material ${m.title}`} title="Excluir" onClick={() => setMatDel(m)}>
                      <Icon name="trash" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </section>
      )}

      <div className="r" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', ['--i' as string]: 2 }}>
        <CTA icon="check" onClick={() => void save()} disabled={busy}>
          {busy ? 'Salvando...' : 'Salvar trilha'}
        </CTA>
        <CTA to="/admin/conteudo" icon={null} variant="ghost">
          Voltar
        </CTA>
        {track && (
          <span style={{ marginLeft: 'auto' }}>
            <CTA variant="danger" icon="trash" onClick={() => setConfirmDel(true)} disabled={busy}>
              Excluir trilha
            </CTA>
          </span>
        )}
      </div>

      {confirmDel && (
        <ConfirmDialog title="Excluir esta trilha?" confirmLabel="Excluir trilha" busy={busy} onConfirm={() => void remove()} onClose={() => setConfirmDel(false)}>
          Isso exclui também as {trackLessons.length} {trackLessons.length === 1 ? 'aula' : 'aulas'} da trilha, os materiais e o progresso dos alunos nelas. Não dá para desfazer.
        </ConfirmDialog>
      )}
      {matDel && (
        <ConfirmDialog title="Excluir material?" confirmLabel="Excluir" busy={busy} onConfirm={() => void removeMaterial()} onClose={() => setMatDel(null)}>
          "{matDel.title}" deixa de aparecer para os alunos.
        </ConfirmDialog>
      )}
      {matDialog && track && (
        <MaterialDialog
          material={matDialog === 'new' ? null : matDialog}
          trackId={track.id}
          lessons={trackLessons}
          nextPosition={materials.length + 1}
          onClose={() => setMatDialog(null)}
          onSaved={async () => {
            setMatDialog(null)
            await reload()
            await reloadContent()
            toast('Material salvo.')
          }}
        />
      )}
    </div>
  )
}

const KINDS: MaterialKind[] = ['documento', 'planilha', 'guia', 'checklist']

function MaterialDialog({
  material,
  trackId,
  lessons,
  nextPosition,
  onClose,
  onSaved,
}: {
  material: Material | null
  trackId: string
  lessons: Lesson[]
  nextPosition: number
  onClose: () => void
  onSaved: () => Promise<void>
}) {
  const [title, setTitle] = useState(material?.title ?? '')
  const [description, setDescription] = useState(material?.description ?? '')
  const [kind, setKind] = useState<MaterialKind>(material?.kind ?? 'documento')
  const [lessonId, setLessonId] = useState(material?.lesson_id ?? '')
  const [link, setLink] = useState(material?.external_url ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function save() {
    setErr(null)
    if (!title.trim()) return setErr('Dê um título para o material.')
    setBusy(true)
    try {
      let storage_path = material?.storage_path ?? null
      let external_url: string | null = link.trim() || null
      if (file) {
        storage_path = await api.uploadMaterialFile(file)
        external_url = null
      } else if (external_url) {
        storage_path = null
      }
      await api.saveMaterial({
        ...(material ? { id: material.id } : {}),
        track_id: trackId,
        lesson_id: lessonId || null,
        title: title.trim(),
        description: description.trim() || null,
        kind,
        storage_path,
        external_url,
        position: material?.position ?? nextPosition,
      })
      await onSaved()
    } catch (e) {
      setErr(errMsg(e))
      setBusy(false)
    }
  }

  return (
    <Modal title={material ? 'Editar material' : 'Novo material'} onClose={onClose}>
      <label className="field">
        <span>Título</span>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label className="field">
        <span>Descrição</span>
        <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opcional" />
      </label>
      <div className="grid g2" style={{ marginTop: 14 }}>
        <label className="field" style={{ marginTop: 0 }}>
          <span>Tipo</span>
          <select className="select" value={kind} onChange={(e) => setKind(e.target.value as MaterialKind)}>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
        </label>
        <label className="field" style={{ marginTop: 0 }}>
          <span>Aula vinculada</span>
          <select className="select" value={lessonId} onChange={(e) => setLessonId(e.target.value)}>
            <option value="">Toda a trilha</option>
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>Arquivo</span>
        <input className="input" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        {material?.storage_path && !file && <small>Arquivo atual: {fileName(material.storage_path)}. Envie outro para trocar.</small>}
      </label>
      <label className="field">
        <span>Ou link externo</span>
        <input className="input" value={link} onChange={(e) => setLink(e.target.value)} inputMode="url" placeholder="https://" disabled={!!file} />
        <small>Se enviar um arquivo, o link é ignorado.</small>
      </label>
      {err && <div className="form-err" role="alert">{err}</div>}
      <div className="acts">
        <CTA variant="ghost" icon={null} onClick={onClose}>
          Cancelar
        </CTA>
        <CTA icon="check" onClick={() => void save()} disabled={busy}>
          {busy ? 'Salvando...' : 'Salvar material'}
        </CTA>
      </div>
    </Modal>
  )
}

/* ---------- editar aula ---------- */

interface LessonData {
  tracks: Track[]
  lessons: Lesson[]
}

export function AdminLessonEdit() {
  const { lessonId } = useParams()
  const [params] = useSearchParams()
  const isNew = lessonId === 'nova'
  const [data, setData] = useState<LessonData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const [tracks, lessons] = await Promise.all([api.listTracks(), api.listLessons()])
      setData({ tracks: byPosition(tracks), lessons })
      setError(null)
    } catch (e) {
      setError(errMsg(e))
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load, lessonId])

  if (error)
    return (
      <Empty icon="close" title="Não foi possível carregar" action={<CTA icon={null} onClick={() => void load()}>Tentar de novo</CTA>}>
        {error}
      </Empty>
    )
  if (!data) return <Skeleton rows={2} h={200} />

  const lesson = isNew ? null : (data.lessons.find((l) => l.id === lessonId) ?? null)
  if (!isNew && !lesson)
    return (
      <Empty icon="book" title="Aula não encontrada" action={<CTA to="/admin/conteudo">Voltar ao conteúdo</CTA>}>
        Ela pode ter sido excluída.
      </Empty>
    )
  if (data.tracks.length === 0)
    return (
      <Empty icon="layers" title="Crie uma trilha primeiro" action={<CTA to="/admin/conteudo/trilha/nova">Nova trilha</CTA>}>
        Toda aula pertence a uma trilha.
      </Empty>
    )

  const wanted = params.get('trilha')
  const initialTrack = lesson?.track_id ?? (wanted && data.tracks.some((t) => t.id === wanted) ? wanted : data.tracks[0].id)

  return <LessonForm key={lesson?.id ?? 'nova'} lesson={lesson} initialTrack={initialTrack} data={data} reload={load} />
}

function LessonForm({
  lesson,
  initialTrack,
  data,
  reload,
}: {
  lesson: Lesson | null
  initialTrack: string
  data: LessonData
  reload: () => Promise<void>
}) {
  const nav = useNavigate()
  const { reloadContent, toast } = useStore()
  const [trackId, setTrackId] = useState(initialTrack)
  const [title, setTitle] = useState(lesson?.title ?? '')
  const [objective, setObjective] = useState(lesson?.objective ?? '')
  const [body, setBody] = useState(lesson?.body_md ?? '')
  const [preview, setPreview] = useState(false)
  const [items, setItems] = useState<ChecklistItem[]>(lesson?.checklist ?? [])
  const [checkpoint, setCheckpoint] = useState(lesson?.checkpoint_title ?? '')
  const [published, setPublished] = useState(lesson?.published ?? true)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [confirmDel, setConfirmDel] = useState(false)

  function patchItem(i: number, patch: Partial<ChecklistItem>) {
    setItems((list) => list.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  }
  function moveItem(i: number, dir: -1 | 1) {
    setItems((list) => {
      const j = i + dir
      if (j < 0 || j >= list.length) return list
      const n = [...list]
      ;[n[i], n[j]] = [n[j], n[i]]
      return n
    })
  }

  async function save() {
    setErr(null)
    const t = title.trim()
    if (!t) return setErr('Dê um título para a aula.')
    setBusy(true)
    try {
      const clean: ChecklistItem[] = items
        .filter((it) => it.text.trim())
        .map((it) => ({ id: it.id, text: it.text.trim(), ...(it.hint?.trim() ? { hint: it.hint.trim() } : {}) }))
      const moved = !lesson || lesson.track_id !== trackId
      const position = moved
        ? data.lessons.filter((l) => l.track_id === trackId).reduce((m, l) => Math.max(m, l.position), 0) + 1
        : lesson.position
      const saved = await api.saveLesson({
        ...(lesson ? { id: lesson.id } : {}),
        track_id: trackId,
        title: t,
        objective: objective.trim() || null,
        body_md: body,
        checklist: clean,
        checkpoint_title: checkpoint.trim() || null,
        published,
        position,
      })
      await reloadContent()
      toast('Aula salva.')
      if (!lesson) nav(`/admin/conteudo/aula/${saved.id}`, { replace: true })
      else {
        setItems(clean)
        await reload()
      }
    } catch (e) {
      setErr(errMsg(e))
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!lesson) return
    setBusy(true)
    try {
      await api.deleteLesson(lesson.id)
      await reloadContent()
      toast('Aula excluída.')
      nav('/admin/conteudo', { replace: true })
    } catch (e) {
      setErr(errMsg(e))
      setConfirmDel(false)
      setBusy(false)
    }
  }

  const filled = items.filter((i) => i.text.trim()).length

  return (
    <div className="stack">
      <div className="lg">
        <div className="stack">
          <section className="card r" style={{ padding: '26px 26px 24px' }}>
            <div className="toolbar" style={{ marginBottom: 0 }}>
              <h2 className="dsp grow" style={{ fontSize: 21 }}>
                {lesson ? 'Conteúdo da aula' : 'Nova aula'}
              </h2>
              {lesson && (
                <CTA to={`/aula/${lesson.id}`} icon="eye" variant={SM_GHOST}>
                  Ver como aluno
                </CTA>
              )}
            </div>
            <label className="field" style={{ marginTop: 16 }}>
              <span>Título</span>
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Ex.: Defina seu cliente ideal" />
            </label>
            <label className="field">
              <span>Objetivo</span>
              <textarea
                className="textarea"
                style={{ minHeight: 80 }}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Uma frase: o que o aluno entrega ao fim da aula."
              />
            </label>

            <div className="field">
              <span>Texto da aula</span>
              <div className="seg" style={{ marginBottom: 10, width: 'max-content', maxWidth: '100%' }}>
                <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>
                  Editar
                </button>
                <button type="button" aria-pressed={preview} onClick={() => setPreview(true)}>
                  Pré-visualizar
                </button>
              </div>
              {preview ? (
                body.trim() ? (
                  <div className="md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeTableLabels]}>{body}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="muted" style={{ fontSize: 13.5 }}>
                    Nada para mostrar ainda.
                  </p>
                )
              ) : (
                <textarea className="textarea code" value={body} onChange={(e) => setBody(e.target.value)} spellCheck={false} aria-label="Texto da aula em markdown" />
              )}
              <small>Use ## para títulos, **negrito**, &gt; para destaque, - para listas.</small>
            </div>
          </section>

          <section className="card r" style={{ padding: '26px 26px 24px', ['--i' as string]: 1 }}>
            <h2 className="dsp" style={{ fontSize: 19 }}>
              Checklist
            </h2>
            <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>
              O aluno marca cada item. Itens sem texto são descartados ao salvar.
            </p>
            <div className="stack" style={{ marginTop: 14 }}>
              {items.map((it, i) => (
                <div key={it.id} className="card" style={{ padding: 14, background: 'var(--card-2)', boxShadow: 'none' }}>
                  <label className="field">
                    <span>Item</span>
                    <input className="input" value={it.text} onChange={(e) => patchItem(i, { text: e.target.value })} style={{ background: 'var(--card)' }} />
                  </label>
                  <label className="field">
                    <span>Dica (opcional)</span>
                    <input className="input" value={it.hint ?? ''} onChange={(e) => patchItem(i, { hint: e.target.value })} style={{ background: 'var(--card)' }} />
                  </label>
                  <div className="acts" style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 10 }}>
                    <button type="button" className="icon-btn" aria-label="Subir item" title="Subir" disabled={i === 0} onClick={() => moveItem(i, -1)}>
                      <Icon name="up" />
                    </button>
                    <button type="button" className="icon-btn" aria-label="Descer item" title="Descer" disabled={i === items.length - 1} onClick={() => moveItem(i, 1)}>
                      <Icon name="down" />
                    </button>
                    <button type="button" className="icon-btn" aria-label="Remover item" title="Remover" onClick={() => setItems((l) => l.filter((_, idx) => idx !== i))}>
                      <Icon name="trash" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <CTA icon="plus" variant={SM_GHOST} onClick={() => setItems((l) => [...l, { id: newItemId(), text: '' }])}>
                Adicionar item
              </CTA>
            </div>
          </section>
        </div>

        <aside className="stack">
          <div className="card r" style={{ padding: 22, ['--i' as string]: 1 }}>
            <label className="switch">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Publicada
            </label>
            <label className="field" style={{ marginTop: 18 }}>
              <span>Trilha</span>
              <select className="select" value={trackId} onChange={(e) => setTrackId(e.target.value)}>
                {data.tracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
              {lesson && lesson.track_id !== trackId && <small>Ao salvar, a aula vai para o fim da nova trilha.</small>}
            </label>
            <label className="field">
              <span>Nome do checkpoint (opcional)</span>
              <input className="input" value={checkpoint} onChange={(e) => setCheckpoint(e.target.value)} placeholder="Ex.: Oferta pronta" />
              <small>Preenchido = a aula fecha com um checkpoint que só libera com o checklist completo.</small>
            </label>
          </div>
          <div className="note r" style={{ ['--i' as string]: 2 }}>
            <b>Resumo:</b> {filled} {filled === 1 ? 'item' : 'itens'} no checklist, {body.trim() ? `${body.trim().split(/\s+/).length} palavras de texto` : 'sem texto ainda'}
            {checkpoint.trim() ? ', com checkpoint' : ''}. {published ? 'Visível para os alunos.' : 'Rascunho: os alunos não veem.'}
          </div>
        </aside>
      </div>

      {err && <div className="form-err" role="alert">{err}</div>}

      <div className="r" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', ['--i' as string]: 3 }}>
        <CTA icon="check" onClick={() => void save()} disabled={busy}>
          {busy ? 'Salvando...' : 'Salvar aula'}
        </CTA>
        <CTA to="/admin/conteudo" icon={null} variant="ghost">
          Voltar
        </CTA>
        {lesson && (
          <span style={{ marginLeft: 'auto' }}>
            <CTA variant="danger" icon="trash" onClick={() => setConfirmDel(true)} disabled={busy}>
              Excluir aula
            </CTA>
          </span>
        )}
      </div>

      {confirmDel && (
        <ConfirmDialog title="Excluir esta aula?" confirmLabel="Excluir aula" busy={busy} onConfirm={() => void remove()} onClose={() => setConfirmDel(false)}>
          O texto, o checklist e o progresso dos alunos nesta aula serão apagados. Não dá para desfazer.
        </ConfirmDialog>
      )}
    </div>
  )
}
