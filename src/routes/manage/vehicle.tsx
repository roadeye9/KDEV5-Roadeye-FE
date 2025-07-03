import type { Vehicle } from '@/api/vehicle';

import Pagination from '@/components/common/Pagination';
import { useVehicleDetailQuery } from '@/hooks/api/vehicle';
import { useVehicle } from '@/hooks/pages/useVehicle';

import '@fortawesome/fontawesome-free/css/all.min.css';

import { useState } from 'react';

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem
} from '@nextui-org/react';
import { Car, Hash, MapPin, Plus } from 'lucide-react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

const VehiclePage = () => {
  const { vehicles, pagination, status, setStatus } = useVehicle();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const { data: vehicleDetail, isLoading: isDetailLoading } = useVehicleDetailQuery(
    selectedVehicle?.id ?? null,
    { enabled: !!selectedVehicle }
  );
  const [modalError, setModalError] = useState('');

  return (
    <>
      {/* 차량 등록/수정 모달 */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          setModalError('');
        }}
        size='2xl'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                <div className='flex items-center gap-3'>
                  <Car className='text-blue-500' />
                  <span>차량 {selectedVehicle ? '수정' : '등록'}</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className='space-y-4'>
                  <Input
                    label='차량 번호'
                    placeholder='차량 번호를 입력하세요'
                    defaultValue={selectedVehicle?.licenseNumber}
                    startContent={<Hash className='text-blue-500' />}
                  />
                  <Input
                    label='차량 이름'
                    placeholder='차량 이름을 입력하세요'
                    defaultValue={selectedVehicle?.name}
                    startContent={<Car className='text-blue-500' />}
                  />
                  <Input
                    label='주행거리 (km)'
                    type='number'
                    placeholder='주행거리를 입력하세요'
                    defaultValue={((selectedVehicle?.mileageCurrent ?? 0) / 1000).toLocaleString()}
                    startContent={<MapPin className='text-blue-500' />}
                  />
                </div>
                {modalError && (
                  <div className='mt-2 text-center text-sm text-red-500'>{modalError}</div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant='light' onPress={onClose}>
                  취소
                </Button>
                <Button
                  color='primary'
                  onPress={() =>
                    setModalError('서버에 일시적인 오류가 발생했습니다. 잠시 후 다시 이용해주세요.')
                  }
                >
                  {selectedVehicle ? '수정' : '등록'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className='flex h-screen flex-col'>
        {/* Header */}
        <header className='border-b bg-white p-6'>
          <h1 className='flex items-center gap-3 text-2xl font-bold text-gray-800'>
            <Car className='text-blue-500' />
            차량 관리
          </h1>
        </header>

        {/* Controls */}
        <section className='border-b bg-white p-6'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <span className='text-lg font-semibold text-gray-800'>
              총 {vehicles.data?.pageInfo?.total ?? 0}대
            </span>
            <div className='ml-auto flex items-center gap-3'>
              <Select
                className='w-40'
                selectedKeys={status ? [status] : ['all']}
                onChange={(e) => {
                  const value = e.target.value;
                  setStatus(value === 'all' ? undefined : (value as 'ON' | 'OFF')); // 'all'이면 undefined로 설정
                  pagination.onPageChange(1); // 필터 변경 시 페이지를 1로 초기화
                }}
                aria-label='상태 필터'
              >
                <SelectItem key='all' value='all'>
                  전체 상태
                </SelectItem>
                <SelectItem key='ON' value='ON'>
                  운행중
                </SelectItem>
                <SelectItem key='OFF' value='OFF'>
                  정지
                </SelectItem>
              </Select>
              <Button
                color='primary'
                startContent={<Plus className='h-4 w-4' />}
                onClick={() => {
                  setSelectedVehicle(null);
                  setIsModalOpen(true);
                }}
              >
                차량 등록
              </Button>
            </div>
          </div>
        </section>

        {/* Vehicle Cards (리스트형) */}
        <div className='relative flex-1 overflow-auto bg-gray-50 p-6'>
          <div className='flex flex-col gap-4'>
            {(vehicles.data?.data ?? []).map((vehicle: Vehicle, index: number) => (
              <div
                key={vehicle.id || index}
                className='group flex cursor-pointer items-center overflow-hidden rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-lg transition-all duration-300 hover:shadow-xl'
                onClick={() => {
                  setSelectedVehicle(vehicle);
                  setShowDetailPanel(true);
                }}
              >
                {/* Vehicle Image */}
                <div className='mr-6 h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100'>
                  <img
                    src={vehicle.imageUrl || '/car.jpg'}
                    alt={vehicle.name}
                    className='h-full w-full object-cover'
                  />
                </div>
                {/* Vehicle Info */}
                <div className='min-w-0 flex-1'>
                  <div className='mb-1 flex items-center justify-between'>
                    <h3 className='truncate text-lg font-semibold text-gray-800'>{vehicle.name}</h3>
                    <span
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        vehicle.ignitionStatus === 'ON'
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
                      <Hash className='h-4 w-4 text-blue-500' />
                      {vehicle.licenseNumber}
                    </span>
                    <span className='flex items-center gap-1'>
                      <MapPin className='h-4 w-4 text-blue-500' />
                      주행거리:{' '}
                      <span className='font-medium text-gray-800'>
                        {((vehicle.mileageCurrent ?? 0) / 1000).toLocaleString()} km
                      </span>
                    </span>
                  </div>
                </div>
                {/* <Button
                                    size="sm"
                                    variant="light"
                                    color="primary"
                                    startContent={<Edit className="w-4 h-4" />}
                                    onClick={e => { e.stopPropagation(); handleEditClick(vehicle); }}
                                >
                                    수정
                                </Button> */}
              </div>
            ))}
          </div>

          {(vehicles.data?.data?.length ?? 0) === 0 && (
            <div className='py-12 text-center'>
              <Car className='mx-auto mb-4 h-12 w-12 text-gray-400' />
              <p className='text-gray-500'>등록된 차량이 없습니다.</p>
            </div>
          )}

          {/* 차량 상세 정보 패널 */}
          {showDetailPanel && selectedVehicle && (
            <div className='animate-slide-in fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-gray-200 bg-white p-8 shadow-2xl'>
              <button
                className='absolute right-4 top-4 text-gray-400 hover:text-gray-700'
                onClick={() => setShowDetailPanel(false)}
              >
                <span className='text-xl'>&times;</span>
              </button>
              {isDetailLoading ? (
                <div className='flex h-full items-center justify-center'>로딩 중...</div>
              ) : vehicleDetail ? (
                <>
                  <div className='mb-6 flex flex-col items-center'>
                    <img
                      src={vehicleDetail.imageUrl || '/car.jpg'}
                      alt={vehicleDetail.name}
                      className='mb-3 h-32 w-32 rounded-xl object-cover'
                    />
                    <h2 className='mb-1 text-2xl font-bold text-gray-800'>{vehicleDetail.name}</h2>
                    <span className='mb-2 text-sm text-gray-500'>
                      {vehicleDetail.licenseNumber}
                    </span>
                    <span
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                        vehicleDetail.ignitionStatus === 'ON'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <i
                        className={`fas fa-circle text-xs ${vehicleDetail.ignitionStatus === 'ON' ? 'text-green-500' : 'text-gray-500'}`}
                      ></i>
                      {vehicleDetail.ignitionStatus === 'ON' ? '운행중' : '대기중'}
                    </span>
                  </div>
                  <div className='space-y-4'>
                    <div>
                      <label className='text-xs text-gray-500'>주행거리</label>
                      <p className='text-base font-medium text-gray-800'>
                        {((vehicleDetail.mileageCurrent ?? 0) / 1000).toLocaleString()} km
                      </p>
                    </div>
                    <div>
                      <label className='text-xs text-gray-500'>배터리 전압</label>
                      <p className='text-base font-medium text-gray-800'>
                        {vehicleDetail.batteryVoltage ?? '-'} V
                      </p>
                    </div>
                    <div>
                      <label className='text-xs text-gray-500'>상태</label>
                      <p className='text-base font-medium text-gray-800'>
                        {vehicleDetail.ignitionStatus === 'ON' ? '운행중' : '정지'}
                      </p>
                    </div>

                    {typeof vehicleDetail.latitude === 'number' &&
                      typeof vehicleDetail.longitude === 'number' && (
                        <div>
                          <label className='mb-1 block text-xs text-gray-500'>현재 위치</label>
                          <div className='h-56 w-full overflow-hidden rounded-lg border'>
                            <Map
                              center={{ lat: vehicleDetail.latitude, lng: vehicleDetail.longitude }}
                              style={{ width: '100%', height: '100%' }}
                              level={5}
                            >
                              <MapMarker
                                position={{
                                  lat: vehicleDetail.latitude,
                                  lng: vehicleDetail.longitude
                                }}
                              />
                            </Map>
                          </div>
                        </div>
                      )}
                  </div>
                </>
              ) : (
                <div className='text-center text-gray-500'>차량 정보를 불러올 수 없습니다.</div>
              )}
            </div>
          )}
        </div>
        {/* Pagination */}
        <Pagination
          currentPage={pagination.currentPage}
          pageSize={pagination.pageSize}
          totalElements={pagination.totalElements}
          onPageChange={pagination.onPageChange}
        />
      </div>
    </>
  );
};

export default VehiclePage;
