import { useEffect, useState } from 'react'
import { addDays, dayBRT } from '../../lib/dates'
import type { Call } from '../../lib/types'

const MIN = 60_000

/** Ao vivo: de 15 min antes do início até 2h depois. */
export function isLive(c: Call, now: number): boolean {
  const t = new Date(c.starts_at).getTime()
  return now >= t - 15 * MIN && now <= t + 120 * MIN
}

/** Próxima call: a primeira com início >= agora - 2h (lista em ordem crescente). */
export function pickNext(calls: Call[], now: number): Call | null {
  return (
    [...calls]
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at))
      .find((c) => new Date(c.starts_at).getTime() >= now - 120 * MIN) ?? null
  )
}

/** "hoje", "amanhã" ou "em N dias" (dias de São Paulo). */
export function relativeDay(iso: string, now: number): string {
  const today = dayBRT(new Date(now))
  const day = dayBRT(new Date(iso))
  if (day === today) return 'hoje'
  if (day === addDays(today, 1)) return 'amanhã'
  const diff = Math.round((Date.parse(day) - Date.parse(today)) / 86_400_000)
  return diff > 0 ? `em ${diff} dias` : 'já passou'
}

/** Link "Adicionar ao Google Agenda" (1h de duração, UTC). */
export function calendarUrl(c: Call): string {
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const start = new Date(c.starts_at)
  const end = new Date(start.getTime() + 60 * MIN)
  const details = [c.agenda, c.meet_url ? `Meet: ${c.meet_url}` : ''].filter(Boolean).join('\n\n')
  const p = new URLSearchParams({ action: 'TEMPLATE', text: c.title, dates: `${f(start)}/${f(end)}`, details })
  if (c.meet_url) p.set('location', c.meet_url)
  return `https://calendar.google.com/calendar/render?${p.toString()}`
}

/** Relógio que atualiza a cada 30s (para o estado "ao vivo"). */
export function useNow(): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return now
}
