import React, { Suspense } from 'react';

import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { Toaster } from '@/components/ui/toaster';
import WaitingView from '@/components/WaitingView';
import { AuthProvider } from '@/contexts/auth';
import AuthLayout from '@/layouts/AuthLayout';
import NotFoundPage from '@/pages/error/NotFound';
import LandingPage from '@/pages/LandingPage';
import PlatformLayout from '@/layouts/PlatformLayout';
import EmployeePage from '@/pages/EmployeePage';

const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));

const VehiclePage = React.lazy(() => import('@/pages/VehiclePage'));

// Lazy loading for pages
// const GithubCallback = React.lazy(() => import('@/pages/auth/GithubCallback'));
// const Today = React.lazy(() => import('@/pages/today/Today'));
// const Introductions = React.lazy(() => import('@/pages/Introductions'));
// const DomainDetail = React.lazy(() => import('@/pages/domain/DomainDetail'));

const Root = () => {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
};


const BrandingLayout = () => {
  return (
    <>
    <Outlet />
    <Toaster />
    </>
  )
}




const router = createBrowserRouter([
  {
    element: <BrandingLayout/>,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        children: [
          { index: true, element: <LandingPage /> },
        ],
      },
    ]
  }, 
  { 
    element: <AuthLayout/>,
    errorElement: <NotFoundPage />,
    children: [
    {
      path: '/login',
      element: <LoginPage />
    }
    ]
  },
  {
     path: '/manage',
     element: <PlatformLayout />,
     errorElement: <NotFoundPage />,
     children: [
      {
        path: 'dashboard',
        element: <Dashboard />
     },
     {
      path: 'employee',
      element: <EmployeePage/>  
     }, 
     {
      path: 'vehicle',
      element: <VehiclePage/>
     }
     ]
  }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}

  