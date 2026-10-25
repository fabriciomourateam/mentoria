import { createClient } from '@supabase/supabase-js'
import type { Api, AuthUser } from './api'
import type { AppSettings, Enrollment, Lead, Lesson, Material, Profile, Progress, StudentRow, Track, WorkspaceEntry } from './types'

function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message)
  return res.data as T
}

function translate(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login')) return 'E-mail ou senha incorretos.'
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.'
  if (m.includes('already registered')) return 'Esse e-mail já tem cadastro. Entre com sua senha.'
  if (m.includes('password should be')) return 'A senha precisa ter pelo menos 6 caracteres.'
  if (m.includes('rate limit')) return 'Muitas tentativas. Espere um minuto e tente de novo.'
  return msg
}

export function createSupabaseApi(url: string, key: string): Api {
  const sb = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } })

  const toUser = (u: { id: string; email?: string | null } | null | undefined): AuthUser | null =>
    u ? { id: u.id, email: u.email ?? null } : null

  async function uid(): Promise<string> {
    const { data } = await sb.auth.getUser()
    if (!data.user) throw new Error('Sessão expirada. Entre novamente.')
    return data.user.id
  }

  return {
    mode: 'supabase',

    async getUser() {
      const { data } = await sb.auth.getSession()
      return toUser(data.session?.user)
    },
    onAuthChange(cb) {
      const { data } = sb.auth.onAuthStateChange((_e, session) => cb(toUser(session?.user)))
      return () => data.subscription.unsubscribe()
    },
    async signIn(email, password) {
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) throw new Error(translate(error.message))
    },
    async signUp(fullName, email, password) {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
      })
      if (error) throw new Error(translate(error.message))
      return { needsConfirmation: !data.session }
    },
    async signOut() {
      await sb.auth.signOut()
    },
    async resetPassword(email) {
      const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin })
      if (error) throw new Error(translate(error.message))
    },
    async getMe() {
      const { data } = await sb.auth.getUser()
      if (!data.user) return null
      const id = data.user.id
      const [p, e] = await Promise.all([
        sb.from('profiles').select('*').eq('id', id).maybeSingle(),
        sb.from('enrollments').select('*').eq('user_id', id).maybeSingle(),
      ])
      const profile = (p.data as Profile | null) ?? {
        id,
        full_name: (data.user.user_metadata?.full_name as string) ?? '',
        email: data.user.email ?? null,
        role: 'student' as const,
        created_at: new Date().toISOString(),
      }
      const enrollment = e.data as Enrollment | null
      const isAdmin = profile.role === 'admin'
      const active =
        !!enrollment &&
        enrollment.status === 'active' &&
        (!enrollment.expires_at || new Date(enrollment.expires_at) > new Date())
      return { profile, enrollment, isAdmin, hasAccess: isAdmin || active }
    },

    async getSettings() {
      return must(await sb.from('app_settings').select('brand_name,accent,base,myshape_url').eq('id', 1).single()) as AppSettings
    },
    async updateSettings(patch) {
      return must(
        await sb.from('app_settings').update(patch).eq('id', 1).select('brand_name,accent,base,myshape_url').single(),
      ) as AppSettings
    },

    async listTracks() {
      return must(await sb.from('tracks').select('*').order('position')) as Track[]
    },
    async listLessons() {
      return must(await sb.from('lessons').select('*').order('position')) as Lesson[]
    },
    async listMaterials() {
      return must(await sb.from('materials').select('*').order('position')) as Material[]
    },
    async materialUrl(m) {
      if (m.storage_path) {
        const { data, error } = await sb.storage.from('materials').createSignedUrl(m.storage_path, 60 * 60, {
          download: true,
        })
        if (error) throw new Error(error.message)
        return data.signedUrl
      }
      return m.external_url
    },

    async listProgress(userId) {
      const id = userId ?? (await uid())
      return must(await sb.from('lesson_progress').select('*').eq('user_id', id)) as Progress[]
    },
    async saveProgress(lessonId, checked, completed) {
      const id = await uid()
      return must(
        await sb
          .from('lesson_progress')
          .upsert({
            user_id: id,
            lesson_id: lessonId,
            checked,
            completed_at: completed ? new Date().toISOString() : null,
          })
          .select()
          .single(),
      ) as Progress
    },

    async listWorkspace(userId) {
      const id = userId ?? (await uid())
      return must(await sb.from('workspace_entries').select('*').eq('user_id', id)) as WorkspaceEntry[]
    },
    async saveWorkspace(key, data) {
      const id = await uid()
      return must(
        await sb.from('workspace_entries').upsert({ user_id: id, key, data }).select().single(),
      ) as WorkspaceEntry
    },
    async listLeads(userId) {
      const id = userId ?? (await uid())
      return must(
        await sb.from('leads').select('*').eq('user_id', id).order('created_at', { ascending: false }),
      ) as Lead[]
    },
    async saveLead(l) {
      const row: Partial<Lead> = { ...l }
      delete row.created_at
      delete row.updated_at
      if (!row.id) {
        delete row.id
        row.user_id = await uid()
      }
      return must(await sb.from('leads').upsert(row).select().single()) as Lead
    },
    async deleteLead(id) {
      must(await sb.from('leads').delete().eq('id', id))
    },

    async saveTrack(t) {
      const row = { ...t }
      if (!row.id) delete row.id
      return must(await sb.from('tracks').upsert(row).select().single()) as Track
    },
    async deleteTrack(id) {
      must(await sb.from('tracks').delete().eq('id', id))
    },
    async saveLesson(l) {
      const row = { ...l }
      if (!row.id) delete row.id
      delete row.updated_at
      return must(await sb.from('lessons').upsert(row).select().single()) as Lesson
    },
    async deleteLesson(id) {
      must(await sb.from('lessons').delete().eq('id', id))
    },
    async saveMaterial(m) {
      const row = { ...m }
      if (!row.id) delete row.id
      return must(await sb.from('materials').upsert(row).select().single()) as Material
    },
    async deleteMaterial(id) {
      must(await sb.from('materials').delete().eq('id', id))
    },
    async uploadMaterialFile(file) {
      const safe = file.name.normalize('NFD').replace(/[^\w.-]+/g, '-').toLowerCase()
      const path = `${crypto.randomUUID()}/${safe}`
      const { error } = await sb.storage.from('materials').upload(path, file, { upsert: false })
      if (error) throw new Error(error.message)
      return path
    },
    async listStudents() {
      const [p, e, g] = await Promise.all([
        sb.from('profiles').select('*').order('created_at', { ascending: false }),
        sb.from('enrollments').select('*'),
        sb.from('lesson_progress').select('user_id,completed_at,updated_at'),
      ])
      const profiles = must(p) as Profile[]
      const enrolls = new Map((must(e) as Enrollment[]).map((x) => [x.user_id, x]))
      const prog = must(g) as { user_id: string; completed_at: string | null; updated_at: string }[]
      return profiles.map<StudentRow>((profile) => {
        const mine = prog.filter((x) => x.user_id === profile.id)
        const last = mine.reduce<string | null>((acc, x) => (!acc || x.updated_at > acc ? x.updated_at : acc), null)
        return {
          profile,
          enrollment: enrolls.get(profile.id) ?? null,
          completedLessons: mine.filter((x) => x.completed_at).length,
          lastActivity: last,
        }
      })
    },
    async setEnrollment(userId, status, expiresAt) {
      must(
        await sb
          .from('enrollments')
          .upsert({ user_id: userId, status, expires_at: expiresAt, source: 'manual' }, { onConflict: 'user_id' }),
      )
    },
  }
}
