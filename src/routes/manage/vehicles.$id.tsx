import { useNavigate, useParams } from "react-router-dom";

import { useVehicleDetailQuery } from "@/hooks/api/vehicle";
import TrackingMap from "@/components/manage/tracking/TrackingMap";
import { useDrivingHistoryOfCarQuery } from "@/hooks/api/location";
import { Expand } from "lucide-react";

function VehicleDetailsPage({ id }: { id: number }) {
    const navigate = useNavigate();

    const { data: vehicle } = useVehicleDetailQuery(id);
    const { data: drivingHistory } = useDrivingHistoryOfCarQuery(id);

    const handleExpand = () => {
        navigate(`/manage/tracking/${id}`)
    }

    return (
        <div className='animate-slide-in fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-gray-200 bg-white p-8 shadow-2xl'>
            <button
                className='absolute right-4 top-4 text-gray-400 hover:text-gray-700'
                onClick={() => navigate('/manage/vehicles')}
            >
                <span className='text-xl'>&times;</span>
            </button>
            <>
                <div className='mb-6 flex flex-col items-center'>
                    <img
                        src={vehicle.imageUrl}
                        alt={vehicle.name}
                        className='mb-3 h-32 w-32 rounded-xl object-cover'
                    />
                    <h2 className='mb-1 text-2xl font-bold text-gray-800'>{vehicle.name}</h2>
                    <span className='mb-2 text-sm text-gray-500'>
                        {vehicle.licenseNumber}
                    </span>
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
                <div className='space-y-4'>
                    <div>
                        <label className='text-xs text-gray-500'>주행거리</label>
                        <p className='text-base font-medium text-gray-800'>
                            {((vehicle.mileageCurrent ?? 0) / 1000).toLocaleString()} km
                        </p>
                    </div>
                    <div>
                        <label className='text-xs text-gray-500'>배터리 전압</label>
                        <p className='text-base font-medium text-gray-800'>
                            {vehicle.batteryVoltage ?? '-'} V
                        </p>
                    </div>
                    <div>
                        <label className='text-xs text-gray-500'>상태</label>
                        <p className='text-base font-medium text-gray-800'>
                            {vehicle.ignitionStatus === 'ON' ? '운행중' : '정지'}
                        </p>
                    </div>

                    <div>
                        <label className='mb-1 block text-xs text-gray-500'>현재 위치</label>
                        <div className='h-56 w-full overflow-hidden rounded-lg border'>
                            <TrackingMap
                                vehicles={[
                                    {
                                        id: vehicle.id,
                                        position: {
                                            lat: vehicle.latitude,
                                            lng: vehicle.longitude
                                        },
                                        path: {
                                            points: drivingHistory?.map((history) => ({
                                                lat: history.lat,
                                                lng: history.lng
                                            })) ?? []
                                        }
                                    }
                                ]}
                                center={{
                                    lat: vehicle.latitude,
                                    lng: vehicle.longitude
                                }}
                                level={6}
                                zoomControl={false}
                                mapTypeControl={false}
                            >
                                <div className="absolute top-0 left-0 z-10 p-2 hover:cursor-pointer" onClick={handleExpand} >
                                    <Expand className="w-6 h-6" />
                                </div>
                            </TrackingMap>
                        </div>
                    </div>
                </div>
            </>
        </div>
    )
}

export default function () {
    const { id } = useParams<{ id: string }>();

    const vehicleId = Number(id);

    if (isNaN(vehicleId)) {
        throw new Error('Invalid vehicle ID');
    }

    return <VehicleDetailsPage id={vehicleId} />;
}