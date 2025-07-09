import useKakaoLoader from '@/hooks/useKakaoLoader';
import { Map, MapMarker, MapTypeControl, Polyline, ZoomControl, MarkerClusterer } from 'react-kakao-maps-sdk';

export type LatLng = {
    lat: number;
    lng: number;
}

export type TrackPoint = LatLng & {
    timestamp?: Date; // 이 지점에 도달한 시간
}

export type PathStyle = {
    strokeColor: string;
    strokeWeight: number;
}

export type MarkerStyle = {
    image?: {
        src: string;
        size: { width: number; height: number };
        offset: { x: number; y: number };
    };
}

export type TrackingVehicle = {
    id: string | number;
    label?: string;
    position: TrackPoint;
    path?: {
        points: TrackPoint[];
        style?: PathStyle;
        display?: boolean;
    };
    marker?: {
        image?: MarkerStyle['image'];
        display?: boolean;
    };
    onClick?: (vehicle: TrackingVehicle) => void;
}

const defaultZoomControl = {
    position: 'BOTTOMRIGHT',
    visible: true
} as const;

const defaultMapTypeControl = {
    position: 'TOPRIGHT',
    visible: true
} as const;

interface TrackingMapProps {
    center: TrackPoint;
    level: number;
    vehicles?: TrackingVehicle[];
    defaultOptions?: Partial<{
        path: {
            style?: PathStyle;
        };
        marker: MarkerStyle;
    }>;
    zoomControl?: boolean | typeof defaultZoomControl;
    mapTypeControl?: boolean | typeof defaultMapTypeControl;
    onVehicleClick?: (vehicle: TrackingVehicle) => void;
    onCenterChange?: (center: LatLng) => void;
}

const TrackingMap = ({
    center,
    level,
    vehicles = [],
    zoomControl = true,
    mapTypeControl = true,
    onVehicleClick,
    onCenterChange,
    defaultOptions = {
        path: {
            style: {
                strokeColor: '#FF0000',
                strokeWeight: 4
            },
        },
        marker: {
            image: {
                src: '/images/carMarker.png',
                size: { width: 64, height: 64 },
                offset: { x: 0, y: 0 }
            }
        }
    }
}: TrackingMapProps) => {
    useKakaoLoader();

    const mapTypeOptions = typeof mapTypeControl === 'boolean' && mapTypeControl ? defaultMapTypeControl : mapTypeControl;
    const zoomOptions = typeof zoomControl === 'boolean' && zoomControl ? defaultZoomControl : zoomControl;

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
            {mapTypeOptions && <MapTypeControl {...mapTypeOptions} />}
            {zoomOptions && <ZoomControl {...zoomOptions} />}

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
                                    image={vehicle.marker?.image ?? defaultOptions?.marker?.image}
                                />
                            )}

                            {/* 차량 경로 */}
                            {vehicle.path && vehicle.path.display !== false && vehicle.path.points.length > 0 && (
                                <Polyline
                                    path={vehicle.path.points}
                                    strokeColor={vehicle.path.style?.strokeColor ?? defaultOptions?.path?.style?.strokeColor}
                                    strokeWeight={vehicle.path.style?.strokeWeight ?? defaultOptions?.path?.style?.strokeWeight}
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
                            image={vehicles[0].marker?.image ?? defaultOptions?.marker?.image}
                        />
                        {
                            vehicles[0].path && vehicles[0].path.display !== false && vehicles[0].path.points.length > 0 && (
                                <Polyline
                                    path={vehicles[0].path.points}
                                    strokeColor={vehicles[0].path.style?.strokeColor ?? defaultOptions?.path?.style?.strokeColor}
                                    strokeWeight={vehicles[0].path.style?.strokeWeight ?? defaultOptions?.path?.style?.strokeWeight}
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