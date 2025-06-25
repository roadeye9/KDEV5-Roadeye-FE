import { Button, Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Car, Plus, Search, Edit, Hash, MapPin } from "lucide-react";
import { useVehicle } from "@/hooks/pages/useVehicle";
import { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Pagination from "@/components/common/Pagination";

const VehiclePage = () => {
    const { vehicles, pagination } = useVehicle();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

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
            <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} size="2xl">
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
                                        defaultValue={selectedVehicle?.vehicleNumber}
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
                                        defaultValue={selectedVehicle?.mileage}
                                        startContent={<MapPin className="text-blue-500" />}
                                    />
                                    <Select
                                        label="상태"
                                        defaultSelectedKeys={[selectedVehicle?.status || "available"]}
                                        startContent={<Car className="text-blue-500" />}
                                    >
                                        <SelectItem key="available" value="available">사용 가능</SelectItem>
                                        <SelectItem key="unavailable" value="unavailable">사용 불가능</SelectItem>
                                    </Select>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    취소
                                </Button>
                                <Button color="primary" onPress={onClose}>
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
                    <div className="flex flex-wrap items-center gap-4 justify-between">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    className="w-64 pl-10"
                                    placeholder="차량 검색..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select 
                                className="w-40" 
                                defaultSelectedKeys={["all"]} 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <SelectItem key="all" value="all">전체 상태</SelectItem>
                                <SelectItem key="available" value="available">사용 가능</SelectItem>
                                <SelectItem key="unavailable" value="unavailable">사용 불가능</SelectItem>
                            </Select>
                        </div>
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
                </section>

                {/* Vehicle Cards */}
                <div className="flex-1 p-6 bg-gray-50 overflow-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {(vehicles.data?.data ?? []).map((vehicle: any, index: number) => (
                            <div 
                                key={vehicle.id || index}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                            >
                                {/* Vehicle Image */}
                                <div className="relative h-48 bg-gray-100 overflow-hidden">
                                    <img 
                                        src={vehicle.imageUrl || "/car.jpg"} 
                                        alt={vehicle.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Vehicle Info */}
                                <div className="p-5">
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xl font-semibold text-gray-800">
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
                                        <p className="text-gray-600 flex items-center gap-2">
                                            <Hash className="text-blue-500 w-4 h-4" />
                                            {vehicle.licenseNumber}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                            <MapPin className="text-blue-500 w-4 h-4" />
                                            <span className="text-sm text-gray-600">
                                                주행거리: <span className="font-medium text-gray-800">
                                                    {vehicle.mileageInitial?.toLocaleString()} km
                                                </span>
                                            </span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="light"
                                            color="primary"
                                            startContent={<Edit className="w-4 h-4" />}
                                            onClick={() => handleEditClick(vehicle)}
                                        >
                                            수정
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {(vehicles.data?.data?.length ?? 0) === 0 && (
                        <div className="text-center py-12">
                            <Car className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-500">등록된 차량이 없습니다.</p>
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