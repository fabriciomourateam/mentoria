import type { ComponentType } from 'react'
import { DiagnosticoInsights } from './DiagnosticoInsights'
import { FunilInsights } from './FunilInsights'
import { OkrInsights } from './OkrInsights'

/** Painéis calculados que aparecem acima das fichas (por chave da ferramenta). */
export const INSIGHTS: Record<string, ComponentType> = {
  diagnostico: DiagnosticoInsights,
  okr: OkrInsights,
  funil: FunilInsights,
}
