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

// Prevent scrolling on number inputs from changing their value
document.addEventListener("wheel", (event) => {
  if (document.activeElement.type === "number") {
    document.activeElement.blur();
  }
});

// Prevent typing non-numeric characters (like 'e', 'E', '+', '-', '.') in number inputs
document.addEventListener("keydown", (event) => {
  if (event.target.type === "number") {
    const invalidChars = ["e", "E", "+", "-", "."];
    if (invalidChars.includes(event.key)) {
      event.preventDefault();
    }
  }
});
