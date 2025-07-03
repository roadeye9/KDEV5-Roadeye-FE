import { Employee } from "@/api/auth";
import { CreateEmployeeRequest, UpdateEmployeeRequest } from "@/api/employee";
import Pagination from "@/components/common/Pagination";
import { useEmployeeMutation } from "@/hooks/api/employee";
import { useEmployee, useUpdateEmployee } from "@/hooks/pages/useEmployee";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Switch } from "@nextui-org/react";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const EmployeePage = () => {
    const { employees, pagination, status, setStatus } = useEmployee();
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    // 수정 모달을 위한 상태
    const [editName, setEditName] = useState("");
    const [editPosition, setEditPosition] = useState("");
    const [editStatus, setEditStatus] = useState(false); // true: ENABLE, false: DISABLE

    // 등록 모달을 위한 상태
    const [registerLoginId, setRegisterLoginId] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerName, setRegisterName] = useState("");
    const [registerPosition, setRegisterPosition] = useState("");

    const { updateEmployee } = useUpdateEmployee();
    const { mutate: createEmployee } = useEmployeeMutation();

    const handleEditClick = (employee: Employee) => {
        setSelectedEmployee(employee);
        setEditName(employee.name);
        setEditPosition(employee.position);
        setEditStatus(employee.status === 'ACTIVE');
        setIsEditModalOpen(true);

        console.log(employee);
    };

    const handleRegisterClick = () => {
        setRegisterLoginId("");
        setRegisterPassword("");
        setRegisterName("");
        setRegisterPosition("");
        setIsRegisterModalOpen(true);
    };

    const handleSaveChanges = () => {
        if (!selectedEmployee) return;

        const payload: UpdateEmployeeRequest = {
            name: editName,
            position: editPosition,
            status: editStatus ? 'ENABLE' : 'DISABLE',
        };

        updateEmployee(
            { employeeId: selectedEmployee.employeeId, payload },
            {
                onSuccess: () => {
                    toast.success("사용자 정보가 성공적으로 업데이트되었습니다.");
                    setIsEditModalOpen(false);
                },
                onError: (error) => {
                    toast.error("사용자 정보 업데이트에 실패했습니다.");
                    console.error("Update failed:", error);
                }
            }
        );
    };

    const handleRegisterSave = () => {
        const payload: CreateEmployeeRequest = {
            loginId: registerLoginId,
            password: registerPassword,
            name: registerName,
            position: registerPosition,
        };

        createEmployee(payload, {
            onSuccess: () => {
                toast.success("사용자가 성공적으로 등록되었습니다.");
                setIsRegisterModalOpen(false);
            },
            onError: (error) => {
                toast.error("사용자 등록에 실패했습니다.");
                console.error("Creation failed:", error);
            },
        });
    };

    useEffect(() => {
        pagination.onPageChange(1);
    }, [status]);

    return (
        <>
            <div className="flex flex-col h-screen bg-gray-50">
                <header className="p-4 font-bold text-lg border-b bg-white">사용자 관리</header>

                {/* Controls */}
                <section className="px-8 py-4 bg-white border-b">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <span className="text-lg font-semibold text-gray-800">총 {employees.data?.page?.totalElements ?? 0}명</span>
                        <div className="flex items-center gap-3 ml-auto">
                            <Select
                                className="w-40"
                                selectedKeys={status ? [status] : ["all"]}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setStatus(value === "all" ? undefined : value); // 'all'이면 undefined로 설정
                                    pagination.onPageChange(1); // 필터 변경 시 페이지를 1로 초기화
                                }}
                                aria-label="상태 필터"
                            >
                                <SelectItem key="all" value="all">전체 상태</SelectItem>
                                <SelectItem key="ACTIVE" value="ACTIVE">활성</SelectItem>
                                <SelectItem key="DISABLED" value="DISABLED">비활성</SelectItem>
                            </Select>
                            <Button color="primary" startContent={<User className="w-4 h-4" />} onClick={handleRegisterClick}>사용자 등록</Button>
                        </div>
                    </div>
                </section>

                {/* Table */}
                <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
                    <table className="min-w-full bg-white rounded shadow border">
                        <thead className="sticky top-0 bg-gray-100 z-10">
                            <tr className="text-gray-700 text-sm">
                                <th className="px-4 py-3 text-left font-semibold w-16">번호</th>
                                <th className="px-4 py-3 text-left font-semibold">이름</th>
                                <th className="px-4 py-3 text-left font-semibold">아이디</th>
                                <th className="px-4 py-3 text-left font-semibold">직책</th>
                                <th className="px-4 py-3 text-left font-semibold">상태</th>
                                <th className="px-4 py-3 text-left font-semibold">생성일</th>
                                <th className="px-4 py-3 text-left font-semibold">관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(employees.data?.content ?? []).map((emp, index) => (
                                <tr
                                    key={emp.employeeId}
                                    className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setSelectedEmployee(emp)}
                                >
                                    <td className="px-4 py-3 text-center text-gray-500">
                                        {((pagination.currentPage - 1) * pagination.pageSize) + index + 1}
                                    </td>
                                    <td className="px-4 py-3 flex items-center gap-2">
                                        <i className="fas fa-user-circle text-lg text-gray-500" />
                                        <span>{emp.name}</span>
                                    </td>
                                    <td className="px-4 py-3">{emp.loginId}</td>
                                    <td className="px-4 py-3">
                                        {emp.position === "Administrator" ? (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">관리자</span>
                                        ) : (
                                            <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">일반</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {emp.status === "ACTIVE" ? (
                                            <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium text-green-700 bg-green-100">
                                                <span className="w-1.5 h-1.5 inline-block bg-green-500 rounded-full"></span>
                                                활성화
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium text-red-700 bg-red-100">
                                                <span className="w-1.5 h-1.5 inline-block bg-red-500 rounded-full"></span>
                                                비활성화
                                            </span>
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
                                    <td colSpan={7} className="text-center text-gray-400 py-8">사용자가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={pagination.currentPage}
                    pageSize={pagination.pageSize}
                    totalElements={pagination.totalElements}
                    onPageChange={pagination.onPageChange}
                />
            </div>

            {/* 사용자 정보 수정 모달 */}
            <Modal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">사용자 정보 수정</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="이름"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    fullWidth
                                />
                                <Select
                                    label="직책"
                                    placeholder="직책을 선택하세요"
                                    selectedKeys={editPosition ? [editPosition] : []}
                                    onChange={(e) => setEditPosition(e.target.value)}
                                >
                                    <SelectItem key="normal" value="normal">
                                        일반
                                    </SelectItem>
                                    <SelectItem key="Administrator" value="Administrator">
                                        관리자
                                    </SelectItem>
                                </Select>
                                <Switch
                                    isSelected={editStatus}
                                    onValueChange={setEditStatus}
                                    color="success"
                                >
                                    {editStatus ? "활성" : "비활성"}
                                </Switch>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onClick={onClose}>
                                    취소
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={handleSaveChanges}
                                >
                                    저장
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* 사용자 등록 모달 */}
            <Modal isOpen={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">사용자 등록</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="아이디"
                                    value={registerLoginId}
                                    onChange={(e) => setRegisterLoginId(e.target.value)}
                                    fullWidth
                                />
                                <Input
                                    label="비밀번호"
                                    type="password"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                    fullWidth
                                />
                                <Input
                                    label="이름"
                                    value={registerName}
                                    onChange={(e) => setRegisterName(e.target.value)}
                                    fullWidth
                                />
                                <Select
                                    label="직책"
                                    placeholder="직책을 선택하세요"
                                    selectedKeys={registerPosition ? [registerPosition] : []}
                                    onChange={(e) => setRegisterPosition(e.target.value)}
                                >
                                    <SelectItem key="normal" value="normal">
                                        일반
                                    </SelectItem>
                                    <SelectItem key="Administrator" value="Administrator">
                                        관리자
                                    </SelectItem>
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onClick={onClose}>
                                    취소
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={handleRegisterSave}
                                >
                                    저장
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default EmployeePage;
