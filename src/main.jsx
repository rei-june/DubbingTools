import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import './globals.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ColorSchemeScript defaultColorScheme="auto" />
    <MantineProvider defaultColorScheme="auto">
      <App />
    </MantineProvider>
  </StrictMode>,
)
