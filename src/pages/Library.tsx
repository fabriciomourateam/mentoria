import { useState } from 'react'
import { Icon, KIND_LABEL, TRACK_ICON } from '../components/Icon'
import { Empty, MaterialRow, Skeleton } from '../components/ui'
import { sortedTracks } from '../lib/derive'
import { useStore } from '../lib/store'
import type { MaterialKind } from '../lib/types'

const KINDS: (MaterialKind | 'todos')[] = ['todos', 'documento', 'planilha', 'guia', 'checklist']

export function Library() {
  const { content } = useStore()
  const [kind, setKind] = useState<MaterialKind | 'todos'>('todos')
  if (!content) return <Skeleton rows={3} />

  const groups = sortedTracks(content)
    .map((t) => ({
      t,
      items: content.materials
        .filter((m) => m.track_id === t.id && (kind === 'todos' || m.kind === kind))
        .sort((a, b) => a.position - b.position),
    }))
    .filter((g) => g.items.length)

  return (
    <>
      <div className="page-title r">
        <div className="ey">Biblioteca</div>
        <h1>Modelos prontos para usar no seu negócio.</h1>
        <p>Documentos, planilhas e guias de cada trilha. Baixe, adapte para o seu nicho e use no mesmo dia.</p>
      </div>

      <div className="adm-tabs r" role="tablist" aria-label="Filtrar por tipo" style={{ ['--i' as string]: 1 }}>
        {KINDS.map((k) => (
          <a
            key={k}
            href="#"
            role="tab"
            aria-selected={kind === k}
            className={kind === k ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault()
              setKind(k)
            }}
          >
            {k === 'todos' ? 'Todos' : `${KIND_LABEL[k]}s`}
          </a>
        ))}
      </div>

      {groups.length === 0 ? (
        <Empty icon="book" title="Nada por aqui ainda">
          Os materiais aparecem aqui conforme forem publicados.
        </Empty>
      ) : (
        <div className="grid g2" style={{ alignItems: 'start' }}>
          {groups.map(({ t, items }, i) => (
            <div key={t.id} className="card box r" style={{ padding: '18px 18px 10px', ['--i' as string]: i + 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="chip-i">
                  <Icon name={TRACK_ICON[t.slug] ?? 'layers'} />
                </span>
                <b className="dsp" style={{ fontSize: 15.5 }}>
                  {t.title}
                </b>
              </div>
              {items.map((m) => (
                <MaterialRow key={m.id} m={m} />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
