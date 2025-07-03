import { useVehicleQuery } from "../api/vehicle"
import { useState } from "react"

export const useVehicle = () => {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [status, setStatus] = useState<"ON" | "OFF" | undefined>(undefined);

    const { data, isLoading, error } = useVehicleQuery({
        page,
        size: pageSize,
        status: status,
    })

    const handlePageChange = (newPage: number) => {
        setPage(newPage - 1); // NextUI의 페이지네이션은 1부터 시작하므로 0-based로 변환
    };

    const handlePageSizeChange = (newSize: number) => {
        setPageSize(newSize);
        setPage(0); // 페이지 크기가 변경되면 첫 페이지로 이동
    };

    return {
        vehicles: {
            data,
            isLoading,
            error
        },
        pagination: {
            currentPage: page + 1, // 1-based로 변환
            pageSize,
            totalElements: data?.pageInfo.total ?? 0,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
        },
        status,
        setStatus,
    }
} 