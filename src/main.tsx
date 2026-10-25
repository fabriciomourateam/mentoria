import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.tsx'
import { StoreProvider } from './lib/store.tsx'
import { WorkspaceProvider } from './lib/workspace.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <WorkspaceProvider>
        <App />
      </WorkspaceProvider>
    </StoreProvider>
  </StrictMode>,
)
