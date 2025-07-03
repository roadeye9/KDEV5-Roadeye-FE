import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { ArrowLeft, Car, Clock, Gauge, MapPin, Route, User } from 'lucide-react';
import { CustomOverlayMap, Map, Polyline } from 'react-kakao-maps-sdk';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDrivingHistoryPathQuery } from '@/hooks/api/drivingHistory';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import { formatDate, formatDuration } from '@/utils/format';

type Point = {
  lat: number;
  lng: number;
};

const DrivingLogDetailPage = () => {
  useKakaoLoader();
  const navigate = useNavigate();
  const { state } = useLocation();
  const log = state?.log;
  const { data: path } = useDrivingHistoryPathQuery(log.id);

  const polylinePath = (path?.data ?? []).map((p) => ({
    lat: p.latitude,
    lng: p.longitude
  }));

  const getCenter = (points: Point[]): Point => {
    if (points.length === 0) return { lat: 37.5665, lng: 126.978 }; // 서울 시청 등 기본값
    const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
    const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
    return { lat, lng };
  };

  return (
    <div className='p-6'>
      {/* Header */}
      <header className='mb-6'>
        <Button
          variant='light'
          startContent={<ArrowLeft className='h-4 w-4' />}
          onClick={() => navigate(-1)}
          className='mb-4'
        >
          뒤로가기
        </Button>
        <div className='rounded-lg bg-white p-6 shadow-sm'>
          <h1 className='mb-2 text-2xl font-bold text-gray-800'>운행 상세 정보</h1>
          <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600'>
            <span className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-blue-500' />
              {formatDate(log.driveStartedAt)} ~ {formatDate(log.driveEndedAt)}
            </span>
            <span className='flex items-center gap-2'>
              <Car className='h-4 w-4 text-blue-500' />
              {log.carName} ({log.licenseNumber})
            </span>
            <span className='flex items-center gap-2'>
              <User className='h-4 w-4 text-blue-500' />
              {log.driverName || '미등록'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-1'>
        {/* 왼쪽 영역 (요약, 비고) */}
        <div className='space-y-6'>
          <Card className='shadow-lg'>
            <CardHeader>
              <h2 className='text-xl font-semibold text-gray-800'>운행 요약</h2>
            </CardHeader>
            <CardBody>
              <div className='grid grid-cols-2 gap-4 text-center md:grid-cols-3'>
                <div className='rounded-lg bg-gray-50 p-3'>
                  <Route className='mx-auto mb-1 h-8 w-8 text-gray-500' />
                  <p className='text-sm font-medium text-gray-600'>주행거리</p>
                  <p className='text-xl font-bold text-gray-800'>
                    {(log.nextMileageSum - log.previousMileageSum) / 1000} km
                  </p>
                </div>
                <div className='rounded-lg bg-gray-50 p-3'>
                  <Clock className='mx-auto mb-1 h-8 w-8 text-gray-500' />
                  <p className='text-sm font-medium text-gray-600'>운행시간</p>
                  <p className='text-xl font-bold text-gray-800'>
                    {formatDuration(log.driveStartedAt, log.driveEndedAt)}
                  </p>
                </div>
                <div className='rounded-lg bg-gray-50 p-3'>
                  <Gauge className='mx-auto mb-1 h-8 w-8 text-gray-500' />
                  <p className='text-sm font-medium text-gray-600'>평균 속도</p>
                  <p className='text-xl font-bold text-gray-800'>{log.speed} km/h</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 오른쪽 영역 (지도) */}
        <div className='space-y-6'>
          <Card className='h-full shadow-lg'>
            <CardHeader>
              <h2 className='text-xl font-semibold text-gray-800'>운행 경로</h2>
            </CardHeader>
            <CardBody className='p-0'>
              {polylinePath.length > 0 && (
                <Map
                  center={getCenter(polylinePath)}
                  style={{ width: '100%', height: '100%', minHeight: '500px' }}
                  level={8}
                >
                  <Polyline path={polylinePath} strokeColor='#3b82f6' strokeWeight={4} />
                  <CustomOverlayMap position={polylinePath[0]}>
                    <div
                      className='flex flex-col items-center'
                      style={{ transform: 'translateY(-32px)' }}
                    >
                      <span className='text-sm font-semibold text-gray-600'>출발지</span>
                      <MapPin className='h-12 w-12 text-blue-600 drop-shadow' />
                    </div>
                  </CustomOverlayMap>
                  <CustomOverlayMap position={polylinePath[polylinePath.length - 1]}>
                    <div
                      className='flex flex-col items-center'
                      style={{ transform: 'translateY(-32px)' }}
                    >
                      <span className='text-sm font-semibold text-gray-600'>도착지</span>
                      <MapPin className='h-12 w-12 text-red-600 drop-shadow' />
                    </div>
                  </CustomOverlayMap>
                </Map>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DrivingLogDetailPage;
