import { DrivingLocationDetail } from '@/api/location';
import { useDrivingHistoryQuery } from '@/hooks/api/location';
import { useVehicleDetailQuery } from '@/hooks/api/vehicle';
import { VehicleDetails } from '@/api/vehicle';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import useMapCenter from '@/hooks/useMapCenter';

import '@fortawesome/fontawesome-free/css/all.min.css';

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@nextui-org/react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import {
    Map,
    MapMarker,
    MapTypeControl,
    Polyline,
    ZoomControl
} from 'react-kakao-maps-sdk';
import TrackingHeader from '@/components/manage/tracking/Header';

const VehicleDetailContent = ({
    vehicleDetail,
    path,
    isLoading
}: {
    vehicleDetail: VehicleDetails;
    path: Path;
    isLoading: boolean;
}) => {
    if (isLoading) {
        return (
            <div className='space-y-6 animate-pulse'>
                <div>
                    <h4 className='mb-3 font-semibold text-gray-800'>기본 정보</h4>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <div className='h-3 w-16 bg-gray-200 rounded mb-1'></div>
                            <div className='h-4 w-24 bg-gray-200 rounded'></div>
                        </div>
                        <div>
                            <div className='h-3 w-16 bg-gray-200 rounded mb-1'></div>
                            <div className='h-4 w-24 bg-gray-200 rounded'></div>
                        </div>
                        <div>
                            <div className='h-3 w-16 bg-gray-200 rounded mb-1'></div>
                            <div className='h-4 w-20 bg-gray-200 rounded'></div>
                        </div>
                        <div>
                            <div className='h-3 w-16 bg-gray-200 rounded mb-1'></div>
                            <div className='h-4 w-16 bg-gray-200 rounded'></div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className='mb-3 font-semibold text-gray-800'>운행 정보</h4>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <div className='h-3 w-16 bg-gray-200 rounded mb-1'></div>
                            <div className='h-4 w-32 bg-gray-200 rounded'></div>
                        </div>
                        <div>
                            <div className='h-3 w-16 bg-gray-200 rounded mb-1'></div>
                            <div className='h-4 w-20 bg-gray-200 rounded'></div>
                        </div>
                        <div>
                            <div className='h-3 w-16 bg-gray-200 rounded mb-1'></div>
                            <div className='h-4 w-28 bg-gray-200 rounded'></div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className='mb-3 font-semibold text-gray-800'>차량 이미지</h4>
                    <div className='h-48 w-full bg-gray-200 rounded-lg'></div>
                </div>
            </div>
        );
    }

    return (
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
                            className={`text-sm ${vehicleDetail.ignitionStatus === 'ON'
                                ? 'text-green-600'
                                : 'text-gray-600'
                                }`}
                        >
                            {vehicleDetail.ignitionStatus === 'ON' ? '운행중' : '정지'}
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
                            {vehicleDetail.ignitionOnTime
                                ? new Date(vehicleDetail.ignitionOnTime).toLocaleString('ko-KR', {
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
            {vehicleDetail.imageUrl && (
                <div>
                    <h4 className='mb-3 font-semibold text-gray-800'>차량 이미지</h4>
                    <img
                        src={vehicleDetail.imageUrl}
                        alt={vehicleDetail.name}
                        className='h-auto w-full rounded-lg'
                    />
                </div>
            )}
        </div>
    );
};

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

function TrackingDetailPage() {
    useKakaoLoader();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const vehicleId = parseInt(id || '0');

    const [path, setPath] = useState<Path>([]);
    const [center, setCenter] = useMapCenter();
    const [mapLevel, setMapLevel] = useState(4);
    const [isNavigating, setIsNavigating] = useState(false);
    const [isEntering, setIsEntering] = useState(true);

    const { data: drivingHistory } = useDrivingHistoryQuery(vehicleId);
    const { data: vehicleDetail, refetch: refetchDetail, isLoading: isVehicleDetailLoading } = useVehicleDetailQuery(vehicleId);

    useEffect(() => {
        // 페이지 진입 애니메이션
        const timer = setTimeout(() => {
            setIsEntering(false);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (vehicleDetail) {
            setCenter({ lat: vehicleDetail.latitude, lng: vehicleDetail.longitude });
            setMapLevel(4);
        }
    }, [vehicleDetail, setCenter]);

    useEffect(() => {
        if (drivingHistory) {
            setPath(getPath(drivingHistory));
        }
    }, [drivingHistory]);

    const handleBackToList = () => {
        setIsNavigating(true);
        // 애니메이션 시작 후 라우트 이동
        setTimeout(() => {
            navigate('/manage/tracking');
        }, 300); // 애니메이션 지속 시간과 동일
    };

    const handleRefresh = () => {
        console.log('refetchDetail');
        refetchDetail();
    };

    return (
        <div className='flex h-screen flex-col'>
            <TrackingHeader
                title="차량 상세 관제"
                subtitle={vehicleDetail?.name || '불러오는 중...'}
            />

            <div className='flex flex-1 overflow-hidden'>
                <div className={`flex w-80 flex-col border-r bg-white`}>
                    <div className='border-b p-5'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-lg font-semibold text-gray-800'>차량 상세 정보</h3>
                            <div className='flex gap-2'>
                                <Button
                                    variant='light'
                                    color='primary'
                                    startContent={<ArrowLeft className='h-4 w-4' />}
                                    onPress={handleBackToList}
                                >
                                    목록으로
                                </Button>
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
                    </div>

                    <div className={`h-full overflow-y-auto p-5 transition-transform duration-300 ${isEntering ? 'translate-x-full' : isNavigating ? 'translate-x-full' : 'translate-x-0'}`}>
                        <VehicleDetailContent
                            vehicleDetail={vehicleDetail}
                            path={path}
                            isLoading={isVehicleDetailLoading}
                        />
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
                    {path.length > 0 && (
                        <>
                            <MapMarker position={path[path.length - 1]} />
                            <Polyline path={path} strokeColor={'blue'} strokeWeight={2} />
                        </>
                    )}
                </Map>
            </div>
        </div>
    );
}

export default TrackingDetailPage; 