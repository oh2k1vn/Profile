import { StrictMode } from 'react'

import { RouterProvider } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'

import '@/app/assets/style/index.css'
import '@/app/assets/style/keyframes.css'
import '@/app/assets/style/variable.css'

import { ThemeProvider } from './app/providers/ThemeProvider'
import { router } from './app/router'
import reportWebVitals from './reportWebVitals'
import { useFirebaseAuth } from './shared/hooks/useFirebaseAuth'

function App() {
  const auth = useFirebaseAuth()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} context={{ auth }} />
    </ThemeProvider>
  )
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

reportWebVitals()
