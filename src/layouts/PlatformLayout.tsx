import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import { ProtectedRoute } from '@/components/manage/ProtectedRoute';

const PlatformLayout = () => {
  return (
    <ProtectedRoute>
      <div className='flex h-screen bg-gray-50'>
        <Sidebar />
        <main className='flex-1 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default PlatformLayout;
