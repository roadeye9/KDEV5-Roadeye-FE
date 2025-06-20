import { useEffect, useState } from "react";
import { Map, MapMarker, MapTypeControl, MarkerClusterer, Polyline, ZoomControl } from "react-kakao-maps-sdk";
import CarFrontImage from "@/assets/images/car-front.svg";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import { useVehicleAllQuery } from "@/hooks/api/vehicle";
import { VehicleDetails } from "@/api/vehicle";
import { Vehicle } from "@/api/vehicle";
import { ListModel, DrivingLocationDetail } from "@/api/location";
import useMapCenter, { Coordinate } from "@/hooks/useMapCenter";
import { useDrivingHistoryQuery } from "@/hooks/api/location";

const PULL_INTERVAL_MS = 10000; // 10초

type Point = {
  lat: number;
  lng: number;
}
type Path = Point[]

function getPath(drivingHistory: DrivingLocationDetail[]): Path {
  return drivingHistory.map(item => ({
    lat: item.latitude,
    lng: item.longitude,
  }));
}


function DrivingPage() {
  useKakaoLoader();

  const { data: vehicles, isLoading, refetch } = useVehicleAllQuery();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDetails | null>(null);
  const [path, setPath] = useState<Path>([]);
  const [center, setCenter] = useMapCenter();
  const [mapLevel, setMapLevel] = useState(12);
  const { data: drivingHistory } = useDrivingHistoryQuery(selectedVehicle?.id ?? 0);

  useEffect(() => {
    if (selectedVehicle && drivingHistory) {
      setCenter({ lat: selectedVehicle.latitude, lng: selectedVehicle.longitude });
      setMapLevel(4);
      setPath(getPath(drivingHistory));
    } else {
      setPath([]);
    }
  }, [selectedVehicle, drivingHistory]);
  
  console.log(drivingHistory);


  return (
    <div className="flex flex-row h-full">
      <div className="w-64 bg-gray-50 border-r h-full overflow-y-auto">
        {selectedVehicle ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center p-4 border-b gap-2">
              <button
                className="text-sm px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setSelectedVehicle(null)}
              >
                ← 뒤로가기
              </button>
              <span className="font-bold text-lg">차량 상세 정보</span>
            </div>
            <div className="flex flex-col gap-2 p-2">
              <div><img src={selectedVehicle.imageUrl} alt="car" className="w-full h-auto" /></div>
              <div><span className="font-semibold">이름:</span> {selectedVehicle.name}</div>
              <div><span className="font-semibold">상태:</span> {selectedVehicle.ignitionStatus}</div>
              <div><span className="font-semibold">속도:</span> {selectedVehicle.speed} km/h</div>
              <div><span className="font-semibold">방향:</span> {selectedVehicle.direction}°</div>
              <div><span className="font-semibold">위치:</span> {selectedVehicle.latitude}, {selectedVehicle.longitude}</div>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 font-bold text-lg border-b">차량 목록</div>
            <ul className="max-h-[calc(100vh-64px)] overflow-y-auto">
              {vehicles?.map((vehicle) => (
                <li
                  key={vehicle.id}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-100`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="flex flex-col">
                    <span>{vehicle.name}</span>
                    <span className="text-xs text-gray-500">상태: {vehicle.ignitionStatus}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="flex-1 h-full">
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
            {vehicles?.map((vehicle) => (
              <MapMarker
                key={vehicle.id}
                position={{ lat: vehicle.latitude, lng: vehicle.longitude }}
                onClick={() => {
                  setSelectedVehicle(vehicle);
                  setMapLevel(4);
                }}
              />
            ))}
          </MarkerClusterer>
          {path && (
            <>
              <Polyline path={path} strokeColor={"blue"} strokeWeight={2} />
            </>
          )}
        </Map>
      </div>
    </div>
  );
}

export default DrivingPage;