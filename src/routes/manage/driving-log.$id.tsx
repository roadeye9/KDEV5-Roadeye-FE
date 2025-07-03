import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { ArrowLeft, Car, Clock, Gauge, MapPin, Route, User } from 'lucide-react';
import { CustomOverlayMap, Map, Polyline } from 'react-kakao-maps-sdk';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useDrivingHistoryPathQuery, useDrivingHistoryQuery } from '@/hooks/api/drivingHistory';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import { formatDate, formatDuration, getDateDiff } from '@/utils/dateUtils';

type Point = {
  lat: number;
  lng: number;
};

const DrivingLogDetailPage = () => {
  useKakaoLoader();

  const navigate = useNavigate();

  const { logId } = useParams();

  const { data: drivingLog } = useDrivingHistoryQuery(Number(logId));
  const { data: drivingPath } = useDrivingHistoryPathQuery(Number(logId));

  if (!drivingLog || !drivingPath) {
    return <div>Loading...</div>;
  }

  const polylinePath = drivingPath.map((p) => ({
    lat: p.latitude,
    lng: p.longitude
  }));

  const getCenter = (points: Point[]): Point => {
    if (points.length === 0) return { lat: 37.5665, lng: 126.978 }; // 서울 시청 등 기본값
    const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
    const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
    return { lat, lng };
  };

  const mileageKm = (drivingLog.nextMileageSum - drivingLog.previousMileageSum) / 1000;
  const drivingTime = getDateDiff(drivingLog.driveStartedAt, drivingLog.driveEndedAt)!;
  const avgSpeed = mileageKm / (drivingTime.hours + drivingTime.minutes / 60);

  return (
    <div className='flex flex-col h-full p-6 gap-2'>
      <header>
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
              {formatDate(drivingLog.driveStartedAt)}
            </span>
            <span className='flex items-center gap-2'>
              <Car className='h-4 w-4 text-blue-500' />
              {drivingLog.carName}
            </span>
            <span className='flex items-center gap-2'>
              <User className='h-4 w-4 text-blue-500' />
              {drivingLog.driverName}
            </span>
          </div>
        </div>
      </header>

      <div className='flex-1 flex flex-col gap-2'>
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
                  {mileageKm} km
                </p>
              </div>
              <div className='rounded-lg bg-gray-50 p-3'>
                <Clock className='mx-auto mb-1 h-8 w-8 text-gray-500' />
                <p className='text-sm font-medium text-gray-600'>운행시간</p>
                <p className='text-xl font-bold text-gray-800'>
                  {drivingTime.hours}시간 {drivingTime.minutes}분
                </p>
              </div>
              <div className='rounded-lg bg-gray-50 p-3'>
                <Gauge className='mx-auto mb-1 h-8 w-8 text-gray-500' />
                <p className='text-sm font-medium text-gray-600'>평균 속도</p>
                <p className='text-xl font-bold text-gray-800'>
                  {avgSpeed.toFixed(2)} km/h
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className='flex-1 shadow-lg'>
          <CardHeader>
            <h2 className='text-xl font-semibold text-gray-800'>운행 경로</h2>
          </CardHeader>
          <CardBody className='w-full h-full p-0'>
            <Map
              className='w-full h-full'
              center={getCenter(polylinePath)}
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
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default DrivingLogDetailPage;
