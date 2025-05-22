console.log('main.tsx is loaded');
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App';
import { initMonitoring } from './lib/monitoring'
import { initPerformanceMonitoring } from './lib/performance-monitoring'

// Initialiser le monitoring
initMonitoring()

// Initialiser le monitoring des performances
// initPerformanceMonitoring()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)