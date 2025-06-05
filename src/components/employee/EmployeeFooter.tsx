import { Pagination } from "@nextui-org/react";

export const EmployeeFooter = () => {
    return (
        <div className="flex flex-row justify-center items-center gap-4 py-4">
            <Pagination
                total={10}
                initialPage={1}
                size="sm"
                radius="sm"
                showControls
                isCompact
                classNames={{
                    wrapper: "gap-0 overflow-visible",
                    item: "w-8 h-8",
                    cursor: "bg-primary-500",
                }}
            />
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Rows per page:</span>
                <select className="bg-transparent border-none outline-none">
                    <option>10</option>
                    <option>20</option>
                    <option>30</option>
                    <option>40</option>
                    <option>50</option>
                </select>
                <span>1-10 of 100</span>
            </div>
        </div>
    );
}; 