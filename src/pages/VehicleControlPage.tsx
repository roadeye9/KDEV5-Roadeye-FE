import { useEffect, useState } from "react";
import { Map, MapMarker, MapTypeControl, MarkerClusterer, Polyline, ZoomControl } from "react-kakao-maps-sdk";
import { Button, Checkbox } from "@nextui-org/react";
import { MapPin, RefreshCw, ArrowLeft, User, Clock } from "lucide-react";
import CarFrontImage from "@/assets/images/car-front.svg";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import { useVehicleAllQuery, useVehicleByStatusQuery, useVehicleDetailQuery } from "@/hooks/api/vehicle";
import { VehicleDetails } from "@/api/vehicle";
import { Vehicle } from "@/api/vehicle";
import { ListModel, DrivingLocationDetail } from "@/api/location";
import useMapCenter, { Coordinate } from "@/hooks/useMapCenter";
import { useDrivingHistoryQuery } from "@/hooks/api/location";
import '@fortawesome/fontawesome-free/css/all.min.css';


type Point = {
  lat: number;
  lng: number;
}
type Path = (Point & { speed: number })[]

function getPath(drivingHistory: DrivingLocationDetail[]): Path {
  return drivingHistory.map(item => ({
    lat: item.latitude,
    lng: item.longitude,
    speed: item.speed,
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
  const { data: vehicles, isLoading, refetch: refetchAll } = useVehicleByStatusQuery("ON", !selectedVehicle);
  const [path, setPath] = useState<Path>([]);
  const [center, setCenter] = useMapCenter();
  const [mapLevel, setMapLevel] = useState(12);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [visibleVehicles, setVisibleVehicles] = useState<Set<number>>(new Set());
  const { data: drivingHistory } = useDrivingHistoryQuery(selectedVehicle?.id ?? 0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [originalCenter, setOriginalCenter] = useState<Coordinate>({ lat: 37.5665, lng: 126.9780 }); // 서울 시청 좌표
  const { data: vehicleDetail, refetch: refetchDetail, isFetching: isFetchingDetail } = useVehicleDetailQuery(selectedVehicle?.id ?? null, { enabled: !!selectedVehicle });

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
      setVisibleVehicles(new Set(vehicles.map(v => v.id)));
    }
  }, [vehicles]);

  // 실시간 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 1초마다 업데이트

    return () => clearInterval(timer);
  }, []);

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

  const getCurrentTime = () => {
    return currentTime.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    if (selectedVehicle) {
      console.log("refetchDetail");
      refetchDetail();
    } else {
      console.log("refetchAll");
      refetchAll();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="p-6 bg-white border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <MapPin className="text-blue-500" />
            실시간 차량관제
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{getCurrentTime()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Vehicle List Panel */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-5 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">운행중인 차량</h2>
              <Button
                isIconOnly
                variant="light"
                color="primary"
                onClick={handleRefresh}
                className="hover:rotate-180 transition-transform duration-300"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden">
            {/* Vehicle List */}
            <div className={`h-full transition-transform duration-300 ${showDetailPanel ? '-translate-x-full' : 'translate-x-0'}`}>
              <div className="p-5 space-y-4 overflow-y-auto h-full">
                {vehicles?.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={`bg-gray-50 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:-translate-y-1 ${
                      selectedVehicle?.id === vehicle.id ? 'border-2 border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleVehicleSelect(vehicle)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Checkbox
                        isSelected={visibleVehicles.has(vehicle.id)}
                        onValueChange={() => toggleVehicleVisibility(vehicle.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{vehicle.name}</h3>
                        <span className="text-sm text-gray-600">{vehicle.licenseNumber}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className={`flex items-center gap-1 text-sm ${
                        vehicle.ignitionStatus === 'ON' ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        <i className="fas fa-circle text-xs"></i>
                        {vehicle.ignitionStatus === 'ON' ? '운행중' : '정지'}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="w-3 h-3" />
                        {'미배정'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">
                        {`${vehicle.latitude.toFixed(4)}, ${vehicle.longitude.toFixed(4)}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Detail Panel */}
            <div className={`absolute top-0 left-full w-full h-full bg-white transition-transform duration-300 ${
              showDetailPanel ? '-translate-x-full' : 'translate-x-0'
            }`}>
              {selectedVehicle && (
                <div className="p-5 h-full overflow-y-auto">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-800">차량 상세 정보</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="light"
                        color="primary"
                        startContent={<ArrowLeft className="w-4 h-4" />}
                        onClick={handleBackToList}
                      >
                        목록으로
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">기본 정보</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500">차량명</label>
                          <p className="text-sm text-gray-800">{vehicleDetail?.name}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">차량번호</label>
                          <p className="text-sm text-gray-800">{vehicleDetail?.licenseNumber}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">운전자</label>
                          <p className="text-sm text-gray-800">{'미배정'}</p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">상태</label>
                          <p className={`text-sm ${
                            (selectedVehicle.ignitionStatus) === 'ON' ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {(selectedVehicle.ignitionStatus) === 'ON' ? '운행중' : '정지'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Operation Info */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">운행 정보</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-500">현재 위치</label>
                          <p className="text-sm text-gray-800">
                            {`${vehicleDetail?.latitude.toFixed(4)}, ${vehicleDetail?.longitude.toFixed(4)}`}
                          </p>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">속도</label>
                          <p className="text-sm text-gray-800">{path[path.length - 1].speed || 60} km/h</p>
                        </div>
                        <div>
                        <label className="text-xs text-gray-500">운행 시작 시간</label>
                          <p className="text-sm text-gray-800">
                            {selectedVehicle.ignitionOnTime
                              ? new Date(selectedVehicle.ignitionOnTime).toLocaleString("ko-KR", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "정보 없음"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Image */}
                    {selectedVehicle.imageUrl && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-3">차량 이미지</h4>
                        <img 
                          src={selectedVehicle.imageUrl} 
                          alt={selectedVehicle.name}
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <Map
            key={mapLevel}
            center={center}
            style={{ width: "100%", height: "100%" }}
            level={mapLevel}
          >
            <MapTypeControl position={"TOPRIGHT"} />
            <ZoomControl position={"BOTTOMRIGHT"} />
            <MarkerClusterer
              averageCenter={true}
              minLevel={9}
              minClusterSize={1}
            >
              {selectedVehicle && path.length > 0 ? (
                <MapMarker
                  key={selectedVehicle.id}
                  position={path[path.length - 1]}
                />
              ) : (
                vehicles
                  ?.filter(vehicle => visibleVehicles.has(vehicle.id) && hasLatLng(vehicle))
                  .map(vehicle => {
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
            {path.length > 0 && (
              <Polyline path={path} strokeColor={"blue"} strokeWeight={2} />
            )}
          </Map>
        </div>
      </div>
    </div>
  );
}

export default VehicleControlPage;