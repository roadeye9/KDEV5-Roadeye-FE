import { Button, Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Car, Plus, Search, Edit, Hash, MapPin } from "lucide-react";
import { useVehicle } from "@/hooks/pages/useVehicle";
import { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Pagination from "@/components/common/Pagination";
import { useVehicleDetailQuery } from "@/hooks/api/vehicle";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const VehiclePage = () => {
    const { vehicles, pagination, status, setStatus } = useVehicle();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDetailPanel, setShowDetailPanel] = useState(false);
    const { data: vehicleDetail, isLoading: isDetailLoading } = useVehicleDetailQuery(selectedVehicle?.id ?? null, { enabled: !!selectedVehicle });
    const [modalError, setModalError] = useState("");

    const handleEditClick = (vehicle: any) => {
        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    };

    const totalPages = Math.ceil((pagination.totalElements ?? 0) / pagination.pageSize);
    const maxPageButtons = 10;
    const startPage = Math.floor((pagination.currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
    const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
    const pageNumbers = Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);

    return (
        <>
            {/* 차량 등록/수정 모달 */}
            <Modal isOpen={isModalOpen} onOpenChange={(open) => { setIsModalOpen(open); setModalError(""); }} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <Car className="text-blue-500" />
                                    <span>차량 {selectedVehicle ? '수정' : '등록'}</span>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-4">
                                    <Input
                                        label="차량 번호"
                                        placeholder="차량 번호를 입력하세요"
                                        defaultValue={selectedVehicle?.licenseNumber}
                                        startContent={<Hash className="text-blue-500" />}
                                    />
                                    <Input
                                        label="차량 이름"
                                        placeholder="차량 이름을 입력하세요"
                                        defaultValue={selectedVehicle?.name}
                                        startContent={<Car className="text-blue-500" />}
                                    />
                                    <Input
                                        label="주행거리 (km)"
                                        type="number"
                                        placeholder="주행거리를 입력하세요"
                                        defaultValue={((selectedVehicle?.mileageCurrent ?? 0)/1000).toLocaleString()}
                                        startContent={<MapPin className="text-blue-500" />}
                                    />
                                </div>
                                {modalError && (
                                    <div className="text-red-500 text-sm mt-2 text-center">{modalError}</div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    취소
                                </Button>
                                <Button color="primary" onPress={() => setModalError('서버에 일시적인 오류가 발생했습니다. 잠시 후 다시 이용해주세요.') }>
                                    {selectedVehicle ? '수정' : '등록'}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <div className="flex flex-col h-screen">
                {/* Header */}
                <header className="p-6 bg-white border-b">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <Car className="text-blue-500" />
                        차량 관리
                    </h1>
                </header>

                {/* Controls */}
                <section className="p-6 bg-white border-b">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <span className="text-lg font-semibold text-gray-800">총 {vehicles.data?.pageInfo?.total ?? 0}대</span>
                        <div className="flex items-center gap-3 ml-auto">
                            <Select 
                                className="w-40" 
                                selectedKeys={status ? [status] : ["all"]}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setStatus(value === "all" ? undefined : value as "ON" | "OFF"); // 'all'이면 undefined로 설정
                                    pagination.onPageChange(1); // 필터 변경 시 페이지를 1로 초기화
                                }}
                                aria-label="상태 필터"
                            >
                                <SelectItem key="all" value="all">전체 상태</SelectItem>
                                <SelectItem key="ON" value="ON">운행중</SelectItem>
                                <SelectItem key="OFF" value="OFF">정지</SelectItem>
                            </Select>
                            <Button 
                                color="primary" 
                                startContent={<Plus className="w-4 h-4" />}
                                onClick={() => {
                                    setSelectedVehicle(null);
                                    setIsModalOpen(true);
                                }}
                            >
                                차량 등록
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Vehicle Cards (리스트형) */}
                <div className="flex-1 p-6 bg-gray-50 overflow-auto relative">
                    <div className="flex flex-col gap-4">
                        {(vehicles.data?.data ?? []).map((vehicle: any, index: number) => (
                            <div 
                                key={vehicle.id || index}
                                className="flex items-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group px-4 py-3 cursor-pointer"
                                onClick={() => {
                                    setSelectedVehicle(vehicle);
                                    setShowDetailPanel(true);
                                }}
                            >
                                {/* Vehicle Image */}
                                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden mr-6">
                                    <img 
                                        src={vehicle.imageUrl || "/car.jpg"} 
                                        alt={vehicle.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Vehicle Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                                            {vehicle.name}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                            vehicle.ignitionStatus === 'ON' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            <i className={`fas fa-circle text-xs ${vehicle.ignitionStatus === 'ON' ? 'text-green-500' : 'text-gray-500'}`}></i>
                                            {vehicle.ignitionStatus === 'ON' ? '운행중' : '대기중'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-600 text-sm mb-1">
                                        <span className="flex items-center gap-1"><Hash className="text-blue-500 w-4 h-4" />{vehicle.licenseNumber}</span>
                                        <span className="flex items-center gap-1"><MapPin className="text-blue-500 w-4 h-4" />주행거리: <span className="font-medium text-gray-800">{((vehicle.mileageCurrent ?? 0)/1000).toLocaleString()} km</span></span>
                                    </div>
                                </div>
                                {/* <Button
                                    size="sm"
                                    variant="light"
                                    color="primary"
                                    startContent={<Edit className="w-4 h-4" />}
                                    onClick={e => { e.stopPropagation(); handleEditClick(vehicle); }}
                                >
                                    수정
                                </Button> */}
                            </div>
                        ))}
                    </div>

                    {(vehicles.data?.data?.length ?? 0) === 0 && (
                        <div className="text-center py-12">
                            <Car className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-500">등록된 차량이 없습니다.</p>
                        </div>
                    )}

                    {/* 차량 상세 정보 패널 */}
                    {showDetailPanel && selectedVehicle && (
                        <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 p-8 overflow-y-auto border-l border-gray-200 animate-slide-in">
                            <button
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
                                onClick={() => setShowDetailPanel(false)}
                            >
                                <span className="text-xl">&times;</span>
                            </button>
                            {isDetailLoading ? (
                                <div className="flex items-center justify-center h-full">로딩 중...</div>
                            ) : vehicleDetail ? (
                                <>
                                    <div className="flex flex-col items-center mb-6">
                                        <img
                                            src={vehicleDetail.imageUrl || "/car.jpg"}
                                            alt={vehicleDetail.name}
                                            className="w-32 h-32 object-cover rounded-xl mb-3"
                                        />
                                        <h2 className="text-2xl font-bold text-gray-800 mb-1">{vehicleDetail.name}</h2>
                                        <span className="text-gray-500 text-sm mb-2">{vehicleDetail.licenseNumber}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                            vehicleDetail.ignitionStatus === 'ON'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            <i className={`fas fa-circle text-xs ${vehicleDetail.ignitionStatus === 'ON' ? 'text-green-500' : 'text-gray-500'}`}></i>
                                            {vehicleDetail.ignitionStatus === 'ON' ? '운행중' : '대기중'}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-gray-500">주행거리</label>
                                            <p className="text-base text-gray-800 font-medium">{((vehicleDetail.mileageCurrent ?? 0)/1000).toLocaleString()} km</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">배터리 전압</label>
                                            <p className="text-base text-gray-800 font-medium">{vehicleDetail.batteryVoltage ?? '-'} V</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">상태</label>
                                            <p className="text-base text-gray-800 font-medium">{vehicleDetail.ignitionStatus === 'ON' ? '운행중' : '정지'}</p>
                                        </div>
                                    
                                        {typeof vehicleDetail.latitude === 'number' && typeof vehicleDetail.longitude === 'number' && (
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">현재 위치</label>
                                                <div className="w-full h-56 rounded-lg overflow-hidden border">
                                                    <Map
                                                        center={{ lat: vehicleDetail.latitude, lng: vehicleDetail.longitude }}
                                                        style={{ width: '100%', height: '100%' }}
                                                        level={5}
                                                    >
                                                        <MapMarker position={{ lat: vehicleDetail.latitude, lng: vehicleDetail.longitude }} />
                                                    </Map>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-500">차량 정보를 불러올 수 없습니다.</div>
                            )}
                        </div>
                    )}
                </div>
                {/* Pagination */}
                <Pagination
                  currentPage={pagination.currentPage}
                  pageSize={pagination.pageSize}
                  totalElements={pagination.totalElements}
                  onPageChange={pagination.onPageChange}
                />
            </div>
        </>
    );
};

export default VehiclePage;