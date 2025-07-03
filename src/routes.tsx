import React from 'react';

import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth';
import AuthLayout from '@/layouts/AuthLayout';
import PlatformLayout from '@/layouts/PlatformLayout';
import Dashboard from '@/routes/manage/dashboard';
import DrivingLogDetailPage from '@/routes/manage/driving-log.$id';
import EmployeePage from '@/routes/manage/employees';
import NotFoundPage from '@/routes/error/NotFound';
import LandingPage from '@/routes/index';
import DrivingLogPage from '@/routes/manage/driving-log';

const LoginPage = React.lazy(() => import('@/routes/login'));

const VehiclePage = React.lazy(() => import('@/routes/manage/vehicle'));
const VehicleControlPage = React.lazy(() => import('@/routes/manage/vehicle-control'));

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
    element: <BrandingLayout />,
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
    element: <AuthLayout />,
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
        element: <EmployeePage />
      },
      {
        path: 'vehicle',
        element: <VehiclePage />
      },
      {
        path: 'vehicle-control',
        element: <VehicleControlPage />
      },
      {
        path: 'driving-log',
        element: <DrivingLogPage />
      },
      {
        path: 'driving-log/:logId',
        element: <DrivingLogDetailPage />
      },
    ]
  }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}

