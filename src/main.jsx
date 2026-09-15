import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ShopProvider } from './context/ShopContext.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <>
    <ShopProvider>
      <App />
      <Toaster position="bottom-right" richColors />
    </ShopProvider>
  </>,
)
