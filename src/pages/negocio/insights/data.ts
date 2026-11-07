import { useEffect, useState } from 'react'
import { api } from '../../../lib/api'
import { dayBRT } from '../../../lib/dates'
import type { Lead, WeeklyCheckin } from '../../../lib/types'
import { useWorkspace } from '../../../lib/workspace'

/** Check-ins semanais (mais antigo primeiro). No modo gestor lê os do aluno. */
export function useCheckins() {
  const { userId } = useWorkspace()
  const [rows, setRows] = useState<WeeklyCheckin[]>([])
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    let alive = true
    api
      .listCheckins(userId)
      .then((r) => {
        if (!alive) return
        setRows(r)
        setLoaded(true)
      })
      .catch(() => {
        if (alive) setLoaded(true)
      })
    return () => {
      alive = false
    }
  }, [userId])
  return { rows, loaded }
}

/** Leads do aluno (ou do aluno visto pelo gestor). */
export function useLeadRows() {
  const { userId } = useWorkspace()
  const [rows, setRows] = useState<Lead[]>([])
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    let alive = true
    api
      .listLeads(userId)
      .then((r) => {
        if (!alive) return
        setRows(r)
        setLoaded(true)
      })
      .catch(() => {
        if (alive) setLoaded(true)
      })
    return () => {
      alive = false
    }
  }, [userId])
  return { rows, loaded }
}

/** Mês (AAAA-MM) de um ISO, em São Paulo. */
export const monthOfIso = (iso: string) => dayBRT(new Date(iso)).slice(0, 7)

/** Check-ins agrupados por mês da semana: faturamento somado, vendas somadas, alunos do último check-in. */
export function checkinsByMonth(rows: WeeklyCheckin[]) {
  const map = new Map<string, { mes: string; fat: number | null; vendas: number; alunos: number; leads: number }>()
  for (const r of rows) {
    const mes = r.week_start.slice(0, 7)
    const cur = map.get(mes) ?? { mes, fat: null, vendas: 0, alunos: 0, leads: 0 }
    if (r.faturamento !== null && r.faturamento !== undefined) cur.fat = (cur.fat ?? 0) + Number(r.faturamento)
    cur.vendas += r.vendas
    cur.leads += r.leads
    cur.alunos = r.alunos_ativos
    map.set(mes, cur)
  }
  return [...map.values()].sort((a, b) => a.mes.localeCompare(b.mes))
}

/** Faturamento mensal aproximado: média dos últimos 4 check-ins com valor, vezes 4. */
export function faturamentoMensalAprox(rows: WeeklyCheckin[]): number | null {
  const v = rows
    .filter((r) => r.faturamento !== null && r.faturamento !== undefined)
    .slice(-4)
    .map((r) => Number(r.faturamento))
  if (!v.length) return null
  return (v.reduce((a, b) => a + b, 0) / v.length) * 4
}

/** Semáforo por percentual de progresso. */
export const toneOf = (p: number): 'ok' | 'warn' | 'bad' => (p >= 70 ? 'ok' : p >= 35 ? 'warn' : 'bad')
