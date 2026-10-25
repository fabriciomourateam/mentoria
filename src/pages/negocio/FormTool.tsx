import { useEffect, useRef } from 'react'
import { Icon } from '../../components/Icon'
import { useStore } from '../../lib/store'
import { useEntry } from '../../lib/workspace'
import type { Column, Field, FormSchema, Row } from './forms'

/** Renderiza uma ficha a partir do schema, com salvamento automático. */
export function FormTool({ toolKey, schema }: { toolKey: string; schema: FormSchema }) {
  const { data, patch, state, readOnly } = useEntry(toolKey)
  useCheckpointSync(schema, data, readOnly ? 'idle' : state)

  return (
    <fieldset className="stack ro-fieldset" disabled={readOnly}>
      {schema.sections.map((s, i) => (
        <section key={s.title} className="card sec r" style={{ ['--i' as string]: i + 1 }}>
          <h2>{s.title}</h2>
          {s.intro && <p className="sec-intro">{s.intro}</p>}
          <div className="sec-fields">
            {s.fields.map((f) => (
              <FieldInput key={f.id} field={f} value={data[f.id]} onChange={(v) => patch({ [f.id]: v })} />
            ))}
          </div>
        </section>
      ))}
    </fieldset>
  )
}

/** Quando a ficha fica pronta, marca os itens correspondentes no checklist da aula (só adiciona). */
export function useCheckpointSync(schema: FormSchema, data: Record<string, unknown>, state: string) {
  const { content, progress, saveProgress } = useStore()
  const last = useRef('')
  useEffect(() => {
    const cp = schema.checkpoint
    if (!cp || !content || state !== 'saved') return
    const track = content.tracks.find((t) => t.slug === cp.slug)
    const lesson = track && content.lessons.find((l) => l.track_id === track.id && l.position === cp.position)
    if (!lesson) return
    const valid = new Set(lesson.checklist.map((c) => c.id))
    const want = cp.checked(data).filter((id) => valid.has(id))
    const cur = progress.get(lesson.id)
    const have = new Set(cur?.checked ?? [])
    const add = want.filter((id) => !have.has(id))
    const sig = `${lesson.id}:${add.join(',')}`
    if (!add.length || sig === last.current) return
    last.current = sig
    void saveProgress(lesson.id, [...have, ...add], !!cur?.completed_at)
  }, [schema, data, state, content, progress, saveProgress])
}

export function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const str = typeof value === 'string' ? value : typeof value === 'number' ? String(value) : ''
  switch (field.kind) {
    case 'text':
      return (
        <label className="field">
          <span>{field.label}</span>
          <input className="input" value={str} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
          {field.hint && <small>{field.hint}</small>}
        </label>
      )
    case 'textarea':
      return (
        <label className="field">
          <span>{field.label}</span>
          <textarea
            className="textarea"
            rows={field.rows ?? 3}
            style={{ minHeight: 0 }}
            value={str}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.hint && <small>{field.hint}</small>}
        </label>
      )
    case 'number':
    case 'money':
    case 'percent':
      return (
        <label className="field">
          <span>{field.label}</span>
          <span className={`affix ${field.kind}`}>
            {field.kind === 'money' && <i>R$</i>}
            <input
              className="input"
              inputMode="decimal"
              value={str}
              placeholder={field.placeholder}
              onChange={(e) => onChange(e.target.value.replace(/[^\d.,-]/g, ''))}
            />
            {field.kind === 'percent' && <i>%</i>}
          </span>
          {field.hint && <small>{field.hint}</small>}
        </label>
      )
    case 'select':
      return (
        <label className="field">
          <span>{field.label}</span>
          <select className="select" value={str} onChange={(e) => onChange(e.target.value)}>
            <option value="">Escolha...</option>
            {field.options.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {field.hint && <small>{field.hint}</small>}
        </label>
      )
    case 'check': {
      const on = value === true
      return (
        <button type="button" className={`ci ${on ? 'done' : ''}`} aria-pressed={on} onClick={() => onChange(!on)}>
          <span className="bx">
            <Icon name="check" />
          </span>
          <span className="t">
            <span>{field.label}</span>
            {field.hint && <small>{field.hint}</small>}
          </span>
        </button>
      )
    }
    case 'list':
      return <ListField field={field} value={value} onChange={onChange} />
  }
}

function ListField({
  field,
  value,
  onChange,
}: {
  field: Extract<Field, { kind: 'list' }>
  value: unknown
  onChange: (v: unknown) => void
}) {
  const saved = Array.isArray(value) ? (value as Row[]) : null
  const rows: Row[] = saved ?? Array.from({ length: field.startRows ?? 1 }, () => ({}))
  const set = (i: number, col: string, v: string) => onChange(rows.map((r, j) => (j === i ? { ...r, [col]: v } : r)))
  const remove = (i: number) => onChange(rows.filter((_, j) => j !== i))
  return (
    <div className="field">
      <span>{field.label}</span>
      {field.hint && <small style={{ marginTop: -2, marginBottom: 8 }}>{field.hint}</small>}
      <div className="lrows">
        {rows.map((r, i) => (
          <div key={i} className="lrow">
            <div className={`lcols c${Math.min(field.columns.length, 4)}`}>
              {field.columns.map((c) => (
                <ColumnInput key={c.id} col={c} value={r[c.id] ?? ''} onChange={(v) => set(i, c.id, v)} />
              ))}
            </div>
            <button type="button" className="icon-btn lrm" aria-label="Remover linha" title="Remover" onClick={() => remove(i)}>
              <Icon name="trash" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="btn ghost sm" style={{ marginTop: 10, alignSelf: 'flex-start' }} onClick={() => onChange([...rows, {}])}>
        <span className="t">{field.addLabel}</span>
        <span className="bi">
          <Icon name="plus" />
        </span>
      </button>
    </div>
  )
}

function ColumnInput({ col, value, onChange }: { col: Column; value: string; onChange: (v: string) => void }) {
  const label = <span className="lcl">{col.label}</span>
  if (col.kind === 'textarea')
    return (
      <label className="lcol wide">
        {label}
        <textarea className="textarea" rows={2} style={{ minHeight: 0 }} value={value} placeholder={col.placeholder} onChange={(e) => onChange(e.target.value)} />
      </label>
    )
  if (col.kind === 'select')
    return (
      <label className="lcol">
        {label}
        <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Escolha...</option>
          {(col.options ?? []).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
    )
  return (
    <label className="lcol">
      {label}
      <input
        className="input"
        type={col.kind === 'date' ? 'date' : 'text'}
        inputMode={col.kind === 'number' || col.kind === 'money' ? 'decimal' : undefined}
        value={value}
        placeholder={col.placeholder ?? (col.kind === 'money' ? 'R$' : undefined)}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
