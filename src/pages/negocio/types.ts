import type { ComponentType } from 'react'
import type { IconName } from '../../components/Icon'
import type { FormSchema } from './forms'

type Data = Record<string, unknown>

/** Progresso de uma ferramenta (0 a 1) calculado a partir das fichas salvas. */
export type ToolProgress = (get: (key: string) => Data, extra: { leads: number }) => number

export type ToolGroup = 'plano' | 'financas' | 'rotina' | 'consulta'

export interface ToolDef {
  key: string
  title: string
  desc: string
  group: ToolGroup
  icon: IconName
  /** Aula relacionada (para o link "Rever a aula"). */
  lesson?: { slug: string; position: number }
  type: 'form' | 'custom' | 'guide'
  schema?: FormSchema
  Component?: ComponentType
  progress?: ToolProgress
  guide?: string
}
