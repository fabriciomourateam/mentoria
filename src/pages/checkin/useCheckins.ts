import { useCallback, useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useStore } from '../../lib/store'
import type { WeeklyCheckin } from '../../lib/types'
import { weekStart } from '../../lib/dates'

const EVENT = 'checkin:changed'

/** Check-ins do aluno (mais antigo primeiro). `rows` é null enquanto carrega. */
export function useCheckins(userId?: string) {
  const [rows, setRows] = useState<WeeklyCheckin[] | null>(null)
  const [error, setError] = useState(false)
  const load = useCallback(() => {
    api
      .listCheckins(userId)
      .then((r) => {
        setRows(r)
        setError(false)
      })
      .catch(() => {
        setRows((prev) => prev ?? [])
        setError(true)
      })
  }, [userId])
  useEffect(() => {
    setRows(null)
    load()
    const h = () => load()
    window.addEventListener(EVENT, h)
    return () => window.removeEventListener(EVENT, h)
  }, [load])
  return { rows, error, reload: load }
}

export function notifyCheckinChanged() {
  window.dispatchEvent(new Event(EVENT))
}

/** true se o aluno logado ainda NÃO fez o check-in desta semana (null enquanto carrega). */
export function useCheckinDue(): boolean | null {
  const { me } = useStore()
  const { rows } = useCheckins()
  if (!me || rows === null) return null
  const ws = weekStart()
  return !rows.some((r) => r.week_start === ws)
}
