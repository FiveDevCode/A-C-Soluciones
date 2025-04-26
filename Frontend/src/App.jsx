import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HeaderAd } from './components/administrator/HeaderAd'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeaderAd />
  </StrictMode>,
)
