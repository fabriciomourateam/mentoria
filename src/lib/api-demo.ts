import type { Api, AuthUser } from './api'
import { buildDemoContent } from './demo-seed'
import type { AppSettings, Enrollment, Lead, Lesson, Material, Profile, Progress, Track, WorkspaceEntry } from './types'

// Modo demonstração: tudo fica no navegador (localStorage). Serve para ver e testar
// a plataforma antes do Supabase existir. Regras do login de teste:
//   e-mail começando com "admin"  -> gestor (vê o painel admin)
//   e-mail contendo "pendente"    -> cadastro aguardando liberação
//   qualquer outro                -> aluno com acesso ativo

interface DemoDb {
  v: number
  settings: AppSettings
  tracks: Track[]
  lessons: Lesson[]
  materials: Material[]
  profiles: Profile[]
  enrollments: Enrollment[]
  progress: Progress[]
  files: Record<string, string>
  session: AuthUser | null
  workspace?: WorkspaceEntry[]
  leads?: Lead[]
}

const KEY = 'mentoria-demo-v1'
const now = () => new Date().toISOString()
const rid = () => Math.random().toString(36).slice(2, 10)

function seed(): DemoDb {
  const c = buildDemoContent()
  const ago = (d: number) => new Date(Date.now() - d * 864e5).toISOString()
  const people: [string, string, Enrollment['status'] | null][] = [
    ['Diogo Almeida', 'diogo@exemplo.com', 'active'],
    ['Carla Mendes', 'carla@exemplo.com', 'active'],
    ['Rafael Souza', 'rafael@exemplo.com', null],
    ['Juliana Prado', 'juliana@exemplo.com', 'paused'],
  ]
  const profiles: Profile[] = people.map(([full_name, email], i) => ({
    id: `u-${i}`,
    full_name,
    email,
    role: 'student',
    created_at: ago(20 - i * 4),
  }))
  const enrollments: Enrollment[] = people.flatMap(([, , status], i) =>
    status ? [{ user_id: `u-${i}`, status, source: 'manual' as const, started_at: ago(18 - i * 4), expires_at: null }] : [],
  )
  const progress: Progress[] = c.lessons.slice(0, 3).map((l) => ({
    user_id: 'u-0',
    lesson_id: l.id,
    checked: l.checklist.map((x) => x.id),
    completed_at: ago(3),
  }))
  return {
    v: 1,
    settings: { brand_name: 'Mentoria', accent: '#13A6E6', base: 'light', myshape_url: 'https://my-shape.app' },
    ...c,
    profiles,
    enrollments,
    progress,
    files: {},
    session: null,
  }
}

function load(): DemoDb {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as DemoDb
  } catch {
    /* sem storage: segue com memória */
  }
  return seed()
}

export function createDemoApi(): Api {
  let db = load()
  const listeners = new Set<(u: AuthUser | null) => void>()
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(db))
    } catch {
      /* ignore */
    }
  }
  const wait = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(structuredClone(v)), 120))
  const emit = () => listeners.forEach((cb) => cb(db.session))
  const me = () => {
    if (!db.session) throw new Error('Sessão expirada. Entre novamente.')
    return db.session.id
  }
  const isAdmin = () => db.profiles.find((p) => p.id === db.session?.id)?.role === 'admin'
  const hasAccess = () => {
    if (isAdmin()) return true
    const e = db.enrollments.find((x) => x.user_id === db.session?.id)
    return !!e && e.status === 'active' && (!e.expires_at || new Date(e.expires_at) > new Date())
  }
  const visible = <T extends { published: boolean }>(rows: T[]) => (isAdmin() ? rows : hasAccess() ? rows.filter((r) => r.published) : [])

  function login(email: string, fullName?: string) {
    const e = email.trim().toLowerCase()
    let p = db.profiles.find((x) => x.email === e)
    if (!p) {
      const role = e.startsWith('admin') ? 'admin' : 'student'
      const name = fullName?.trim() || (role === 'admin' ? 'Fabricio' : e.split('@')[0].replace(/\W+/g, ' '))
      p = { id: `u-${rid()}`, full_name: name, email: e, role, created_at: now() }
      db.profiles.unshift(p)
      if (role === 'student' && !e.includes('pendente')) {
        db.enrollments.push({ user_id: p.id, status: 'active', source: 'manual', started_at: now(), expires_at: null })
      }
    }
    db.session = { id: p.id, email: p.email }
    save()
    emit()
  }

  function upsert<T extends { id: string }>(list: T[], row: Partial<T>, base: () => T): T {
    if (row.id) {
      const i = list.findIndex((x) => x.id === row.id)
      if (i >= 0) {
        list[i] = { ...list[i], ...row }
        return list[i]
      }
    }
    const created = { ...base(), ...row, id: row.id || rid() } as T
    list.push(created)
    return created
  }

  return {
    mode: 'demo',
    async getUser() {
      return wait(db.session)
    },
    onAuthChange(cb) {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    async signIn(email, password) {
      if (!email.includes('@')) throw new Error('Digite um e-mail válido.')
      if (password.length < 6) throw new Error('A senha precisa ter pelo menos 6 caracteres.')
      login(email)
    },
    async signUp(fullName, email, password) {
      if (!email.includes('@')) throw new Error('Digite um e-mail válido.')
      if (password.length < 6) throw new Error('A senha precisa ter pelo menos 6 caracteres.')
      login(email, fullName)
      return { needsConfirmation: false }
    },
    async signOut() {
      db.session = null
      save()
      emit()
    },
    async resetPassword() {
      /* no modo demonstração não há e-mail */
    },
    async getMe() {
      if (!db.session) return null
      const profile = db.profiles.find((p) => p.id === db.session!.id)
      if (!profile) return null
      const enrollment = db.enrollments.find((e) => e.user_id === profile.id) ?? null
      return wait({ profile, enrollment, isAdmin: profile.role === 'admin', hasAccess: hasAccess() })
    },

    async getSettings() {
      return wait(db.settings)
    },
    async updateSettings(patch) {
      db.settings = { ...db.settings, ...patch }
      save()
      return wait(db.settings)
    },

    async listTracks() {
      return wait(visible(db.tracks).sort((a, b) => a.position - b.position))
    },
    async listLessons() {
      return wait(visible(db.lessons).sort((a, b) => a.position - b.position))
    },
    async listMaterials() {
      return wait(hasAccess() ? [...db.materials].sort((a, b) => a.position - b.position) : [])
    },
    async materialUrl(m) {
      if (m.storage_path && db.files[m.storage_path]) return db.files[m.storage_path]
      return m.external_url
    },

    async listProgress() {
      const id = me()
      return wait(db.progress.filter((p) => p.user_id === id))
    },
    async saveProgress(lessonId, checked, completed) {
      const id = me()
      const row: Progress = { user_id: id, lesson_id: lessonId, checked, completed_at: completed ? now() : null }
      const i = db.progress.findIndex((p) => p.user_id === id && p.lesson_id === lessonId)
      if (i >= 0) db.progress[i] = row
      else db.progress.push(row)
      save()
      return wait(row)
    },

    async listWorkspace(userId) {
      const id = userId ?? me()
      return wait((db.workspace ?? []).filter((w) => w.user_id === id))
    },
    async saveWorkspace(key, data) {
      const id = me()
      db.workspace = db.workspace ?? []
      const row: WorkspaceEntry = { user_id: id, key, data, updated_at: now() }
      const i = db.workspace.findIndex((w) => w.user_id === id && w.key === key)
      if (i >= 0) db.workspace[i] = row
      else db.workspace.push(row)
      save()
      return wait(row)
    },
    async listLeads(userId) {
      const id = userId ?? me()
      return wait((db.leads ?? []).filter((l) => l.user_id === id).sort((a, b) => b.created_at.localeCompare(a.created_at)))
    },
    async saveLead(l) {
      const id = me()
      db.leads = db.leads ?? []
      const stamp = now()
      const i = l.id ? db.leads.findIndex((x) => x.id === l.id) : -1
      const row: Lead =
        i >= 0
          ? { ...db.leads[i], ...l, updated_at: stamp }
          : {
              id: rid(),
              user_id: id,
              contact: null,
              origin: null,
              stage: 'novo',
              next_step: null,
              next_date: null,
              value: null,
              notes: null,
              created_at: stamp,
              ...l,
              updated_at: stamp,
            }
      if (i >= 0) db.leads[i] = row
      else db.leads.push(row)
      save()
      return wait(row)
    },
    async deleteLead(id) {
      db.leads = (db.leads ?? []).filter((l) => l.id !== id)
      save()
    },

    async saveTrack(t) {
      const row = upsert(db.tracks, t, () => ({
        id: '',
        slug: t.title.toLowerCase().normalize('NFD').replace(/[^\w]+/g, '-'),
        position: db.tracks.length,
        title: t.title,
        promise: null,
        checkpoint: null,
        is_entry: false,
        published: true,
      }))
      save()
      return wait(row)
    },
    async deleteTrack(id) {
      db.tracks = db.tracks.filter((t) => t.id !== id)
      const gone = new Set(db.lessons.filter((l) => l.track_id === id).map((l) => l.id))
      db.lessons = db.lessons.filter((l) => l.track_id !== id)
      db.materials = db.materials.filter((m) => m.track_id !== id)
      db.progress = db.progress.filter((p) => !gone.has(p.lesson_id))
      save()
    },
    async saveLesson(l) {
      const row = upsert(db.lessons, { ...l, updated_at: now() }, () => ({
        id: '',
        track_id: l.track_id,
        position: db.lessons.filter((x) => x.track_id === l.track_id).length + 1,
        title: l.title,
        objective: null,
        body_md: '',
        checklist: [],
        checkpoint_title: null,
        published: true,
      }))
      save()
      return wait(row)
    },
    async deleteLesson(id) {
      db.lessons = db.lessons.filter((l) => l.id !== id)
      db.progress = db.progress.filter((p) => p.lesson_id !== id)
      db.materials = db.materials.map((m) => (m.lesson_id === id ? { ...m, lesson_id: null } : m))
      save()
    },
    async saveMaterial(m) {
      const row = upsert(db.materials, m, () => ({
        id: '',
        track_id: null,
        lesson_id: null,
        title: m.title,
        description: null,
        kind: 'documento' as const,
        storage_path: null,
        external_url: null,
        position: db.materials.length + 1,
      }))
      save()
      return wait(row)
    },
    async deleteMaterial(id) {
      db.materials = db.materials.filter((m) => m.id !== id)
      save()
    },
    async uploadMaterialFile(file) {
      const path = `${rid()}/${file.name}`
      // No demo o arquivo só vale nesta aba (não cabe no localStorage).
      db.files[path] = URL.createObjectURL(file)
      return path
    },
    async listStudents() {
      return wait(
        db.profiles
          .filter((p) => p.role === 'student')
          .map((profile) => {
            const mine = db.progress.filter((p) => p.user_id === profile.id)
            return {
              profile,
              enrollment: db.enrollments.find((e) => e.user_id === profile.id) ?? null,
              completedLessons: mine.filter((p) => p.completed_at).length,
              lastActivity: mine.reduce<string | null>(
                (acc, p) => (p.completed_at && (!acc || p.completed_at > acc) ? p.completed_at : acc),
                null,
              ),
            }
          }),
      )
    },
    async setEnrollment(userId, status, expiresAt) {
      const i = db.enrollments.findIndex((e) => e.user_id === userId)
      if (i >= 0) db.enrollments[i] = { ...db.enrollments[i], status, expires_at: expiresAt }
      else db.enrollments.push({ user_id: userId, status, source: 'manual', started_at: now(), expires_at: expiresAt })
      save()
    },
  }
}
