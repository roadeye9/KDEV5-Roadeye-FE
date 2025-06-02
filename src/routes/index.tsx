import React, { Suspense } from 'react';

import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { Toaster } from '@/components/ui/toaster';
import WaitingView from '@/components/WaitingView';
import { AuthProvider } from '@/contexts/auth';
import AuthLayout from '@/layouts/AuthLayout';
import DefaultLayout from '@/layouts/DefaultLayout';
import NotFoundPage from '@/pages/error/NotFound';

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

function Main(){
  return <div>1234</div>
}

const router = createBrowserRouter([
  {
    element: <Root />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<WaitingView />}>
            <PrivateRoute>
              <DefaultLayout />
            </PrivateRoute>
          </Suspense>
        ),
        children: [
          { index: true, element: <Main/> },
        ],
      },
      {
        path: '/',
        element: (
          <Suspense fallback={<WaitingView />}>
            <AuthLayout />
          </Suspense>
        ),
        children: [
          { path: 'login', element: <Main/> }
        ]
      },
    ]
  }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}

