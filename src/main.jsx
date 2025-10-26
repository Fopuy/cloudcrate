import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from './components/login';
import Register from './components/register.jsx';
import Index from './components/index.jsx'
import ProtectedRoute from './components/protectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: 
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
  },
  {
    path: "login",
    element: <Login />,
  },
  { 
    path: "index",
    element: 
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
  },
  {
    path: "register",
    element:
    <Register />
  },
  {
    path: "folder/:folderId",
    element:
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
  }

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}  />
  </StrictMode>,
)
