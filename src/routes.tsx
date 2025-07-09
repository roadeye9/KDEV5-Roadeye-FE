import React from 'react';

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import PlatformLayout from '@/layouts/PlatformLayout';
import NotFoundPage from '@/routes/error/NotFound';
import Dashboard from '@/routes/manage/dashboard';
import DrivingLogPage from '@/routes/manage/driving-log';

const LoginPage = React.lazy(() => import('@/routes/login'));

const EmployeePage = React.lazy(() => import('@/routes/manage/employees'));
const EmployeeEditPage = React.lazy(() => import('@/routes/manage/employees.$id.edit'));
const EmployeeCreatePage = React.lazy(() => import('@/routes/manage/employees.new'));

const VehicleListPage = React.lazy(() => import('@/routes/manage/vehicles'));
const VehicleDetailsPage = React.lazy(() => import('@/routes/manage/vehicles.$id'));
const VehicleNewPage = React.lazy(() => import('@/routes/manage/vehicles.new'));
const VehicleEditPage = React.lazy(() => import('@/routes/manage/vehicles.$id.edit'));

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
            path: "new",
            element: <EmployeeCreatePage />
          },
          {
            path: ':id/edit',
            element: <EmployeeEditPage />
          }
        ]
      },
      {
        path: 'vehicles',
        element: <VehicleListPage />,
        children: [
          {
            path: 'new',
            element: <VehicleNewPage />
          },
          {
            path: ':id',
            element: <VehicleDetailsPage />
          },
          {
            path: ':id/edit',
            element: <VehicleEditPage />
          }
        ]
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
