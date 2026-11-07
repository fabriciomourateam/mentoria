import type { ComponentType } from 'react'
import { CalendarioInsights } from './CalendarioInsights'
import { DiagnosticoInsights } from './DiagnosticoInsights'
import { FunilInsights } from './FunilInsights'
import { OkrInsights } from './OkrInsights'
import { AlunoIdealInsights, OfertaInsights } from './PrecoInsights'

/** Painéis calculados que aparecem acima das fichas (por chave da ferramenta). */
export const INSIGHTS: Record<string, ComponentType> = {
  diagnostico: DiagnosticoInsights,
  okr: OkrInsights,
  funil: FunilInsights,
  oferta: OfertaInsights,
  'aluno-ideal': AlunoIdealInsights,
  calendario: CalendarioInsights,
}
