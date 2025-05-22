import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import {EnokiFlowProvider} from "@mysten/enoki/react";
import {UserRoleProvider} from "./pages/useRoleContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <UserRoleProvider>
              <EnokiFlowProvider  apiKey={import.meta.env.ENOKI_API_KEY}>
                  <App />
              </EnokiFlowProvider>
          </UserRoleProvider>

      </BrowserRouter>
  </StrictMode>,
)
