import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContext from './contexts/UserContext.jsx'
import CaptainContext from './contexts/CaptainContext.jsx'
import RideContext from './contexts/RideContext.jsx'
import SocketContext from './contexts/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <RideContext>
        <CaptainContext>
          <UserContext>
            <SocketContext>
            <BrowserRouter>
              <App />
            </BrowserRouter>
            </SocketContext>
          </UserContext>
        </CaptainContext>
      </RideContext>
    

  </StrictMode>
)
