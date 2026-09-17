import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ShopProvider } from './context/ShopContext.jsx'
import { Toaster } from 'sonner'
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <ShopProvider>
        <App />
        <Toaster position="bottom-right" richColors />
      </ShopProvider>
    </GoogleOAuthProvider>
  </>,
)
