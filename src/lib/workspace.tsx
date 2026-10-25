import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { api } from './api'
import { useStore } from './store'

// Espaço de trabalho do aluno: cada ficha/ferramenta é um JSON salvo por chave.
// Salva sozinho enquanto o aluno digita (com um pequeno atraso para não salvar a cada tecla).

type Data = Record<string, unknown>
export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

interface Ctx {
  ready: boolean
  /** Quando o gestor está vendo o espaço de um aluno: id do aluno e modo somente leitura. */
  userId?: string
  readOnly: boolean
  get(key: string): Data
  set(key: string, next: Data): void
  state(key: string): SaveState
  updatedAt(key: string): string | null
}

const WorkspaceCtx = createContext<Ctx | null>(null)
const DELAY = 700

export function WorkspaceProvider({
  children,
  userId,
}: {
  children: ReactNode
  /** Só para o gestor: mostra o espaço deste aluno, sem permitir edição. */
  userId?: string
}) {
  const { me, toast } = useStore()
  const readOnly = !!userId
  const [entries, setEntries] = useState<Map<string, { data: Data; updated_at: string | null }>>(new Map())
  const [states, setStates] = useState<Map<string, SaveState>>(new Map())
  const [ready, setReady] = useState(false)
  const timers = useRef(new Map<string, number>())

  useEffect(() => {
    if (!me?.hasAccess) return
    let alive = true
    api
      .listWorkspace(userId)
      .then((rows) => {
        if (!alive) return
        setEntries(new Map(rows.map((r) => [r.key, { data: r.data ?? {}, updated_at: r.updated_at }])))
        setReady(true)
      })
      .catch(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [me?.hasAccess, me?.profile.id, userId])

  const setState = useCallback((key: string, s: SaveState) => {
    setStates((m) => new Map(m).set(key, s))
  }, [])

  const set = useCallback(
    (key: string, next: Data) => {
      if (readOnly) return
      setEntries((m) => new Map(m).set(key, { data: next, updated_at: m.get(key)?.updated_at ?? null }))
      setState(key, 'saving')
      window.clearTimeout(timers.current.get(key))
      timers.current.set(
        key,
        window.setTimeout(async () => {
          try {
            const row = await api.saveWorkspace(key, next)
            setEntries((m) => {
              const cur = m.get(key)
              // Se o aluno digitou de novo durante o envio, mantém o texto mais novo.
              return new Map(m).set(key, { data: cur?.data ?? row.data, updated_at: row.updated_at })
            })
            setState(key, 'saved')
          } catch (e) {
            setState(key, 'error')
            toast(e instanceof Error ? e.message : 'Não foi possível salvar.')
          }
        }, DELAY),
      )
    },
    [setState, toast, readOnly],
  )

  const value = useMemo<Ctx>(
    () => ({
      ready,
      userId,
      readOnly,
      get: (key) => entries.get(key)?.data ?? {},
      set,
      state: (key) => states.get(key) ?? 'idle',
      updatedAt: (key) => entries.get(key)?.updated_at ?? null,
    }),
    [ready, userId, readOnly, entries, set, states],
  )

  return <WorkspaceCtx.Provider value={value}>{children}</WorkspaceCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkspace(): Ctx {
  const v = useContext(WorkspaceCtx)
  if (!v) throw new Error('useWorkspace fora do WorkspaceProvider')
  return v
}

/** Lê e grava uma ficha. `patch` mescla campos; o salvamento é automático. */
// eslint-disable-next-line react-refresh/only-export-components
export function useEntry<T extends Data = Data>(key: string) {
  const ws = useWorkspace()
  const data = ws.get(key) as T
  const patch = useCallback((p: Partial<T>) => ws.set(key, { ...ws.get(key), ...p }), [ws, key])
  const replace = useCallback((next: T) => ws.set(key, next), [ws, key])
  return {
    data,
    patch,
    replace,
    state: ws.state(key),
    updatedAt: ws.updatedAt(key),
    ready: ws.ready,
    readOnly: ws.readOnly,
    userId: ws.userId,
  }
}

// ---------- helpers numéricos e de formatação (pt-BR) ----------

/** Converte o que o aluno digitou ("1.500,50", "1500.5", "") em número. */
// eslint-disable-next-line react-refresh/only-export-components
export function num(v: unknown): number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  if (typeof v !== 'string') return 0
  const s = v.trim()
  if (!s) return 0
  // "1.500,50" e "12.000" (milhar com ponto) viram 1500.5 e 12000; "1500.5" continua 1500.5.
  const thousands = /^-?\d{1,3}(\.\d{3})+$/.test(s)
  const norm = s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : thousands ? s.replace(/\./g, '') : s
  const n = Number(norm.replace(/[^\d.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

// eslint-disable-next-line react-refresh/only-export-components
export const brl = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: Math.abs(n) >= 1000 ? 0 : 2 })

// eslint-disable-next-line react-refresh/only-export-components
export const pct = (n: number, digits = 1) =>
  `${(n * 100).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: digits })}%`
