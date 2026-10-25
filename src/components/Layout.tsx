import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { initials } from '../lib/derive'
import { useStore } from '../lib/store'
import { Icon } from './Icon'

const NAV = [
  { to: '/', label: 'Início', icon: 'home', end: true },
  { to: '/trilhas', label: 'Trilhas', icon: 'layers', end: false },
  { to: '/biblioteca', label: 'Biblioteca', icon: 'book', end: false },
  { to: '/negocio', label: 'Meu Negócio', icon: 'briefcase', end: false },
] as const

export function Brand() {
  const { settings } = useStore()
  const name = settings.brand_name || 'Mentoria'
  return (
    <span className="logo">
      <span className="m">{name.charAt(0).toUpperCase()}</span>
      <span className="bt">{name}</span>
    </span>
  )
}

function AvatarMenu() {
  const { me } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const nav = useNavigate()
  const loc = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [loc.pathname])
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  if (!me) return null
  return (
    <div className="menu-wrap" ref={ref}>
      <button className="av" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)} aria-label="Sua conta">
        {initials(me.profile.full_name, me.profile.email)}
      </button>
      {open && (
        <div className="menu" role="menu">
          <div className="who">
            <b>{me.profile.full_name || 'Sua conta'}</b>
            <span>{me.profile.email}</span>
          </div>
          {me.isAdmin && (
            <Link to="/admin" role="menuitem">
              <Icon name="settings" /> Painel do gestor
            </Link>
          )}
          <button
            role="menuitem"
            onClick={async () => {
              await api.signOut()
              nav('/entrar', { replace: true })
            }}
          >
            <Icon name="logout" /> Sair
          </button>
        </div>
      )}
    </div>
  )
}

export function Layout() {
  const { me } = useStore()
  const loc = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [loc.pathname])

  return (
    <>
      <header className="top">
        <div className="in">
          <Link to="/" aria-label="Início">
            <Brand />
          </Link>
          <nav className="spaces" aria-label="Principal">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="rt">
            {me?.isAdmin && (
              <Link className="icon-btn" to="/admin" title="Painel do gestor" aria-label="Painel do gestor">
                <Icon name="settings" />
              </Link>
            )}
            <AvatarMenu />
          </div>
        </div>
      </header>
      <main className="main">
        <div className="wrap">
          <Outlet />
        </div>
      </main>
      <nav className="tabbar" aria-label="Principal">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}>
            <Icon name={n.icon} />
            {n.label === 'Meu Negócio' ? 'Negócio' : n.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
