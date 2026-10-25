export type Role = 'student' | 'admin'
export type EnrollmentStatus = 'active' | 'paused' | 'canceled'
export type BaseTheme = 'light' | 'graphite' | 'dark'
export type MaterialKind = 'documento' | 'planilha' | 'guia' | 'checklist'

export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  role: Role
  created_at: string
}

export interface Enrollment {
  user_id: string
  status: EnrollmentStatus
  source: 'manual' | 'kiwify'
  started_at: string
  expires_at: string | null
}

export interface Me {
  profile: Profile
  enrollment: Enrollment | null
  isAdmin: boolean
  hasAccess: boolean
}

export interface Track {
  id: string
  slug: string
  position: number
  title: string
  promise: string | null
  checkpoint: string | null
  is_entry: boolean
  published: boolean
}

export interface ChecklistItem {
  id: string
  text: string
  hint?: string
}

export interface Lesson {
  id: string
  track_id: string
  position: number
  title: string
  objective: string | null
  body_md: string
  checklist: ChecklistItem[]
  checkpoint_title: string | null
  published: boolean
  updated_at?: string
}

export interface Material {
  id: string
  track_id: string | null
  lesson_id: string | null
  title: string
  description: string | null
  kind: MaterialKind
  storage_path: string | null
  external_url: string | null
  position: number
}

export interface Progress {
  user_id: string
  lesson_id: string
  checked: string[]
  completed_at: string | null
}

export interface AppSettings {
  brand_name: string
  accent: string
  base: BaseTheme
  myshape_url: string
}

export interface StudentRow {
  profile: Profile
  enrollment: Enrollment | null
  completedLessons: number
  lastActivity: string | null
}

export type LeadStage = 'novo' | 'conversa' | 'avaliacao' | 'proposta' | 'fechou' | 'perdido'

export interface Lead {
  id: string
  user_id: string
  name: string
  contact: string | null
  origin: string | null
  stage: LeadStage
  next_step: string | null
  /** YYYY-MM-DD (dia de São Paulo) */
  next_date: string | null
  value: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

/** Uma ficha/ferramenta do "Meu Negócio" salva como JSON livre. */
export interface WorkspaceEntry {
  user_id: string
  key: string
  data: Record<string, unknown>
  updated_at: string
}
