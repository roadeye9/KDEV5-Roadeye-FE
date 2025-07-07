import { DrivingLocationDetail } from '@/api/location';
import { Vehicle, VehicleDetails } from '@/api/vehicle';
import { useDrivingHistoryQuery } from '@/hooks/api/location';
import { useVehicleByStatusQuery, useVehicleDetailQuery } from '@/hooks/api/vehicle';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import useMapCenter, { Coordinate } from '@/hooks/useMapCenter';

import '@fortawesome/fontawesome-free/css/all.min.css';

import { useEffect, useState } from 'react';

import { Button, Checkbox } from '@nextui-org/react';
import { ArrowLeft, Clock, MapPin, RefreshCw, User } from 'lucide-react';
import {
  Map,
  MapMarker,
  MapTypeControl,
  MarkerClusterer,
  Polyline,
  ZoomControl
} from 'react-kakao-maps-sdk';
import { useCurrentTime } from '@/hooks/useCurrentTime';

type Point = {
  lat: number;
  lng: number;
};
type Path = (Point & { speed: number })[];

function getPath(drivingHistory: DrivingLocationDetail[]): Path {
  return drivingHistory.map((item) => ({
    lat: item.latitude,
    lng: item.longitude,
    speed: item.speed
  }));
}

function hasLatLng(vehicle: Vehicle | VehicleDetails): vehicle is VehicleDetails {
  return (
    typeof (vehicle as VehicleDetails).latitude === 'number' &&
    typeof (vehicle as VehicleDetails).longitude === 'number'
  );
}

function VehicleControlPage() {
  useKakaoLoader();

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(null);
  const { data: vehicles, refetch: refetchAll } = useVehicleByStatusQuery('ON', !selectedVehicle);
  const [path, setPath] = useState<Path>([]);
  const [center, setCenter] = useMapCenter();
  const [mapLevel, setMapLevel] = useState(12);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [visibleVehicles, setVisibleVehicles] = useState<Set<number>>(new Set());
  const { data: drivingHistory } = useDrivingHistoryQuery(selectedVehicle?.id ?? 0);
  const [originalCenter] = useState<Coordinate>({ lat: 37.5665, lng: 126.978 }); // 서울 시청 좌표
  const { data: vehicleDetail, refetch: refetchDetail } = useVehicleDetailQuery(
    selectedVehicle?.id ?? null,
    { enabled: !!selectedVehicle }
  );

  useEffect(() => {
    if (selectedVehicle && drivingHistory && vehicleDetail) {
      setCenter({ lat: vehicleDetail.latitude, lng: vehicleDetail.longitude });
      setMapLevel(4);
      setPath(getPath(drivingHistory));
    } else {
      setPath([]);
    }
  }, [selectedVehicle, drivingHistory]);

  useEffect(() => {
    // 모든 차량을 기본적으로 지도에 표시
    if (vehicles) {
      setVisibleVehicles(new Set(vehicles.map((v) => v.id)));
    }
  }, [vehicles]);

  const handleVehicleSelect = (vehicle: VehicleDetails) => {
    setSelectedVehicle(vehicle);
    setShowDetailPanel(true);
    setCenter({ lat: vehicle.latitude, lng: vehicle.longitude });
    setMapLevel(4);
  };

  const handleBackToList = () => {
    setSelectedVehicle(null);
    setShowDetailPanel(false);
    setCenter(originalCenter);
    setMapLevel(12);
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
    if (selectedVehicle) {
      console.log('refetchDetail');
      refetchDetail();
    } else {
      console.log('refetchAll');
      refetchAll();
    }
  };

  return (
    <div className='flex h-screen flex-col'>
      <Header />

      <div className='flex flex-1 overflow-hidden'>
        <div className='flex w-80 flex-col border-r bg-white'>
          <div className='border-b p-5'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <h2 className='text-lg font-semibold text-gray-800'>운행중인 차량</h2>
                <span className='text-md text-gray-600'>총 {vehicles?.length ?? 0}대</span>
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

          <div className='relative flex-1 overflow-hidden'>
            <div
              className={`h-full transition-transform duration-300 ${showDetailPanel ? '-translate-x-full' : 'translate-x-0'}`}
            >
              <div className='h-full space-y-4 overflow-y-auto p-5'>
                {vehicles?.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`cursor-pointer rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-100 ${selectedVehicle?.id === vehicle.id
                      ? 'border-2 border-blue-500 bg-blue-50'
                      : ''
                      }`}
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
                      <MapPin className='h-3 w-3' />
                      <span className='truncate'>
                        {`${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`absolute left-full top-0 h-full w-full bg-white transition-transform duration-300 ${showDetailPanel ? '-translate-x-full' : 'translate-x-0'
                }`}
            >
              {selectedVehicle && (
                <div className='h-full overflow-y-auto p-5'>
                  <div className='mb-5 flex items-center justify-between'>
                    <h3 className='text-lg font-semibold text-gray-800'>차량 상세 정보</h3>
                    <div className='flex gap-2'>
                      <Button
                        variant='light'
                        color='primary'
                        startContent={<ArrowLeft className='h-4 w-4' />}
                        onClick={handleBackToList}
                      >
                        목록으로
                      </Button>
                    </div>
                  </div>

                  <div className='space-y-6'>
                    <div>
                      <h4 className='mb-3 font-semibold text-gray-800'>기본 정보</h4>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label className='text-xs text-gray-500'>차량명</label>
                          <p className='text-sm text-gray-800'>{vehicleDetail?.name}</p>
                        </div>
                        <div>
                          <label className='text-xs text-gray-500'>차량번호</label>
                          <p className='text-sm text-gray-800'>{vehicleDetail?.licenseNumber}</p>
                        </div>
                        <div>
                          <label className='text-xs text-gray-500'>운전자</label>
                          <p className='text-sm text-gray-800'>{'미배정'}</p>
                        </div>
                        <div>
                          <label className='text-xs text-gray-500'>상태</label>
                          <p
                            className={`text-sm ${selectedVehicle.ignitionStatus === 'ON'
                              ? 'text-green-600'
                              : 'text-gray-600'
                              }`}
                          >
                            {selectedVehicle.ignitionStatus === 'ON' ? '운행중' : '정지'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Operation Info */}
                    <div>
                      <h4 className='mb-3 font-semibold text-gray-800'>운행 정보</h4>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label className='text-xs text-gray-500'>현재 위치</label>
                          <p className='text-sm text-gray-800'>
                            {`${vehicleDetail?.latitude.toFixed(4)}, ${vehicleDetail?.longitude.toFixed(4)}`}
                          </p>
                        </div>
                        <div>
                          <label className='text-xs text-gray-500'>속도</label>
                          <p className='text-sm text-gray-800'>
                            {path[path.length - 1]?.speed || 60} km/h
                          </p>
                        </div>
                        <div>
                          <label className='text-xs text-gray-500'>운행 시작 시간</label>
                          <p className='text-sm text-gray-800'>
                            {selectedVehicle.ignitionOnTime
                              ? new Date(selectedVehicle.ignitionOnTime).toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                              : '정보 없음'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Image */}
                    {selectedVehicle.imageUrl && (
                      <div>
                        <h4 className='mb-3 font-semibold text-gray-800'>차량 이미지</h4>
                        <img
                          src={selectedVehicle.imageUrl}
                          alt={selectedVehicle.name}
                          className='h-auto w-full rounded-lg'
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Map
          className='flex-1'
          key={mapLevel}
          center={center}
          level={mapLevel}
        >
          <MapTypeControl position={'TOPRIGHT'} />
          <ZoomControl position={'BOTTOMRIGHT'} />
          <MarkerClusterer averageCenter={true} minLevel={9} minClusterSize={1}>
            {selectedVehicle && path.length > 0 ? (
              <MapMarker key={selectedVehicle.id} position={path[path.length - 1]} />
            ) : (
              vehicles
                ?.filter((vehicle) => visibleVehicles.has(vehicle.id) && hasLatLng(vehicle))
                .map((vehicle) => {
                  const v = vehicle as VehicleDetails;
                  return (
                    <MapMarker
                      key={v.id}
                      position={{ lat: v.latitude, lng: v.longitude }}
                      onClick={() => {
                        setSelectedVehicle(v);
                        setShowDetailPanel(true);
                        setMapLevel(4);
                      }}
                    />
                  );
                })
            )}
          </MarkerClusterer>
          {path.length > 0 && <Polyline path={path} strokeColor={'blue'} strokeWeight={2} />}
        </Map>
      </div>
    </div>
  );
}

function Header() {
  const currentTime = useCurrentTime();

  return (
    <header className='border-b bg-white p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='flex items-center gap-3 text-2xl font-bold text-gray-800'>
          <MapPin className='text-blue-500' />
          실시간 차량관제
        </h1>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2 text-gray-600'>
            <Clock className='h-4 w-4' />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default VehicleControlPage;
