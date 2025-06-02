import React, { Suspense } from 'react';

import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { PrivateRoute } from '@/components/auth/PrivateRoute';
import { Toaster } from '@/components/ui/toaster';
import WaitingView from '@/components/WaitingView';
import { AuthProvider } from '@/contexts/auth';
import AuthLayout from '@/layouts/AuthLayout';
import NotFoundPage from '@/pages/error/NotFound';
import LandingPage from '@/pages/LandingPage';

const LoginPage = React.lazy(() => import('@/pages/LoginPage'));


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



function Main(){
  return <div>1234</div>
}

const router = createBrowserRouter([
  {
    element: <BrandingLayout/>,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        // element: (
        //   <Suspense fallback={<WaitingView />}>
        //     <PrivateRoute>
        //       <DefaultLayout />
        //     </PrivateRoute>
        //   </Suspense>
        // ),
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
  }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}

