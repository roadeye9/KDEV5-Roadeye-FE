import { useEmployeeQuery } from "../api/employee"


export const useEmployee = () => {

    const {data, isLoading, error} = useEmployeeQuery({
        page: 0,
        size: 10,
    })

    return {
        employees: {
            data,
            isLoading,
            error
        }
    }

}