import { NavLink, Outlet } from 'react-router-dom'
import { api } from '../../lib/api'

export function AdminLayout() {
  return (
    <>
      <div className="page-title r">
        <div className="ey">Painel do gestor</div>
        <h1>Bastidores da mentoria</h1>
        <p>Conteúdo, alunos e a aparência da plataforma. O que você salva aqui vale na hora para todos.</p>
      </div>
      <nav className="adm-tabs r" aria-label="Seções do admin" style={{ ['--i' as string]: 1 }}>
        <NavLink to="conteudo">Conteúdo</NavLink>
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
