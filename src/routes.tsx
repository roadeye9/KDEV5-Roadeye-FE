import React from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

const PlatformLayout = React.lazy(() => import('@/layouts/PlatformLayout'));
const NotFoundPage = React.lazy(() => import('@/routes/error/NotFound'));


const LoginPage = React.lazy(() => import('@/routes/login'));

const Dashboard = React.lazy(() => import('@/routes/manage/dashboard'));

const EmployeePage = React.lazy(() => import('@/routes/manage/employees'));
const EmployeeEditPage = React.lazy(() => import('@/routes/manage/employees.$id.edit'));
const EmployeeCreatePage = React.lazy(() => import('@/routes/manage/employees.new'));

const VehicleListPage = React.lazy(() => import('@/routes/manage/vehicles'));
const VehicleDetailsPage = React.lazy(() => import('@/routes/manage/vehicles.$id'));
const VehicleNewPage = React.lazy(() => import('@/routes/manage/vehicles.new'));
const VehicleEditPage = React.lazy(() => import('@/routes/manage/vehicles.$id.edit'));

const TrackingPage = React.lazy(() => import('@/routes/manage/tracking'));
const TrackingDetailPage = React.lazy(() => import('@/routes/manage/tracking.$id'));

const DrivingLogPage = React.lazy(() => import('@/routes/manage/driving-log'));
const DrivingLogDetailPage = React.lazy(() => import('@/routes/manage/driving-log.$id'));

const StatisticsPage = React.lazy(() => import('@/routes/manage/statistics'));

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
      },
      {
        path: 'statistics',
        element: <StatisticsPage />
      }
    ]
  }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
