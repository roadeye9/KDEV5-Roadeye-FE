import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
} from "@nextui-org/react";
import { Employee } from "@/api/auth";
import { EMPLOYEE_TABLE_COLUMNS } from "./EmployeeTable.column";
import { EmployeeTableColumn } from "./EmployeeTableColumn";
import { EmployeeCreateForm } from "../employee/EmployeeCreateForm";
import { useEmployeeTable } from "./useEmployeTable";

interface EmployeeTableProps {
    employees: Employee[];
    pageSize?: number;
    currentPage?: number;
}

export default function EmployeeTable({ 
    employees, 
    pageSize = 20, 
    currentPage = 0
}: EmployeeTableProps) {

    const { getEmptyRows, handleOnChange, handleSubmit, isCreateFormOpen, handleOpenCreateForm, handleCloseCreateForm} = useEmployeeTable({
        length: employees.length, 
        size: pageSize, 
        page: currentPage
    });


    const displayItems = [...employees, ...getEmptyRows()]; 
    
    return (
        <div className="h-full flex flex-col ">
            <div className="flex justify-end">
                <Drawer isOpen={isCreateFormOpen} onClose={handleCloseCreateForm}> 
                        <DrawerContent>
                            <DrawerHeader>
                            </DrawerHeader>
                            <DrawerBody>
                              <EmployeeCreateForm onFormChange={handleOnChange} onSubmit={handleSubmit}/>
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>

            </div>
            <div className="flex justify-between items-center mb-4 pt-3">
                <div className="flex items-center gap-4"></div>
                <div className="flex items-center gap-4">
                    <Button color="primary" variant="solid"  radius="none" onPress={handleOpenCreateForm}>
                        직원 추가
                    </Button>
                    <Button variant="light" radius="sm">
                        Import/Export
                    </Button>
                    <Button variant="light" radius="sm">
                        View
                    </Button>
                </div>
            </div>

            <div className="ml-2 border border-divider flex-1">
                <div className="h-[calc(100vh-200px)] min-h-[400px] overflow-auto">
                    <Table 
                        aria-label="Employee table"
                        className="min-w-[1200px]"
                        radius="none"
                        shadow="none"
                        selectionMode="single"
                        isCompact={true}
                        removeWrapper
                        classNames={{
                            td: [
                                "border border-divider",
                                "first:border-l-0",
                            ],
                            th: "border border-divider bg-white sticky top-0 z-10 first:border-l-0",
                            table: "w-full",
                            tr: [
                                "even:bg-gray-50",
                                "odd:bg-white",
                            ],
                        }}
                    >
                        <TableHeader columns={EMPLOYEE_TABLE_COLUMNS}>
                            {(column) => (
                                <TableColumn key={column.name} hidden={column.hidden}>{column.displayName}</TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={displayItems}>
                            {(item: any) => (
                                <TableRow key={item.employeeId}>
                                    {EMPLOYEE_TABLE_COLUMNS.map((column) => (
                                        <TableCell key={column.name} hidden={column.hidden}>
                                            {item.isEmpty ? (
                                                <>&nbsp;</>
                                            ) : (
                                                <EmployeeTableColumn employee={item} columnKey={column.name} />
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
} 