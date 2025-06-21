import { Card, CardBody, CardHeader, Button, Textarea } from "@nextui-org/react";
import { ArrowLeft, Clock, Car, User, Route, Gauge, TrendingUp, Pencil, MapPin, Flag } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import { useState } from "react";

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

const DrivingLogDetailPage = () => {
    useKakaoLoader();
    const navigate = useNavigate();
    const { logId } = useParams();
    const tripData = mockTripDetailData;

    const [note, setNote] = useState(tripData.note);
    const [isEditingNote, setIsEditingNote] = useState(false);

    const handleSaveNote = () => {
        // 실제 앱에서는 API를 통해 노트를 저장하는 로직이 필요합니다.
        console.log("저장된 비고:", note);
        setIsEditingNote(false);
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
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500"/>{tripData.startTime} ~ {tripData.endTime}</span>
                        <span className="flex items-center gap-2"><Car className="w-4 h-4 text-blue-500"/>{tripData.vehicleModel} ({tripData.vehicleNumber})</span>
                        <span className="flex items-center gap-2"><User className="w-4 h-4 text-blue-500"/>{tripData.driver}</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 왼쪽 영역 (요약, 비고) */}
                <div className="space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader><h2 className="text-xl font-semibold text-gray-800">운행 요약</h2></CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <Route className="w-8 h-8 mx-auto text-gray-500 mb-1"/>
                                    <p className="text-sm font-medium text-gray-600">주행거리</p>
                                    <p className="text-xl font-bold text-gray-800">{tripData.distance} km</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <Clock className="w-8 h-8 mx-auto text-gray-500 mb-1"/>
                                    <p className="text-sm font-medium text-gray-600">운행시간</p>
                                    <p className="text-xl font-bold text-gray-800">{tripData.duration}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <Gauge className="w-8 h-8 mx-auto text-gray-500 mb-1"/>
                                    <p className="text-sm font-medium text-gray-600">평균 속도</p>
                                    <p className="text-xl font-bold text-gray-800">{tripData.avgSpeed}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg">
                                    <TrendingUp className="w-8 h-8 mx-auto text-gray-500 mb-1"/>
                                    <p className="text-sm font-medium text-gray-600">소모 연료</p>
                                    <p className="text-xl font-bold text-gray-800">{tripData.fuelConsumed}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="shadow-lg">
                        <CardHeader className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">비고</h2>
                            {!isEditingNote && (
                                <Button size="sm" variant="light" color="primary" startContent={<Pencil className="w-4 h-4"/>} onClick={() => setIsEditingNote(true)}>
                                    수정
                                </Button>
                            )}
                        </CardHeader>
                        <CardBody>
                            {isEditingNote ? (
                                <div className="space-y-3">
                                    <Textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="운행에 대한 특이사항을 입력하세요."
                                        minRows={4}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <Button size="sm" variant="light" onClick={() => { setIsEditingNote(false); setNote(tripData.note); }}>
                                            취소
                                        </Button>
                                        <Button size="sm" color="primary" onClick={handleSaveNote}>
                                            저장
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-700 whitespace-pre-wrap min-h-[100px]">{note || "입력된 비고가 없습니다."}</p>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* 오른쪽 영역 (지도) */}
                <div className="space-y-6">
                    <Card className="shadow-lg h-full">
                        <CardHeader><h2 className="text-xl font-semibold text-gray-800">운행 경로</h2></CardHeader>
                        <CardBody className="p-0">
                            <Map center={tripData.path[Math.floor(tripData.path.length / 2)]} style={{ width: '100%', height: '100%', minHeight: '500px' }} level={8}>
                                <Polyline path={tripData.path} strokeColor="#3b82f6" strokeWeight={4} />
                                <MapMarker position={tripData.path[0]}>
                                    <div className="p-2 bg-white rounded-md shadow-md text-center">
                                        <Flag className="w-5 h-5 text-green-600 mx-auto mb-1"/>
                                        <span className="text-xs font-semibold">출발지</span>
                                    </div>
                                </MapMarker>
                                <MapMarker position={tripData.path[tripData.path.length - 1]}>
                                    <div className="p-2 bg-white rounded-md shadow-md text-center">
                                        <MapPin className="w-5 h-5 text-red-600 mx-auto mb-1"/>
                                        <span className="text-xs font-semibold">도착지</span>
                                    </div>
                                </MapMarker>
                            </Map>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DrivingLogDetailPage; 