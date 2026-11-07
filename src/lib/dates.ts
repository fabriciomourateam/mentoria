// Datas sempre no fuso de São Paulo (UTC-3, sem horário de verão).

const TZ = 'America/Sao_Paulo'

/** "YYYY-MM-DD" do dia em São Paulo. */
export function dayBRT(d: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
}

/** Soma dias a um "YYYY-MM-DD" (sem fuso: aritmética de calendário). */
export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d + n))
  return t.toISOString().slice(0, 10)
}

/** Segunda-feira da semana (em São Paulo) da data dada. */
export function weekStart(d: Date = new Date()): string {
  const day = dayBRT(d)
  const [y, m, dd] = day.split('-').map(Number)
  const dow = new Date(Date.UTC(y, m - 1, dd)).getUTCDay() // 0 = domingo
  return addDays(day, dow === 0 ? -6 : 1 - dow)
}

/** "03/11" ou "03/11/2026". */
export function fmtDay(day: string, withYear = false): string {
  const [y, m, d] = day.split('-')
  return withYear ? `${d}/${m}/${y}` : `${d}/${m}`
}

/** "Semana de 03/11 a 09/11". */
export function weekLabel(start: string): string {
  return `${fmtDay(start)} a ${fmtDay(addDays(start, 6))}`
}

/** Data e hora de um ISO, em São Paulo: "qua, 12/11 · 20:00". */
export function fmtDateTime(iso: string): string {
  const d = new Date(iso)
  const wd = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, weekday: 'short' }).format(d).replace('.', '')
  const dm = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, day: '2-digit', month: '2-digit' }).format(d)
  const hm = new Intl.DateTimeFormat('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' }).format(d)
  return `${wd}, ${dm} · ${hm}`
}

/** Junta data ("YYYY-MM-DD") e hora ("HH:MM") de São Paulo num ISO. */
export function brtToIso(day: string, time: string): string {
  return new Date(`${day}T${time || '00:00'}:00-03:00`).toISOString()
}

/** Separa um ISO em data e hora de São Paulo (para preencher formulário). */
export function isoToBrt(iso: string): { day: string; time: string } {
  const d = new Date(iso)
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: false }).format(d)
  return { day: dayBRT(d), time }
}
