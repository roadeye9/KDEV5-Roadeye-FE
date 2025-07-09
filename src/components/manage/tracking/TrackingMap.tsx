import useKakaoLoader from '@/hooks/useKakaoLoader';
import { Map, MapMarker, MapTypeControl, Polyline, ZoomControl, MarkerClusterer } from 'react-kakao-maps-sdk';

export type LatLng = {
    lat: number;
    lng: number;
}

export type TrackPoint = LatLng & {
    timestamp?: Date; // 이 지점에 도달한 시간
}

export type TrackingVehicle = {
    id: string | number;
    label?: string;
    position: TrackPoint;
    path?: {
        points: TrackPoint[];
        style: Partial<{
            strokeColor: string;
            strokeWeight: number;
        }>;
        display?: boolean;
    };
    marker?: {
        image?: {
            src: string;
            size: { width: number; height: number };
            offset: { x: number; y: number };
        };
        display?: boolean;
    };
    onClick?: (vehicle: TrackingVehicle) => void;
}

interface TrackingMapProps {
    center: TrackPoint;
    level: number;
    vehicles?: TrackingVehicle[];
    onVehicleClick?: (vehicle: TrackingVehicle) => void;
    onCenterChange?: (center: LatLng) => void;
}

const TrackingMap = ({
    center,
    level,
    vehicles = [],
    onVehicleClick,
    onCenterChange
}: TrackingMapProps) => {
    useKakaoLoader();

    return (
        <Map
            className='w-full h-full'
            key={level}
            center={center}
            level={level}
            onCenterChanged={(e) => {
                const c = e.getCenter();
                onCenterChange?.({ lat: c.getLat(), lng: c.getLng() });
            }}
        >
            <MapTypeControl position={'TOPRIGHT'} />
            <ZoomControl position={'BOTTOMRIGHT'} />

            {/* 차량 마커와 경로 표시 */}
            {vehicles.length > 1 && (
                <MarkerClusterer averageCenter={true} minLevel={9} minClusterSize={1}>
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id}>
                            {/* 차량 마커 */}
                            {vehicle.marker?.display !== false && (
                                <MapMarker
                                    position={vehicle.position}
                                    onClick={() => {
                                        vehicle.onClick?.(vehicle);
                                        onVehicleClick?.(vehicle);
                                    }}
                                    image={vehicle.marker?.image}
                                />
                            )}

                            {/* 차량 경로 */}
                            {vehicle.path && vehicle.path.display !== false && vehicle.path.points.length > 0 && (
                                <Polyline
                                    path={vehicle.path.points}
                                    strokeColor={vehicle.path.style?.strokeColor || 'blue'}
                                    strokeWeight={vehicle.path.style?.strokeWeight || 2}
                                />
                            )}
                        </div>
                    ))}
                </MarkerClusterer>
            )}

            {
                vehicles.length === 1 && (
                    <>
                        <MapMarker
                            position={vehicles[0].position}
                            image={vehicles[0].marker?.image}
                        />
                        {
                            vehicles[0].path && vehicles[0].path.display !== false && vehicles[0].path.points.length > 0 && (
                                <Polyline
                                    path={vehicles[0].path.points}
                                    strokeColor={vehicles[0].path.style?.strokeColor || 'blue'}
                                    strokeWeight={vehicles[0].path.style?.strokeWeight || 2}
                                />
                            )
                        }
                    </>
                )
            }
        </Map>
    );
};

export default TrackingMap; 