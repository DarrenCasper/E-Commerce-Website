import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './components/cartContext'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from './components/AuthProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
       <CartProvider>
        <BrowserRouter>
          <App />
          <Toaster/>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
