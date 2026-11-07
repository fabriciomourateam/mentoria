import { has, num, precoMensal } from '../financas/calc'
import type { Data, Get } from '../financas/calc'

/** Parte da margem do aluno que pode virar custo de aquisição. */
export const CAC_SHARE = 0.3

/** Cálculos da calculadora de tráfego (LTV, CAC e custo por lead máximos, projeção mensal). */
export function trafegoCalc(d: Data, get: Get) {
  const ticketSug = precoMensal(get)
  const ticket = has(d.ticket) ? num(d.ticket) : ticketSug
  const meses = num(d.meses)
  const margem = num(d.margem) / 100
  const convVenda = num(d.conv_venda) / 100
  const convConversa = has(d.conv_conversa) ? num(d.conv_conversa) / 100 : 1
  const orcamento = num(d.orcamento)
  const cpl = num(d.cpl)

  const ltv = ticket * meses
  const margemAluno = ltv * margem
  const cacMax = margemAluno * CAC_SHARE
  const leadVenda = convConversa * convVenda
  const cplMax = cacMax * leadVenda
  const cpcMax = cacMax * convVenda

  const gasto = orcamento * 30
  const cplUsado = cpl > 0 ? cpl : cplMax
  const leads = cplUsado > 0 ? gasto / cplUsado : 0
  const conversas = leads * convConversa
  const vendas = conversas * convVenda
  const fatNovo = vendas * ticket
  const retorno = vendas * ltv
  const roas = gasto > 0 ? retorno / gasto : 0
  const cacReal = vendas > 0 ? gasto / vendas : 0

  const base = ltv > 0 && margem > 0 && convVenda > 0
  let veredito: { tone: 'ok' | 'warn' | 'bad'; label: string } | null = null
  if (base && cpl > 0 && cplMax > 0) {
    veredito =
      cpl <= cplMax
        ? { tone: 'ok', label: 'dentro do máximo' }
        : cpl <= cplMax * 1.3
          ? { tone: 'warn', label: 'no limite' }
          : { tone: 'bad', label: 'acima do máximo' }
  }
  return { ticketSug, ticket, ltv, margemAluno, cacMax, cplMax, cpcMax, leadVenda, gasto, cplUsado, leads, conversas, vendas, fatNovo, roas, cacReal, base, veredito, usouMax: cpl <= 0 }
}
