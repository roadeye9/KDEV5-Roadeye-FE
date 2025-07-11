import { Suspense } from 'react';

import { Avatar, Button } from '@nextui-org/react';
import { Car, FileText, LayoutDashboard, LogOut, MapPin, Truck, UserCog, BarChart } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useEmployeeMyQuery } from '@/hooks/api/employees';
import { Delay } from '@suspensive/react';

const MENU_ITEMS = [
  {
    icon: LayoutDashboard,
    label: '대시보드',
    url: '/manage/dashboard'
  },
  {
    icon: UserCog,
    label: '직원 관리',
    url: '/manage/employees'
  },
  {
    icon: Truck,
    label: '차량 관리',
    url: '/manage/vehicles'
  },
  {
    icon: MapPin,
    label: '차량 관제',
    url: '/manage/tracking'
  },
  {
    icon: FileText,
    label: '운행 일지',
    url: '/manage/driving-log'
  },
  {
    icon: BarChart,
    label: '통계',
    url: '/manage/statistics'
  }
] as const;

const Sidebar = () => {
  return (
    <div className='flex h-screen w-[240px] flex-col border-r border-gray-200 bg-white'>
      <Header />
      <div className='flex-1 gap-2 px-4 py-4'>
        {MENU_ITEMS.map((item) => (
          <MenuItem key={item.url} item={item} />
        ))}
      </div>
      <Suspense fallback={(
        <Delay ms={300}>
          <div>Loading...</div>
        </Delay>
      )}>
        <UserInfo />
      </Suspense>
    </div>
  );
};

function Header() {
  return (
    <div className='flex cursor-pointer items-center gap-3 px-6 py-6 transition-colors hover:bg-gray-50'>
      <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500'>
        <Car className='h-6 w-6 text-white' />
      </div>
      <div>
        <h1 className='text-xl font-bold text-gray-800'>RoadEye</h1>
        <p className='text-xs text-gray-500'>Fleet Management</p>
      </div>
    </div>
  );
}

function MenuItem({ item }: { item: (typeof MENU_ITEMS)[number] }) {
  return (
    <NavLink
      key={item.url}
      to={item.url}
      className={({ isActive }) =>
        `flex h-12 w-full items-center gap-3 rounded-lg px-3 text-gray-700 transition-colors ${isActive ? 'bg-blue-100 font-bold text-blue-600' : 'hover:bg-blue-50 hover:text-blue-600'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon size={20} className={isActive ? 'text-blue-600' : ''} />
          <span className='font-medium'>{item.label}</span>
        </>
      )}
    </NavLink>
  );
}

function UserInfo() {
  const navigate = useNavigate();

  const { data: userInfo } = useEmployeeMyQuery();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className='border-t border-gray-200 p-4'>
      <div className='mb-3 flex items-center gap-3'>
        <Avatar className='h-10 w-10 bg-blue-100 font-semibold text-blue-600' />
        <div className='min-w-0 flex-1'>
          <p className='truncate font-semibold text-gray-800'>{userInfo.name}</p>
        </div>
      </div>

      <Button
        variant='light'
        color='danger'
        size='sm'
        className='w-full justify-start gap-2 text-gray-600 hover:text-red-600'
        onClick={handleLogout}
      >
        <LogOut size={16} />
        <span>로그아웃</span>
      </Button>
    </div>
  );
}

export default Sidebar;
