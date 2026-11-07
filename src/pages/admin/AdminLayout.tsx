import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { api } from '../../lib/api'
import { pendingCount } from './AdminReviews'

export function AdminLayout() {
  const loc = useLocation()
  const [pending, setPending] = useState(0)
  useEffect(() => {
    api
      .listReviews()
      .then((r) => setPending(pendingCount(r)))
      .catch(() => setPending(0))
  }, [loc.pathname])
  return (
    <>
      <div className="page-title r">
        <div className="ey">Painel do gestor</div>
        <h1>Bastidores da mentoria</h1>
        <p>Conteúdo, alunos e a aparência da plataforma. O que você salva aqui vale na hora para todos.</p>
      </div>
      <nav className="adm-tabs r" aria-label="Seções do admin" style={{ ['--i' as string]: 1 }}>
        <NavLink to="conteudo">Conteúdo</NavLink>
        <NavLink to="revisoes">
          Revisões{pending > 0 && <span className="adm-badge">{pending}</span>}
        </NavLink>
        <NavLink to="alunos">Alunos</NavLink>
        <NavLink to="aparencia">Aparência</NavLink>
      </nav>
      {api.mode === 'demo' && (
        <div className="note r" style={{ marginBottom: 14, ['--i' as string]: 2 }}>
          <b>Modo demonstração:</b> as alterações ficam só neste navegador até o Supabase ser conectado.
        </div>
      )}
      <Outlet />
    </>
  )
}
