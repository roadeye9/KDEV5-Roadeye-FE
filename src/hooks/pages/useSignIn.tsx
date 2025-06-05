import { useCallback, useState } from "react";

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


    const handleOnChange = useCallback(<K extends keyof SignInForm>(key: K, value: SignInForm[K]) => {
        setSignInForm({
            ...signInForm,
            [key]: value
        })
    }, [signInForm])

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        console.log(signInForm); 
    }, [signInForm])

    return {
        signInForm,
        handleOnChange,
        handleSubmit
    }
}