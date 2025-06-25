import { Card, CardBody, CardHeader, Button, Textarea } from "@nextui-org/react";
import { ArrowLeft, Clock, Car, User, Route, Gauge, TrendingUp, Pencil, MapPin, Flag } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CustomOverlayMap, Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import { useState } from "react";
import { formatDate, formatDuration } from "@/utils/format";
import { useDrivingHistoryPathQuery } from "@/hooks/api/drivingHistory";
import useMapCenter from "@/hooks/useMapCenter";

// 임시 단일 운행 상세 데이터
const mockTripDetailData = {
    id: 1,
    startTime: "2024-03-21 09:05",
    endTime: "2024-03-21 10:15",
    vehicleNumber: "12가 3456",
    vehicleModel: "소나타",
    driver: "홍길동",
    distance: 25,
    duration: "1시간 10분",
    avgSpeed: "21 km/h",
    fuelConsumed: "2.1 L",
    note: "강남 지역 교통 정체로 예상보다 시간이 지연됨. 다음 운행 시 참고 필요.",
    path: [
        { lat: 37.4979, lng: 127.0276 },
        { lat: 37.48, lng: 127.08 },
        { lat: 37.4563, lng: 127.1287 }
    ],
};

type Point = {
    lat: number;
    lng: number;
}

const DrivingLogDetailPage = () => {
    useKakaoLoader();
    const navigate = useNavigate();
    const { state } = useLocation();
    const log = state?.log;
    const tripData = mockTripDetailData;
    const { data: path } = useDrivingHistoryPathQuery(log.id);

    const [note, setNote] = useState(tripData.note);
    const [isEditingNote, setIsEditingNote] = useState(false);

    const handleSaveNote = () => {
        // 실제 앱에서는 API를 통해 노트를 저장하는 로직이 필요합니다.
        console.log("저장된 비고:", note);
        setIsEditingNote(false);
    };

    const polylinePath = (path?.data ?? []).map(p => ({
        lat: p.latitude,
        lng: p.longitude,
    }));

    const getCenter = (points: Point[]): Point => {
        if (points.length === 0) return { lat: 37.5665, lng: 126.9780 }; // 서울 시청 등 기본값
        const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
        const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
        return { lat, lng };
      };

    return (
        <div className="p-6">
            {/* Header */}
            <header className="mb-6">
                <Button variant="light" startContent={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)} className="mb-4">
                    뒤로가기
                </Button>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">운행 상세 정보</h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500"/>{formatDate(log.driveStartedAt)} ~ {formatDate(log.driveEndedAt)}</span>
                        <span className="flex items-center gap-2"><Car className="w-4 h-4 text-blue-500"/>{log.carName} ({log.licenseNumber})</span>
                        <span className="flex items-center gap-2"><User className="w-4 h-4 text-blue-500"/>{log.driverName || "미등록"}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                {/* 왼쪽 영역 (요약, 비고) */}
                <div className="space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader><h2 className="text-xl font-semibold text-gray-800">운행 요약</h2></CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <Route className="w-8 h-8 mx-auto text-gray-500 mb-1"/>
                                    <p className="text-sm font-medium text-gray-600">주행거리</p>
                                    <p className="text-xl font-bold text-gray-800">{(log.nextMileageSum - log.previousMileageSum)/1000} km</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <Clock className="w-8 h-8 mx-auto text-gray-500 mb-1"/>
                                    <p className="text-sm font-medium text-gray-600">운행시간</p>
                                    <p className="text-xl font-bold text-gray-800">{formatDuration(log.driveStartedAt, log.driveEndedAt)}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <Gauge className="w-8 h-8 mx-auto text-gray-500 mb-1"/>
                                    <p className="text-sm font-medium text-gray-600">평균 속도</p>
                                    <p className="text-xl font-bold text-gray-800">{log.speed} km/h</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* 오른쪽 영역 (지도) */}
                <div className="space-y-6">
                    <Card className="shadow-lg h-full">
                        <CardHeader><h2 className="text-xl font-semibold text-gray-800">운행 경로</h2></CardHeader>
                        <CardBody className="p-0">
                            <Map center={getCenter(polylinePath)} style={{ width: '100%', height: '100%', minHeight: '500px' }} level={8}>
                                <Polyline path={polylinePath} strokeColor="#3b82f6" strokeWeight={4} />
                                <CustomOverlayMap position={polylinePath[0]}>
                                    <div
                                        className="flex flex-col items-center"
                                        style={{ transform: "translateY(-32px)" }}
                                    >
                                        <span className="text-sm font-semibold text-gray-600">출발지</span>
                                        <MapPin className="w-12 h-12 text-blue-600 drop-shadow" />
                                    </div>
                                </CustomOverlayMap>
                                <CustomOverlayMap position={polylinePath[polylinePath.length - 1]}>
                                    <div
                                        className="flex flex-col items-center"
                                        style={{ transform: "translateY(-32px)" }}
                                    >
                                        <span className="text-sm font-semibold text-gray-600">도착지</span>
                                        <MapPin className="w-12 h-12 text-red-600 drop-shadow" />
                                    </div>
                                </CustomOverlayMap>
                            </Map>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DrivingLogDetailPage; 