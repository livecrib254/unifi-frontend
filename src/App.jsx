import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/home'
import { createBrowserRouter, RouterProvider } from "react-router";
import WifiSuccessPage from './pages/success'
import ErrorPage from './pages/error'


const router = createBrowserRouter([
  {
    path: "/guest/s/:token",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/success",
    element: <WifiSuccessPage />,
  },
  {
    path: "*", // Catch-all for unmatched routes
    element: <ErrorPage />,
  }
]);

  function App() {
    return <RouterProvider router={router} />;
  }

export default App
