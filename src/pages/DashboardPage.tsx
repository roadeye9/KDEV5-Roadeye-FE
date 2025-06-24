import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Truck, CircleParking, Wrench, MapPin } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/hooks/useKakaoLoader";
import { useState } from "react";
import { useCarIgnitionCount, useDrivingLogMonthlyCount } from "@/hooks/api/dashboard";
import { useVehicleAllQuery } from "@/hooks/api/vehicle";

const Dashboard = () => {
    useKakaoLoader();
    const [mapCenter] = useState({ lat: 36.5, lng: 127.5 });
    const [openVehicleId, setOpenVehicleId] = useState<number | null>(null);
    const { data: runningCount } = useCarIgnitionCount("ON", "ACTIVE");
    const { data: idleCount } = useCarIgnitionCount("OFF", "ACTIVE");
    const { data: repairCount } = useCarIgnitionCount("OFF", "DISABLED");
    const { data: monthlyStats } = useDrivingLogMonthlyCount();
    const { data: vehicles, isLoading, refetch } = useVehicleAllQuery();

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
                                    <p className="text-3xl font-bold text-blue-600">{runningCount}<span className="text-lg ml-1">대</span></p>
                                </div>
                                <div className="p-6 bg-green-50 rounded-2xl">
                                    <CircleParking className="w-12 h-12 mx-auto text-green-500 mb-2" />
                                    <p className="text-lg font-semibold text-gray-700">대기중</p>
                                    <p className="text-3xl font-bold text-green-600">{idleCount}<span className="text-lg ml-1">대</span></p>
                                </div>
                                <div className="p-6 bg-orange-50 rounded-2xl">
                                    <Wrench className="w-12 h-12 mx-auto text-orange-500 mb-2" />
                                    <p className="text-lg font-semibold text-gray-700">정비중</p>
                                    <p className="text-3xl font-bold text-orange-600">{repairCount}<span className="text-lg ml-1">대</span></p>
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
                                    <LineChart data={monthlyStats} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="count" name="월별 운행 건수" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
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
                                <MarkerClusterer averageCenter={true} minLevel={10} minClusterSize={1}>
                                    {!isLoading && vehicles?.map((vehicle) => (
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