import { useCallback, useState } from "react";
import { useSignInMutation } from "../api/auth";
import { useNavigate } from "react-router-dom";

export interface SignInForm {
    tenantId: string;
    username: string;
    password: string;
}

const defaultValue = {
    tenantId: "",
    username: "",
    password: ""
};
export const useSignIn = () => {
    const [signInForm, setSignInForm] = useState<SignInForm>(defaultValue)
    const navigate = useNavigate();
    const mutation = useSignInMutation();


    const handleOnChange = useCallback(<K extends keyof SignInForm>(key: K, value: SignInForm[K]) => {
        setSignInForm({
            ...signInForm,
            [key]: value
        })
    }, [signInForm])

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        console.log(signInForm);
        mutation.mutate(signInForm, {
            onSuccess: () => {
                localStorage.setItem("tenantId", signInForm.tenantId);
                navigate(`/manage/dashboard`);
            }
        });
    }, [signInForm])

    return {
        signInForm,
        handleOnChange,
        handleSubmit
    }
}