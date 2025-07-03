import { useState } from 'react';

import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { CircleParking, MapPin, Truck, Wrench } from 'lucide-react';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import { useCarIgnitionCount, useDrivingLogMonthlyCount } from '@/hooks/api/dashboard';
import { useVehicleAllQuery } from '@/hooks/api/vehicle';
import useKakaoLoader from '@/hooks/useKakaoLoader';

const Dashboard = () => {
  useKakaoLoader();
  const [mapCenter] = useState({ lat: 36.5, lng: 127.5 });
  const [openVehicleId, setOpenVehicleId] = useState<number | null>(null);
  const { data: runningCount } = useCarIgnitionCount('ON', 'ACTIVE');
  const { data: idleCount } = useCarIgnitionCount('OFF', 'ACTIVE');
  const { data: repairCount } = useCarIgnitionCount('OFF', 'DISABLED');
  const { data: monthlyStats } = useDrivingLogMonthlyCount();
  const { data: vehicles, isLoading } = useVehicleAllQuery();

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* 왼쪽 영역 (차량 현황 + 월별 통계) */}
        <div className='space-y-6 lg:col-span-2'>
          {/* 차량 현황판 */}
          <Card className='shadow-lg'>
            <CardHeader>
              <h2 className='text-xl font-semibold text-gray-800'>차량 현황판</h2>
            </CardHeader>
            <CardBody>
              <div className='grid grid-cols-1 gap-6 text-center sm:grid-cols-3'>
                <div className='rounded-2xl bg-blue-50 p-6'>
                  <Truck className='mx-auto mb-2 h-12 w-12 text-blue-500' />
                  <p className='text-lg font-semibold text-gray-700'>운행중</p>
                  <p className='text-3xl font-bold text-blue-600'>
                    {runningCount}
                    <span className='ml-1 text-lg'>대</span>
                  </p>
                </div>
                <div className='rounded-2xl bg-green-50 p-6'>
                  <CircleParking className='mx-auto mb-2 h-12 w-12 text-green-500' />
                  <p className='text-lg font-semibold text-gray-700'>대기중</p>
                  <p className='text-3xl font-bold text-green-600'>
                    {idleCount}
                    <span className='ml-1 text-lg'>대</span>
                  </p>
                </div>
                <div className='rounded-2xl bg-orange-50 p-6'>
                  <Wrench className='mx-auto mb-2 h-12 w-12 text-orange-500' />
                  <p className='text-lg font-semibold text-gray-700'>정비중</p>
                  <p className='text-3xl font-bold text-orange-600'>
                    {repairCount}
                    <span className='ml-1 text-lg'>대</span>
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* 월별 통계 */}
          <Card className='shadow-lg'>
            <CardHeader>
              <h2 className='text-xl font-semibold text-gray-800'>월별 통계 - 운행 횟수</h2>
            </CardHeader>
            <CardBody>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <LineChart
                    data={monthlyStats}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='count'
                      name='월별 운행 건수'
                      stroke='#3b82f6'
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 오른쪽 영역 (지도) */}
        <div className='lg:col-span-1'>
          <Card className='h-full shadow-lg'>
            <CardHeader>
              <h2 className='flex items-center gap-2 text-xl font-semibold text-gray-800'>
                <MapPin className='h-5 w-5 text-red-500' />
                지도 (차량 실시간 현황)
              </h2>
            </CardHeader>
            <CardBody className='p-0'>
              <Map
                center={mapCenter}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '500px',
                  borderRadius: '0 0 14px 14px'
                }}
                level={12}
                onClick={() => setOpenVehicleId(null)}
              >
                <MarkerClusterer averageCenter={true} minLevel={10} minClusterSize={1}>
                  {!isLoading &&
                    vehicles?.map((vehicle) => (
                      <MapMarker
                        key={vehicle.id}
                        position={{ lat: vehicle.latitude, lng: vehicle.longitude }}
                        onClick={() => setOpenVehicleId(vehicle.id)}
                      >
                        {openVehicleId === vehicle.id && (
                          <div style={{ padding: '5px', color: '#000', textAlign: 'center' }}>
                            {vehicle.name}
                          </div>
                        )}
                      </MapMarker>
                    ))}
                </MarkerClusterer>
              </Map>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
