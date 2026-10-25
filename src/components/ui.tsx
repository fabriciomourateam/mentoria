import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { useStore } from '../lib/store'
import type { Material } from '../lib/types'
import { Icon, KIND_ICON, KIND_LABEL } from './Icon'
import type { IconName } from './Icon'

/** Botão pílula com ícone aninhado (link interno, externo ou ação). */
export function CTA({
  to,
  href,
  onClick,
  children,
  icon = 'arrow',
  variant,
  disabled,
  type = 'button',
}: {
  to?: string
  href?: string
  onClick?: () => void
  children: ReactNode
  icon?: IconName | null
  // Uma ou mais variantes separadas por espaço: light, ghost, sm, block, danger.
  variant?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  const cls = `btn ${variant ?? ''} ${icon ? '' : 'plain'}`
  const inner = (
    <>
      <span className="t">{children}</span>
      {icon && (
        <span className="bi">
          <Icon name={icon} />
        </span>
      )}
    </>
  )
  if (to)
    return (
      <Link className={cls} to={to} aria-disabled={disabled}>
        {inner}
      </Link>
    )
  if (href)
    return (
      <a className={cls} href={href} target="_blank" rel="noreferrer">
        {inner}
      </a>
    )
  return (
    <button className={cls} onClick={onClick} disabled={disabled} type={type}>
      {inner}
    </button>
  )
}

export function Empty({ icon = 'sparkle', title, children, action }: { icon?: IconName; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="card empty r">
      <div className="ei">
        <Icon name={icon} />
      </div>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}

export function Skeleton({ rows = 3, h = 120 }: { rows?: number; h?: number }) {
  return (
    <div className="stack" aria-busy="true" aria-label="Carregando">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="sk" style={{ height: i === 0 ? h * 1.6 : h }} />
      ))}
    </div>
  )
}

export function ProgressBar({ pct }: { pct: number }) {
  return (
    <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${Math.max(pct, pct > 0 ? 4 : 0)}%` }} />
    </div>
  )
}

/** Linha de material: baixa por URL assinada; sem arquivo mostra "em breve". */
export function MaterialRow({ m }: { m: Material }) {
  const { toast } = useStore()
  const ready = !!(m.storage_path || m.external_url)
  const body = (
    <>
      <span className="ri">
        <Icon name={KIND_ICON[m.kind] ?? 'doc'} />
      </span>
      <span className="tx">
        <span className="rn" style={{ display: 'block' }}>
          {m.title}
        </span>
        <span className="rt" style={{ display: 'block' }}>
          {m.description || KIND_LABEL[m.kind]}
        </span>
      </span>
      {ready ? (
        <span className="dl">
          <Icon name={m.storage_path ? 'download' : 'external'} />
        </span>
      ) : (
        <span className="pill">Em breve</span>
      )}
    </>
  )
  if (!ready) return <div className="res">{body}</div>
  return (
    <button
      className="res"
      onClick={async () => {
        try {
          const url = await api.materialUrl(m)
          if (url) window.open(url, '_blank', 'noopener')
          else toast('Arquivo indisponível no momento.')
        } catch (e) {
          toast(e instanceof Error ? e.message : 'Não foi possível abrir o arquivo.')
        }
      }}
    >
      {body}
    </button>
  )
}
