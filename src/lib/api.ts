import type {
  AppSettings,
  Call,
  CallQuestion,
  CheckinInput,
  CheckpointReview,
  WeeklyCheckin,
  EnrollmentStatus,
  Lead,
  Lesson,
  Material,
  Me,
  Progress,
  StudentRow,
  Track,
  WorkspaceEntry,
} from './types'
import { createSupabaseApi } from './api-supabase'
import { createDemoApi } from './api-demo'

export interface AuthUser {
  id: string
  email: string | null
}

// Contrato único de dados. Duas implementações: Supabase (produção) e demonstração
// (localStorage), usada quando o projeto ainda não tem as chaves configuradas.
export interface Api {
  mode: 'supabase' | 'demo'

  // sessão
  getUser(): Promise<AuthUser | null>
  onAuthChange(cb: (user: AuthUser | null) => void): () => void
  signIn(email: string, password: string): Promise<void>
  /** Retorna true quando o Supabase pede confirmação por e-mail antes do primeiro login. */
  signUp(fullName: string, email: string, password: string): Promise<{ needsConfirmation: boolean }>
  signOut(): Promise<void>
  resetPassword(email: string): Promise<void>
  getMe(): Promise<Me | null>

  // aparência
  getSettings(): Promise<AppSettings>
  updateSettings(patch: Partial<AppSettings>): Promise<AppSettings>

  // conteúdo (o aluno só recebe o publicado; admin recebe tudo)
  listTracks(): Promise<Track[]>
  listLessons(): Promise<Lesson[]>
  listMaterials(): Promise<Material[]>
  materialUrl(m: Material): Promise<string | null>

  // progresso do usuário logado
  /** Sem userId: do usuário logado. Com userId: só o admin (para acompanhar um aluno). */
  listProgress(userId?: string): Promise<Progress[]>
  saveProgress(lessonId: string, checked: string[], completed: boolean): Promise<Progress>

  // meu negócio (espaço de trabalho do aluno). userId só para o admin consultar um aluno.
  listWorkspace(userId?: string): Promise<WorkspaceEntry[]>
  saveWorkspace(key: string, data: Record<string, unknown>): Promise<WorkspaceEntry>
  listLeads(userId?: string): Promise<Lead[]>
  saveLead(l: Partial<Lead> & { name: string }): Promise<Lead>
  deleteLead(id: string): Promise<void>

  // revisão das entregas. Aluno: só as dele. Admin: todas (ou de um aluno, com userId).
  listReviews(userId?: string): Promise<CheckpointReview[]>
  submitReview(lessonId: string, note: string): Promise<CheckpointReview>
  /** Só o admin. */
  reviewCheckpoint(id: string, status: 'approved' | 'changes', note: string): Promise<CheckpointReview>

  // check-in semanal (ordem: semana mais antiga primeiro). userId só para o admin.
  listCheckins(userId?: string): Promise<WeeklyCheckin[]>
  /** Cria ou atualiza o check-in da semana (uma linha por semana). */
  saveCheckin(c: CheckinInput): Promise<WeeklyCheckin>

  // calls ao vivo (ordem: mais antiga primeiro)
  listCalls(): Promise<Call[]>
  /** Só o admin. */
  saveCall(c: Partial<Call> & { title: string; starts_at: string }): Promise<Call>
  /** Só o admin. */
  deleteCall(id: string): Promise<void>
  /** Aluno: só as dele. Admin: todas. */
  listCallQuestions(callId?: string): Promise<CallQuestion[]>
  askQuestion(callId: string, question: string): Promise<CallQuestion>
  deleteQuestion(id: string): Promise<void>

  // admin
  saveTrack(t: Partial<Track> & { title: string }): Promise<Track>
  deleteTrack(id: string): Promise<void>
  saveLesson(l: Partial<Lesson> & { track_id: string; title: string }): Promise<Lesson>
  deleteLesson(id: string): Promise<void>
  saveMaterial(m: Partial<Material> & { title: string }): Promise<Material>
  deleteMaterial(id: string): Promise<void>
  /** Envia o arquivo para o bucket privado e devolve o caminho a gravar em storage_path. */
  uploadMaterialFile(file: File): Promise<string>
  listStudents(): Promise<StudentRow[]>
  setEnrollment(userId: string, status: EnrollmentStatus, expiresAt: string | null): Promise<void>
}

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const api: Api = url && key ? createSupabaseApi(url, key) : createDemoApi()
