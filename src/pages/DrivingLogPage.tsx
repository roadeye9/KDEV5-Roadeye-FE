import { Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Car, User, Route, Eye, FileSpreadsheet, Search, RotateCcw, Clock } from "lucide-react";
import { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from "react-router-dom";

// 임시 데이터: 개별 운행 기록 기준
const mockDrivingLogs = [
    {
        id: 1,
        startTime: "2024-03-21 09:05",
        endTime: "2024-03-21 10:15",
        vehicleNumber: "12가 3456",
        vehicleModel: "소나타",
        driver: "홍길동",
        distance: 25,
    },
    {
        id: 2,
        startTime: "2024-03-22 14:00",
        endTime: "2024-03-22 16:40",
        vehicleNumber: "34나 5678",
        vehicleModel: "그랜저",
        driver: "김철수",
        distance: 55,
    },
    {
        id: 3,
        startTime: "2024-03-23 11:30",
        endTime: "2024-03-23 16:10",
        vehicleNumber: "12가 3456",
        vehicleModel: "소나타",
        driver: "홍길동",
        distance: 65,
    },
];

const DrivingLogPage = () => {
    const [filters, setFilters] = useState({
        vehicle: "",
        startDate: "",
        endDate: "",
        driver: ""
    });
    const [filteredLogs, setFilteredLogs] = useState(mockDrivingLogs);
    const navigate = useNavigate();

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        let filtered = mockDrivingLogs;

        if (filters.vehicle) {
            filtered = filtered.filter(log => 
                log.vehicleNumber.includes(filters.vehicle) || 
                log.vehicleModel.includes(filters.vehicle)
            );
        }

        if (filters.startDate) {
            filtered = filtered.filter(log => log.startTime >= filters.startDate);
        }

        if (filters.endDate) {
            filtered = filtered.filter(log => log.endTime <= filters.endDate);
        }

        if (filters.driver) {
            filtered = filtered.filter(log => log.driver.includes(filters.driver));
        }

        setFilteredLogs(filtered);
    };

    const resetFilters = () => {
        setFilters({
            vehicle: "",
            startDate: "",
            endDate: "",
            driver: ""
        });
        setFilteredLogs(mockDrivingLogs);
    };

    const downloadExcel = () => {
        // 엑셀 다운로드 로직 (실제 구현 시 xlsx 라이브러리 사용)
        console.log("엑셀 다운로드");
        alert("엑셀 파일이 다운로드됩니다.");
    };

    const viewDetail = (logId: number) => {
        navigate(`/manage/driving-log-detail/${logId}`);
    };

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="p-6 bg-white border-b">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        <Route className="text-blue-500" />
                        운행일지
                    </h1>
                    <Button 
                        color="success" 
                        startContent={<FileSpreadsheet className="w-4 h-4" />}
                        onClick={downloadExcel}
                    >
                        엑셀 다운로드
                    </Button>
                </div>
            </header>

            {/* Filters Section */}
            <section className="p-6 bg-white border-b">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Car className="w-4 h-4 text-blue-500" />
                            차량 선택
                        </label>
                        <Select
                            placeholder="전체 차량"
                            value={filters.vehicle}
                            onChange={(e) => handleFilterChange("vehicle", e.target.value)}
                        >
                            <SelectItem key="sonata" value="소나타">소나타 (12가 3456)</SelectItem>
                            <SelectItem key="grandeur" value="그랜저">그랜저 (34나 5678)</SelectItem>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            운행시간
                        </label>
                        <Input
                            type="datetime-local"
                            value={filters.startDate}
                            onChange={(e) => handleFilterChange("startDate", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            종료시간
                        </label>
                        <Input
                            type="datetime-local"
                            value={filters.endDate}
                            onChange={(e) => handleFilterChange("endDate", e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            운전자
                        </label>
                        <Select
                            placeholder="전체 운전자"
                            value={filters.driver}
                            onChange={(e) => handleFilterChange("driver", e.target.value)}
                        >
                            <SelectItem key="hong" value="홍길동">홍길동</SelectItem>
                            <SelectItem key="kim" value="김철수">김철수</SelectItem>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button 
                        color="primary" 
                        startContent={<Search className="w-4 h-4" />}
                        onClick={applyFilters}
                    >
                        검색
                    </Button>
                    <Button 
                        variant="light" 
                        startContent={<RotateCcw className="w-4 h-4" />}
                        onClick={resetFilters}
                    >
                        초기화
                    </Button>
                </div>
            </section>

            {/* Driving Logs Table */}
            <div className="flex-1 p-6 bg-gray-50 overflow-auto">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Table aria-label="운행일지 테이블">
                        <TableHeader>
                            <TableColumn>
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-500" />운행시간</div>
                            </TableColumn>
                            <TableColumn>
                                <div className="flex items-center gap-2"><Car className="w-4 h-4 text-blue-500" />차량정보</div>
                            </TableColumn>
                            <TableColumn>
                                <div className="flex items-center gap-2"><User className="w-4 h-4 text-blue-500" />운전자</div>
                            </TableColumn>
                            <TableColumn>
                                <div className="flex items-center gap-2"><Route className="w-4 h-4 text-blue-500" />주행 거리</div>
                            </TableColumn>
                            <TableColumn>관리</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.map((log) => (
                                <TableRow key={log.id} className="hover:bg-gray-50">
                                    <TableCell>
                                        <div className="text-sm text-gray-800">{log.startTime}</div>
                                        <div className="text-sm text-gray-500">~ {log.endTime}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium text-gray-800">{log.vehicleNumber}</div>
                                        <div className="text-sm text-gray-600">{log.vehicleModel}</div>
                                    </TableCell>
                                    <TableCell>{log.driver}</TableCell>
                                    <TableCell>{log.distance} km</TableCell>
                                    <TableCell>
                                        <Button size="sm" color="primary" variant="light" startContent={<Eye className="w-4 h-4" />} onClick={() => viewDetail(log.id)}>
                                            상세보기
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredLogs.length === 0 && (
                        <div className="text-center py-12">
                            <Route className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                            <p className="text-gray-500">검색 결과가 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DrivingLogPage; 