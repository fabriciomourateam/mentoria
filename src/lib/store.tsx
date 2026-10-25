import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from './api'
import type { AuthUser } from './api'
import { applyTheme, DEFAULT_ACCENT } from './theme'
import type { AppSettings, Lesson, Material, Me, Progress, Track } from './types'

const DEFAULT_SETTINGS: AppSettings = {
  brand_name: 'Mentoria',
  accent: DEFAULT_ACCENT,
  base: 'light',
  myshape_url: 'https://my-shape.app',
}

export interface Content {
  tracks: Track[]
  lessons: Lesson[]
  materials: Material[]
}

interface Store {
  booting: boolean
  settings: AppSettings
  /** Pinta a plataforma sem salvar (pré-visualização no admin). */
  previewTheme(accent: string, base: AppSettings['base']): void
  saveSettings(patch: Partial<AppSettings>): Promise<void>
  user: AuthUser | null
  me: Me | null
  refreshMe(): Promise<void>
  content: Content | null
  contentError: string | null
  reloadContent(): Promise<void>
  progress: Map<string, Progress>
  saveProgress(lessonId: string, checked: string[], completed: boolean): Promise<void>
  toast(msg: string): void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [booting, setBooting] = useState(true)
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [me, setMe] = useState<Me | null>(null)
  const [content, setContent] = useState<Content | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)
  const [progress, setProgress] = useState<Map<string, Progress>>(new Map())
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const toast = useCallback((msg: string) => {
    setToastMsg(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2600)
  }, [])

  const refreshMe = useCallback(async () => {
    try {
      setMe(await api.getMe())
    } catch {
      setMe(null)
    }
  }, [])

  const reloadContent = useCallback(async () => {
    setContentError(null)
    try {
      const [tracks, lessons, materials, prog] = await Promise.all([
        api.listTracks(),
        api.listLessons(),
        api.listMaterials(),
        api.listProgress(),
      ])
      setContent({ tracks, lessons, materials })
      setProgress(new Map(prog.map((p) => [p.lesson_id, p])))
    } catch (e) {
      setContentError(e instanceof Error ? e.message : 'Não foi possível carregar o conteúdo.')
    }
  }, [])

  // Tema: aplica o salvo assim que chega (antes do login, para a tela de entrada).
  useEffect(() => {
    api
      .getSettings()
      .then((s) => {
        setSettings(s)
        applyTheme(s.accent, s.base)
      })
      .catch(() => applyTheme(DEFAULT_SETTINGS.accent, DEFAULT_SETTINGS.base))
  }, [])

  // Sessão
  useEffect(() => {
    let alive = true
    api.getUser().then(async (u) => {
      if (!alive) return
      setUser(u)
      if (u) await refreshMe()
      setBooting(false)
    })
    const off = api.onAuthChange((u) => {
      setUser((prev) => {
        if (prev?.id === u?.id) return prev
        if (!u) {
          setMe(null)
          setContent(null)
          setProgress(new Map())
        }
        return u
      })
      if (u) void refreshMe()
    })
    return () => {
      alive = false
      off()
    }
  }, [refreshMe])

  useEffect(() => {
    if (me?.hasAccess) void reloadContent()
  }, [me?.hasAccess, me?.profile.id, reloadContent])

  const previewTheme = useCallback((accent: string, base: AppSettings['base']) => applyTheme(accent, base), [])

  const saveSettings = useCallback(async (patch: Partial<AppSettings>) => {
    const s = await api.updateSettings(patch)
    setSettings(s)
    applyTheme(s.accent, s.base)
  }, [])

  const saveProgress = useCallback(
    async (lessonId: string, checked: string[], completed: boolean) => {
      const optimistic: Progress = {
        user_id: me?.profile.id ?? '',
        lesson_id: lessonId,
        checked,
        completed_at: completed ? new Date().toISOString() : null,
      }
      const before = progress.get(lessonId)
      setProgress((m) => new Map(m).set(lessonId, optimistic))
      try {
        const saved = await api.saveProgress(lessonId, checked, completed)
        setProgress((m) => new Map(m).set(lessonId, saved))
      } catch (e) {
        setProgress((m) => {
          const n = new Map(m)
          if (before) n.set(lessonId, before)
          else n.delete(lessonId)
          return n
        })
        toast(e instanceof Error ? e.message : 'Não foi possível salvar.')
      }
    },
    [me?.profile.id, progress, toast],
  )

  const value = useMemo<Store>(
    () => ({
      booting,
      settings,
      previewTheme,
      saveSettings,
      user,
      me,
      refreshMe,
      content,
      contentError,
      reloadContent,
      progress,
      saveProgress,
      toast,
    }),
    [booting, settings, previewTheme, saveSettings, user, me, refreshMe, content, contentError, reloadContent, progress, saveProgress, toast],
  )

  return (
    <Ctx.Provider value={value}>
      {children}
      {toastMsg && (
        <div className="toast" role="status">
          {toastMsg}
        </div>
      )}
    </Ctx.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): Store {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore fora do StoreProvider')
  return v
}
