import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext.jsx'
import { Toaster } from 'react-hot-toast'
import ScrollToTop from './components/ScrollToTop.jsx'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <WatchlistProvider>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </WatchlistProvider>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  </StrictMode>
)

