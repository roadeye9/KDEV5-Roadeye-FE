import { Button, Input, Select, SelectItem, Avatar, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { User } from "lucide-react";
import { useEmployee } from "@/hooks/pages/useEmployee";
import { useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

export const EmployeePage = () => {
    const { employees, pagination } = useEmployee();
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleEditClick = (employee: any) => {
        setSelectedEmployee(employee);
        setIsEditModalOpen(true);
    };

    return (
        <>
            {/* 모달 */}
            <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} placement="center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">사용자 정보 수정</ModalHeader>
                            <ModalBody>
                                <Input label="이름" defaultValue={selectedEmployee?.name} />
                                <Input label="아이디" defaultValue={selectedEmployee?.loginId} />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    취소
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    저장
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <div className="flex flex-row h-screen">
                {/* Main Content */}
                <main className="flex-1 flex flex-col h-screen overflow-hidden">
                    {/* Header */}
                    <div className="p-4 font-bold text-lg border-b">사용자 관리</div>

                    {/* Controls */}
                    <section className="flex flex-wrap items-center gap-4 px-8 py-4 bg-white border-b">
                        <Input
                            className="w-64"
                            placeholder="사용자 검색..."
                            startContent={<User className="w-4 h-4 text-gray-400" />}
                        />
                        <Select className="w-40" defaultSelectedKeys={["all"]} aria-label="상태 필터">
                            <SelectItem key="all" value="all">전체 상태</SelectItem>
                            <SelectItem key="active" value="active">활성</SelectItem>
                            <SelectItem key="inactive" value="inactive">비활성</SelectItem>
                        </Select>
                        <div className="flex-1" />
                        <Button color="primary" startContent={<User className="w-4 h-4" />}>사용자 등록</Button>
                    </section>

                    {/* Table + Pagination */}
                    <div className="flex-1 flex flex-col px-8 py-6 bg-white overflow-hidden">
                        <table className="min-w-full bg-white overflow-auto rounded shadow border">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 text-sm">
                                    <th className="px-4 py-3 text-left font-semibold">이름</th>
                                    <th className="px-4 py-3 text-left font-semibold">아이디</th>
                                    <th className="px-4 py-3 text-left font-semibold">직책</th>
                                    <th className="px-4 py-3 text-left font-semibold">생성일</th>
                                    <th className="px-4 py-3 text-left font-semibold">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(employees.data?.content ?? []).map((emp) => (
                                    <tr
                                        key={emp.employeeId}
                                        className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => setSelectedEmployee(emp)}
                                    >
                                        <td className="px-4 py-3 flex items-center gap-2">
                                            <i className="fas fa-user-circle text-lg text-gray-500" />
                                            <span>{emp.name}</span>
                                        </td>
                                        <td className="px-4 py-3">{emp.loginId}</td>
                                        <td className="px-4 py-3">
                                            {emp.position === "Administrator" ? (
                                                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">관리자</span>
                                            ) : (
                                                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">일반</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">{emp.createdAt?.slice(0, 10)}</td>
                                        <td className="px-4 py-3">
                                            <i className="fas fa-edit cursor-pointer" onClick={(e) => { e.stopPropagation(); handleEditClick(emp); }} />
                                        </td>
                                    </tr>
                                ))}
                                {(employees.data?.content?.length ?? 0) === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center text-gray-400 py-8">사용자가 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <footer className="py-4 flex justify-center bg-white">
                            <div className="flex gap-1">
                                <Button size="sm" variant="light" isDisabled={pagination.currentPage === 1} onClick={() => pagination.onPageChange(pagination.currentPage - 1)}>
                                    &lt;
                                </Button>
                                {Array.from({ length: Math.ceil((pagination.totalElements ?? 0) / pagination.pageSize) }, (_, i) => (
                                    <Button
                                        key={i}
                                        size="sm"
                                        variant={pagination.currentPage === i + 1 ? "solid" : "light"}
                                        color={pagination.currentPage === i + 1 ? "primary" : "default"}
                                        onClick={() => pagination.onPageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button size="sm" variant="light" isDisabled={pagination.currentPage === Math.ceil((pagination.totalElements ?? 0) / pagination.pageSize)} onClick={() => pagination.onPageChange(pagination.currentPage + 1)}>
                                    &gt;
                                </Button>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    );
};

export default EmployeePage;
