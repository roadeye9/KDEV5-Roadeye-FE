import { Employee } from "@/api/auth";
import { queryClient } from "@/app";
import { EMPLOYEE_QUERY_KEY, useEmployeeMutation } from "@/hooks/api/employee";
import { useCallback, useState } from "react";


export interface IEmployeeCreateForm extends Omit<Employee, "employeeId" | "tenantId">{    
    password: string; 
}


export const useEmployeeTable = ({length, size, page}: {length: number, size: number, page: number}) => {
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const mutation = useEmployeeMutation();
    const [employeeCreateForm, setEmployeeCreateForm] = useState<IEmployeeCreateForm>({
        loginId: "",
        password: "",
        name: "",
        position: ""
    });

    const handleOnChange = useCallback(<K extends keyof IEmployeeCreateForm>(key: K, value: IEmployeeCreateForm[K]) => {
        setEmployeeCreateForm({
            ...employeeCreateForm,
            [key]: value
        })
    }, [employeeCreateForm])

    const handleSubmit = useCallback(() => {
        mutation.mutate(employeeCreateForm, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: EMPLOYEE_QUERY_KEY.list({ page: page, size: size }) });
                handleCloseCreateForm();
            }
        });
    }, [employeeCreateForm])


    const getEmptyRows = useCallback(() => {
        const totalItems = size;
        const currentItems = length;
        const emptyRowsCount = Math.max(0, totalItems - currentItems);
        
        return Array(emptyRowsCount).fill(null).map((_, index) => ({
            employeeId: `empty-${index}`,
            isEmpty: true
        }));
    }, [length, size]);


    const handleOpenCreateForm = useCallback(() => {
        setIsCreateFormOpen(true);
    }, [isCreateFormOpen])

    const handleCloseCreateForm = useCallback(() => {
        setIsCreateFormOpen(false);
    }, [isCreateFormOpen])

    return {
        getEmptyRows,
        handleOnChange,
        handleSubmit,
        isCreateFormOpen,
        handleOpenCreateForm,
        handleCloseCreateForm
    }

}