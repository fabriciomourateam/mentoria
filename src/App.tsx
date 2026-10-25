import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useStore } from './lib/store'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminAppearance } from './pages/admin/AdminAppearance'
import { AdminContent, AdminLessonEdit, AdminTrackEdit } from './pages/admin/AdminContent'
import { AdminStudents } from './pages/admin/AdminStudents'
import { AdminStudentView } from './pages/admin/AdminStudentView'
import { Business } from './pages/Business'
import { ToolPage } from './pages/negocio/ToolPage'
import { Home } from './pages/Home'
import { LessonPage } from './pages/Lesson'
import { Library } from './pages/Library'
import { Login } from './pages/Login'
import { Pending } from './pages/Pending'
import { TrackPage, Tracks } from './pages/Tracks'

function Boot() {
  const { settings } = useStore()
  return (
    <div className="boot" aria-busy="true">
      <span className="m">{(settings.brand_name || 'M').charAt(0)}</span>
    </div>
  )
}

/** Logado + matrícula ativa (ou admin). */
function RequireAccess({ children }: { children: ReactNode }) {
  const { booting, user, me } = useStore()
  if (booting || (user && !me)) return <Boot />
  if (!user) return <Navigate to="/entrar" replace />
  if (!me?.hasAccess) return <Navigate to="/aguardando" replace />
  return <>{children}</>
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const { me } = useStore()
  if (!me?.isAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}

function Gate({ children }: { children: ReactNode }) {
  const { booting, user, me } = useStore()
  if (booting || (user && !me)) return <Boot />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/entrar"
          element={
            <Gate>
              <Login />
            </Gate>
          }
        />
        <Route
          path="/aguardando"
          element={
            <Gate>
              <Pending />
            </Gate>
          }
        />
        <Route
          element={
            <RequireAccess>
              <Layout />
            </RequireAccess>
          }
        >
          <Route index element={<Home />} />
          <Route path="trilhas" element={<Tracks />} />
          <Route path="trilhas/:slug" element={<TrackPage />} />
          <Route path="aula/:id" element={<LessonPage />} />
          <Route path="biblioteca" element={<Library />} />
          <Route path="negocio" element={<Business />} />
          <Route path="negocio/:tool" element={<ToolPage />} />
          <Route
            path="admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Navigate to="conteudo" replace />} />
            <Route path="conteudo" element={<AdminContent />} />
            <Route path="conteudo/trilha/:trackId" element={<AdminTrackEdit />} />
            <Route path="conteudo/aula/:lessonId" element={<AdminLessonEdit />} />
            <Route path="alunos" element={<AdminStudents />} />
            <Route path="alunos/:id" element={<AdminStudentView />} />
            <Route path="alunos/:id/:tool" element={<AdminStudentView />} />
            <Route path="aparencia" element={<AdminAppearance />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
