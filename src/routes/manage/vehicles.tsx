import type { Vehicle } from '@/api/vehicle';
import Pagination from '@/components/common/Pagination';
import { useVehicle } from '@/hooks/pages/useVehicle';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {
  Button,
  Select,
  SelectItem
} from '@nextui-org/react';
import { Car, Plus } from 'lucide-react';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

type VehicleStatus = 'ON' | 'OFF' | 'ALL';

const stateFilters = [
  { label: '전체 상태', value: 'ALL' },
  { label: '운행중', value: 'ON' },
  { label: '정지', value: 'OFF' }
] as const;

const VehiclePage = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [status, setStatus] = useState<VehicleStatus>('ALL');

  return (
    <>
      <div className='flex h-screen flex-col'>
        <header className='border-b bg-white p-6'>
          <h1 className='flex items-center gap-3 text-2xl font-bold text-gray-800'>
            <Car className='text-blue-500' />
            차량 관리
          </h1>
        </header>

        <div className='relative flex-1 overflow-auto bg-gray-50 p-6'>
          <VehicleListHeader page={page} pageSize={pageSize} status={status} onStatusChange={setStatus} />
          <VehicleList page={page} pageSize={pageSize} status={status} />
        </div>

        <VehicleListPagination page={page} pageSize={pageSize} status={status} onPageChange={setPage} />
      </div>
      <Outlet />
    </>
  );
};

function VehicleListHeader({ page, pageSize, status, onStatusChange }: { page: number, pageSize: number, status: VehicleStatus, onStatusChange: (status: VehicleStatus) => void }) {
  const navigate = useNavigate();

  const { pagination } = useVehicle({ page, pageSize, filter: { status } })

  return (
    <section className='border-b bg-white p-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <span className='text-lg font-semibold text-gray-800'>
          총 {pagination.totalElements || 0}대
        </span>
        <div className='ml-auto flex items-center gap-3'>
          <Select
            className='w-40'
            selectedKeys={[status]}
            aria-label='상태 필터'
            onChange={(e) => onStatusChange(e.target.value as VehicleStatus)}
          >
            {stateFilters.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </Select>
          <Button
            color='primary'
            startContent={<Plus className='h-4 w-4' />}
            onPress={() => navigate('/manage/vehicles/new')}
          >
            차량 등록
          </Button>
        </div>
      </div>
    </section>
  );
}

function VehicleList({ page, pageSize, status }: { page: number, pageSize: number, status: VehicleStatus }) {
  const { data: vehicles } = useVehicle({ page, pageSize, filter: { status } })

  return (
    <div className='flex flex-col gap-4'>
      {vehicles.map((vehicle: Vehicle, index: number) => (
        <VehicleListItem key={index} vehicle={vehicle} />
      ))}

      {vehicles.length === 0 && (
        <div className='py-12 text-center'>
          <Car className='mx-auto mb-4 h-12 w-12 text-gray-400' />
          <p className='text-gray-500'>
            등록된 차량이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}

function VehicleListItem({ vehicle }: { vehicle: Vehicle }) {
  const navigate = useNavigate();

  const onClickItem = () => {
    navigate(`/manage/vehicles/${vehicle.id}`);
  }

  return (
    <div className='group flex cursor-pointer items-center overflow-hidden rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl relative'>
      {/* Vehicle Image */}
      <div className='mr-6 h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100'>
        <img
          src={vehicle.imageUrl}
          alt={vehicle.name}
          className='h-full w-full object-cover'
        />
      </div>

      {/* Vehicle Info */}
      <div className='min-w-0 flex-1' onClick={onClickItem}>
        <div className='mb-1 flex items-center justify-between'>
          <h3 className='truncate text-lg font-semibold text-gray-800'>{vehicle.name}</h3>
          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${vehicle.ignitionStatus === 'ON'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
              }`}
          >
            <i
              className={`fas fa-circle text-xs ${vehicle.ignitionStatus === 'ON' ? 'text-green-500' : 'text-gray-500'}`}
            ></i>
            {vehicle.ignitionStatus === 'ON' ? '운행중' : '대기중'}
          </span>
        </div>
        <div className='mb-1 flex items-center gap-4 text-sm text-gray-600'>
          <span className='flex items-center gap-1'>
            {vehicle.licenseNumber}
          </span>
          <span className='flex items-center gap-1'>
            주행거리:{' '}
            <span className='font-medium text-gray-800'>
              {((vehicle.mileageCurrent ?? 0) / 1000).toLocaleString()} km
            </span>
          </span>
        </div>
      </div>

      {/* Edit Button */}
      <i
        className='fas fa-edit absolute top-2 right-2 z-10 h-7 w-7 flex items-center justify-center rounded-full bg-white text-gray-500 shadow cursor-pointer hover:text-blue-600 hover:shadow-md transition'
        onClick={e => {
          e.stopPropagation();
          navigate(`/manage/vehicles/${vehicle.id}/edit`);
        }}
        title='수정'
      />
    </div>
  )
}

function VehicleListPagination({
  page,
  pageSize,
  status,
  onPageChange
}: {
  page: number,
  pageSize: number,
  status: VehicleStatus,
  onPageChange: (page: number) => void
}) {
  const { pagination } = useVehicle({ page, pageSize, filter: { status } })

  return (
    <Pagination
      currentPage={pagination.current}
      pageSize={pagination.pageSize}
      totalElements={pagination.totalElements}
      onPageChange={(page) => onPageChange(page - 1)}
    />
  )
}


export default VehiclePage;

