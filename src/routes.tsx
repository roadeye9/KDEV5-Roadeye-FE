import React from 'react';

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import PlatformLayout from '@/layouts/PlatformLayout';
import NotFoundPage from '@/routes/error/NotFound';
import Dashboard from '@/routes/manage/dashboard';
import DrivingLogPage from '@/routes/manage/driving-log';
import EmployeePage from '@/routes/manage/employees';
import EmployeeEditPage from './routes/manage/employees.$id.edit';
import EmployeeRegisterPage from './routes/manage/employees.register';

const LoginPage = React.lazy(() => import('@/routes/login'));

const VehiclePage = React.lazy(() => import('@/routes/manage/vehicle'));

const TrackingPage = React.lazy(() => import('@/routes/manage/tracking'));
const TrackingDetailPage = React.lazy(() => import('@/routes/manage/tracking.$id'));

const DrivingLogDetailPage = React.lazy(() => import('@/routes/manage/driving-log.$id'));

const router = createBrowserRouter([
  {
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        children: [
          {
            index: true,
            element: <Navigate to="/manage/dashboard" replace />
          },
          {
            path: '/login',
            element: <LoginPage />
          },
        ],
      }
    ],
  },
  {
    path: '/manage',
    element: <PlatformLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'employees',
        element: <EmployeePage />,
        children: [
          {
            path: "register",
            element: <EmployeeRegisterPage />
          },
          {
            path: ':id/edit',
            element: <EmployeeEditPage />
          }
        ]
      },
      {
        path: 'vehicle',
        element: <VehiclePage />
      },
      {
        path: 'tracking',
        children: [
          {
            index: true,
            element: <TrackingPage />,
          },
          {
            path: ':id',
            element: <TrackingDetailPage />
          }
        ]
      },
      {
        path: 'driving-log',
        element: <DrivingLogPage />
      },
      {
        path: 'driving-log/:logId',
        element: <DrivingLogDetailPage />
      }
    ]
  }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
