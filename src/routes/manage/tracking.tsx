import { Vehicle, VehicleDetails } from '@/api/vehicle';
import { useVehicleByStatusQuery } from '@/hooks/api/vehicle';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import useMapCenter from '@/hooks/useMapCenter';

import '@fortawesome/fontawesome-free/css/all.min.css';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Checkbox } from '@nextui-org/react';
import { RefreshCw, User } from 'lucide-react';
import TrackingHeader from '@/components/manage/tracking/Header';
import TrackingMap, { TrackingVehicle } from '@/components/manage/tracking/TrackingMap';

function hasLatLng(vehicle: Vehicle | VehicleDetails): vehicle is VehicleDetails {
  return (
    typeof (vehicle as VehicleDetails).latitude === 'number' &&
    typeof (vehicle as VehicleDetails).longitude === 'number'
  );
}

function TrackingPage() {
  useKakaoLoader();
  const navigate = useNavigate();

  const { data: vehicles, refetch: refetchAll } = useVehicleByStatusQuery('ON', true);
  const [center] = useMapCenter();
  const [mapLevel] = useState(12);
  const [visibleVehicles, setVisibleVehicles] = useState<Set<number>>(new Set());
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // 모든 차량을 기본적으로 지도에 표시
    if (vehicles) {
      setVisibleVehicles(new Set(vehicles.map((v) => v.id)));
    }
  }, [vehicles]);

  const handleVehicleSelect = (vehicle: VehicleDetails | TrackingVehicle) => {
    setIsNavigating(true);
    // 애니메이션 시작 후 라우트 이동
    setTimeout(() => {
      navigate(`/manage/tracking/${vehicle.id}`, {
        state: { vehicle }
      });
    }, 300); // 애니메이션 지속 시간과 동일
  };

  const toggleVehicleVisibility = (vehicleId: number) => {
    const newVisible = new Set(visibleVehicles);
    if (newVisible.has(vehicleId)) {
      newVisible.delete(vehicleId);
    } else {
      newVisible.add(vehicleId);
    }
    setVisibleVehicles(newVisible);
  };

  const handleRefresh = () => {
    console.log('refetchAll');
    refetchAll();
  };

  return (
    <div className='flex h-screen flex-col'>
      <TrackingHeader
        title="실시간 차량관제"
        subtitle={`총 ${vehicles?.length ?? 0}대`}
      />

      <div className='flex flex-1 overflow-hidden'>
        <div className={`flex w-80 flex-col border-r bg-white`}>
          <div className='border-b p-5'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <h2 className='text-lg font-semibold text-gray-800'>운행중인 차량</h2>
              </div>
              <Button
                isIconOnly
                variant='light'
                color='primary'
                onClick={handleRefresh}
                className='transition-transform duration-300 hover:rotate-180'
              >
                <RefreshCw className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div className={`h-full space-y-4 overflow-y-auto p-5 transition-transform duration-300 ${isNavigating ? '-translate-x-full' : 'translate-x-0'}`}>
            {vehicles?.map((vehicle) => (
              <div
                key={vehicle.id}
                className='cursor-pointer rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100'
                onClick={() => handleVehicleSelect(vehicle)}
              >
                <div className='mb-3 flex items-center gap-3'>
                  <Checkbox
                    isSelected={visibleVehicles.has(vehicle.id)}
                    onValueChange={() => toggleVehicleVisibility(vehicle.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-800'>{vehicle.name}</h3>
                    <span className='text-sm text-gray-600'>{vehicle.licenseNumber}</span>
                  </div>
                </div>

                <div className='mb-2 flex items-center justify-between'>
                  <span
                    className={`flex items-center gap-1 text-sm ${vehicle.ignitionStatus === 'ON' ? 'text-green-600' : 'text-gray-500'
                      }`}
                  >
                    <i className='fas fa-circle text-xs'></i>
                    {vehicle.ignitionStatus === 'ON' ? '운행중' : '정지'}
                  </span>
                  <span className='flex items-center gap-1 text-sm text-gray-600'>
                    <User className='h-3 w-3' />
                    {'미배정'}
                  </span>
                </div>

                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span className='truncate'>
                    {`${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <TrackingMap
          center={center}
          level={mapLevel}
          vehicles={vehicles
            ?.filter((vehicle) => visibleVehicles.has(vehicle.id) && hasLatLng(vehicle))
            .map((vehicle) => {
              const v = vehicle as VehicleDetails;
              return {
                id: v.id,
                label: v.name,
                position: { lat: v.latitude, lng: v.longitude },
                marker: {
                  display: true
                },
                onClick: handleVehicleSelect
              };
            })}
          onVehicleClick={handleVehicleSelect}
        />
      </div>
    </div>
  );
}

export default TrackingPage;
