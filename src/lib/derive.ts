import type { Content } from './store'
import type { Lesson, Material, Progress, Track } from './types'

export type ProgressMap = Map<string, Progress>

export const isDone = (p: ProgressMap, lessonId: string) => !!p.get(lessonId)?.completed_at

export function sortedTracks(c: Content): Track[] {
  return [...c.tracks].sort((a, b) => a.position - b.position)
}

export function lessonsOf(c: Content, trackId: string): Lesson[] {
  return c.lessons.filter((l) => l.track_id === trackId).sort((a, b) => a.position - b.position)
}

/** Todas as aulas na ordem recomendada (trilha 0 primeiro). */
export function flatLessons(c: Content): Lesson[] {
  return sortedTracks(c).flatMap((t) => lessonsOf(c, t.id))
}

export function trackStats(c: Content, p: ProgressMap, trackId: string) {
  const ls = lessonsOf(c, trackId)
  const done = ls.filter((l) => isDone(p, l.id)).length
  return { total: ls.length, done, pct: ls.length ? Math.round((done / ls.length) * 100) : 0 }
}

export function overall(c: Content, p: ProgressMap) {
  const all = flatLessons(c)
  const done = all.filter((l) => isDone(p, l.id)).length
  const cps = all.filter((l) => l.checkpoint_title)
  const tracksDone = sortedTracks(c).filter((t) => {
    const s = trackStats(c, p, t.id)
    return s.total > 0 && s.done === s.total
  }).length
  return {
    total: all.length,
    done,
    pct: all.length ? Math.round((done / all.length) * 100) : 0,
    checkpoints: cps.length,
    checkpointsDone: cps.filter((l) => isDone(p, l.id)).length,
    tracks: c.tracks.length,
    tracksDone,
  }
}

export function nextLesson(c: Content, p: ProgressMap): Lesson | null {
  return flatLessons(c).find((l) => !isDone(p, l.id)) ?? null
}

/** Próximo checkpoint ainda não concluído (o "marco" da tela inicial). */
export function nextCheckpoint(c: Content, p: ProgressMap) {
  const all = flatLessons(c)
  const idx = all.findIndex((l) => l.checkpoint_title && !isDone(p, l.id))
  if (idx < 0) return null
  const lesson = all[idx]
  const pending = all.slice(0, idx + 1).filter((l) => !isDone(p, l.id)).length
  return { lesson, pending }
}

export function lessonContext(c: Content, lessonId: string) {
  const lesson = c.lessons.find((l) => l.id === lessonId)
  if (!lesson) return null
  const track = c.tracks.find((t) => t.id === lesson.track_id) ?? null
  const siblings = lessonsOf(c, lesson.track_id)
  const flat = flatLessons(c)
  const i = flat.findIndex((l) => l.id === lessonId)
  return {
    lesson,
    track,
    siblings,
    index: siblings.findIndex((l) => l.id === lessonId) + 1,
    prev: i > 0 ? flat[i - 1] : null,
    next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null,
  }
}

export function materialsFor(c: Content, trackId: string, lessonId?: string): Material[] {
  return c.materials
    .filter((m) => (lessonId && m.lesson_id === lessonId) || (m.track_id === trackId && (!m.lesson_id || m.lesson_id === lessonId)))
    .sort((a, b) => a.position - b.position)
}

export function trackLabel(t: Track): string {
  return t.is_entry ? 'Trilha de entrada' : `Pilar ${t.position}`
}

export function firstName(name: string | null | undefined): string {
  return (name ?? '').trim().split(/\s+/)[0] || ''
}

export function initials(name: string | null | undefined, email?: string | null): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (email ?? '?').slice(0, 2).toUpperCase()
}
