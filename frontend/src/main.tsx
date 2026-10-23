import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App'
import { IdiomaProvider } from './i18n/idioma'
import { AuthProvider } from './auth/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IdiomaProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </IdiomaProvider>
  </StrictMode>,
)
