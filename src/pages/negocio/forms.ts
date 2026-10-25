// Formato das fichas do "Meu Negócio". Cada ficha é descrita por um schema e
// renderizada pelo FormTool; os valores ficam salvos em workspace_entries (chave = key).

export type ColumnKind = 'text' | 'textarea' | 'number' | 'money' | 'select' | 'date'

export interface Column {
  id: string
  label: string
  kind: ColumnKind
  options?: string[]
  placeholder?: string
}

export type Field =
  | { kind: 'text' | 'textarea'; id: string; label: string; hint?: string; placeholder?: string; rows?: number }
  | { kind: 'number' | 'money' | 'percent'; id: string; label: string; hint?: string; placeholder?: string }
  | { kind: 'select'; id: string; label: string; hint?: string; options: string[] }
  | { kind: 'check'; id: string; label: string; hint?: string }
  | {
      kind: 'list'
      id: string
      label: string
      hint?: string
      columns: Column[]
      addLabel: string
      /** Linhas que já aparecem prontas para preencher na primeira vez. */
      startRows?: number
    }

export interface Section {
  title: string
  intro?: string
  fields: Field[]
}

/** Liga a ficha ao checklist de uma aula: itens marcados automaticamente quando a ficha está pronta. */
export interface CheckpointLink {
  slug: string
  position: number
  /** Devolve os ids de itens do checklist que já podem ser marcados com base nos dados da ficha. */
  checked: (data: Record<string, unknown>) => string[]
}

export interface FormSchema {
  sections: Section[]
  checkpoint?: CheckpointLink
}

export type Row = Record<string, string>

export const filled = (v: unknown): boolean => {
  if (v === true) return true
  if (typeof v === 'number') return true
  if (typeof v === 'string') return v.trim().length > 0
  if (Array.isArray(v)) return v.some((r) => r && typeof r === 'object' && Object.values(r).some((x) => filled(x)))
  return false
}

/** Fração (0 a 1) de campos preenchidos da ficha. */
export function formProgress(schema: FormSchema, data: Record<string, unknown>): number {
  const fields = schema.sections.flatMap((s) => s.fields)
  if (!fields.length) return 0
  return fields.filter((f) => filled(data[f.id])).length / fields.length
}
