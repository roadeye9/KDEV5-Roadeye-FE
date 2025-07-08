import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import { ProtectedRoute } from '@/components/manage/ProtectedRoute';
import { Suspense } from 'react';
import { Delay } from '@suspensive/react';

const PlatformLayout = () => {
  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <Suspense fallback={(
          <Delay ms={300}>
            <div>Loading...</div>
          </Delay>
        )}>
          <Sidebar />
        </Suspense>
        <main className='flex-1 overflow-y-auto'>
          <Suspense fallback={
            <Delay ms={300}>
              <div>Loading...</div>
            </Delay>
          }>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default PlatformLayout;
