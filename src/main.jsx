import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
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
  },
  //Fallback route
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}  />
  </StrictMode>,
)
