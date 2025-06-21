import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Truck, CircleParking, Wrench, MapPin } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import { useState } from "react";

// 임시 차트 데이터
const chartData = [
    { name: '1일', count: 4 }, { name: '2일', count: 12 }, { name: '3일', count: 5 },
    { name: '4일', count: 6 }, { name: '5일', count: 5 }, { name: '6일', count: 4 },
    { name: '7일', count: 3 }, { name: '8일', count: 8 }, { name: '9일', count: 92 },
    { name: '10일', count: 82 }, { name: '11일', count: 4 }, { name: '12일', count: 24 },
    { name: '13일', count: 8 },
];

// 임시 차량 위치 데이터
const mockVehicles = [
    { id: 1, name: "소나타", lat: 37.5665, lng: 126.9780 },
    { id: 2, name: "그랜저", lat: 37.5796, lng: 126.9770 },
    { id: 3, name: "K5", lat: 35.1796, lng: 129.0756 },
    { id: 4, name: "아반떼", lat: 35.8714, lng: 128.6014 },
    { id: 5, name: "투싼", lat: 36.3504, lng: 127.3845 },
    { id: 6, name: "싼타페", lat: 35.1595, lng: 126.8526 },
    { id: 7, name: "팰리세이드", lat: 37.4563, lng: 126.7052 },
];

const Dashboard = () => {
    useKakaoLoader();
    const [mapCenter] = useState({ lat: 36.5, lng: 127.5 });
    const [openVehicleId, setOpenVehicleId] = useState<number | null>(null);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 왼쪽 영역 (차량 현황 + 월별 통계) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 차량 현황판 */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-gray-800">차량 현황판</h2>
                        </CardHeader>
                        <CardBody>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                                <div className="p-6 bg-blue-50 rounded-2xl">
                                    <Truck className="w-12 h-12 mx-auto text-blue-500 mb-2" />
                                    <p className="text-lg font-semibold text-gray-700">운행중</p>
                                    <p className="text-3xl font-bold text-blue-600">10<span className="text-lg ml-1">대</span></p>
                                </div>
                                <div className="p-6 bg-green-50 rounded-2xl">
                                    <CircleParking className="w-12 h-12 mx-auto text-green-500 mb-2" />
                                    <p className="text-lg font-semibold text-gray-700">대기중</p>
                                    <p className="text-3xl font-bold text-green-600">10<span className="text-lg ml-1">대</span></p>
                                </div>
                                <div className="p-6 bg-orange-50 rounded-2xl">
                                    <Wrench className="w-12 h-12 mx-auto text-orange-500 mb-2" />
                                    <p className="text-lg font-semibold text-gray-700">정비중</p>
                                    <p className="text-3xl font-bold text-orange-600">10<span className="text-lg ml-1">대</span></p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* 월별 통계 */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-gray-800">월별 통계 - 운행 횟수</h2>
                        </CardHeader>
                        <CardBody>
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="count" name="일별 운행 건수" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* 오른쪽 영역 (지도) */}
                <div className="lg:col-span-1">
                    <Card className="shadow-lg h-full">
                        <CardHeader>
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-red-500" />
                                지도 (차량 실시간 현황)
                            </h2>
                        </CardHeader>
                        <CardBody className="p-0">
                            <Map
                                center={mapCenter}
                                style={{ width: '100%', height: '100%', minHeight: '500px', borderRadius: '0 0 14px 14px' }}
                                level={12}
                                onClick={() => setOpenVehicleId(null)}
                            >
                                <MarkerClusterer averageCenter={true} minLevel={10}>
                                    {mockVehicles.map((vehicle) => (
                                        <MapMarker
                                            key={vehicle.id}
                                            position={{ lat: vehicle.lat, lng: vehicle.lng }}
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