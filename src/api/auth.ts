import { SignInForm } from "@/hooks/pages/useSignIn";
import { axiosInstance } from "./axiosInstance";

export interface Employee {
    employeeId: number;
    tenantId: number;
    loginId: string;
    name: string;
    position: string;
    createdAt: string;
    status: string;
}

export const signIn = async (form: SignInForm) => {
    await axiosInstance.post("/auth/sign-in", form, {
        headers: {
            "X-Company-Id": form.tenantId
        },
        useTenant: false,
    });
}

export const getMy = async (): Promise<Employee> => {
    const response = await axiosInstance.get<Employee>('/employees/my', {
        useTenant: true
    });
    return response.data;
}

