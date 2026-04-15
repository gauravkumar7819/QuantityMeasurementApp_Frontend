import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { GoogleAuthProvider } from './context/GoogleAuthContext'
import './index.css'
import App from './App.jsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Log initialization
console.log('[Google OAuth] Initializing with client ID:', googleClientId);

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <StrictMode>
      <GoogleAuthProvider>
        <App />
      </GoogleAuthProvider>
    </StrictMode>
  </GoogleOAuthProvider>,
)
