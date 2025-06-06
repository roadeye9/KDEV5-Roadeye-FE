import React from "react";
import { Pagination } from "@nextui-org/react";

interface EmployeeFooterProps {
    totalEmployees: number;
    pageSize?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
}

export const EmployeeFooter: React.FC<EmployeeFooterProps> = ({
    totalEmployees,
    pageSize = 20,
    currentPage = 1,
    onPageChange
}) => {
    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalEmployees / pageSize);

    // 빈 행 수 계산
    const getEmptyRowsCount = () => {
        const itemsInCurrentPage = currentPage === totalPages
            ? totalEmployees % pageSize || pageSize
            : pageSize;
        return pageSize - itemsInCurrentPage;
    };

    return (
        <div className="flex justify-between items-center px-4 py-2 border-t border-divider">
            <div className="text-sm text-gray-500">
                {`총 ${totalEmployees}명의 직원 중 ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, totalEmployees)}명 표시 중`}
                {getEmptyRowsCount() > 0 && ` (빈 행: ${getEmptyRowsCount()})`}
            </div>
            <Pagination
                total={totalPages}
                page={currentPage}
                onChange={onPageChange}
                size="sm"
                showControls
                variant="bordered"
                classNames={{
                    wrapper: "gap-1",
                    item: "w-8 h-8",
                }}
            />
        </div>
    );
}; 